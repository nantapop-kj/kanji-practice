import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Pagination } from "@/components/Pagination";
import { Spinner } from "@/components/Spinner";
import { WordForm } from "@/components/WordForm";
import { WordTable } from "@/components/WordTable";
import { useDebounce } from "@/hooks/useDebounce";
import { useWords } from "@/hooks/useWords";
import { useI18n } from "@/i18n";
import { apiErrorMessage } from "@/lib/api-error";
import { JlptLevels, type JlptLevel } from "@/lib/levels";
import { wordsApi } from "@/services/word.service";
import type { Word } from "@/types/word";
import "./AdminWordsPage.css";

const PageSizes = [10, 20, 50, 100] as const;
const DefaultPageSize = 20;
const SearchDebounceMs = 300;

const toPositiveInt = (value: string | null, fallback: number): number => {
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1 ? n : fallback;
};

const toLevel = (value: string | null): JlptLevel | "" =>
  (JlptLevels as readonly string[]).includes(value ?? "")
    ? (value as JlptLevel)
    : "";

export const AdminWordsPage = () => {
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const page = toPositiveInt(params.get("page"), 1);
  const sizeParam = toPositiveInt(params.get("pageSize"), DefaultPageSize);
  const pageSize = (PageSizes as readonly number[]).includes(sizeParam)
    ? sizeParam
    : DefaultPageSize;
  const level = toLevel(params.get("level"));
  const search = params.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput.trim(), SearchDebounceMs);
  const { data, loading, error, reload } = useWords({
    page,
    pageSize,
    search,
    level,
  });
  const [editing, setEditing] = useState<Word | null>(null);
  const [deleting, setDeleting] = useState<Word | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const updateParams = (
    next: Partial<{
      page: number;
      pageSize: number;
      search: string;
      level: JlptLevel | "";
    }>,
  ) => {
    const merged = { page, pageSize, search, level, ...next };
    const query: Record<string, string> = {
      page: String(merged.page),
      pageSize: String(merged.pageSize),
    };
    if (merged.search) query.search = merged.search;
    if (merged.level) query.level = merged.level;
    setParams(query, { replace: next.search !== undefined });
  };

  useEffect(() => {
    setSearchInput((current) => (current.trim() === search ? current : search));
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search)
      updateParams({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  useEffect(() => {
    if (data && data.totalPages > 0 && page > data.totalPages) {
      updateParams({ page: data.totalPages });
    }
  }, [data, page]);

  const handleEdit = (word: Word) => {
    setEditing(word);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDelete = (word: Word) => {
    setDeleteError("");
    setDeleting(word);
  };

  const closeDelete = () => {
    if (deleteBusy) return;
    setDeleting(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deleting) return;

    setDeleteBusy(true);
    setDeleteError("");
    try {
      await wordsApi.remove(deleting.id);
      if (editing?.id === deleting.id) setEditing(null);
      setDeleting(null);
      reload();
    } catch (err) {
      setDeleteError(apiErrorMessage(err, t));
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <main className="words-admin">
      <section className="card">
        <WordForm
          editing={editing}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
          onCancel={() => setEditing(null)}
        />
      </section>
      <section className="card">
        {error ? (
          <div className="empty">
            <p className="msg ng">{apiErrorMessage(error, t)}</p>
            <button className="btn sm" onClick={reload}>
              {t("retry")}
            </button>
          </div>
        ) : !data ? (
          <div className="empty" role="status">
            <Spinner />
            {t("loading")}
          </div>
        ) : (
          <>
            <WordTable
              words={data.items}
              total={data.total}
              levelCounts={data.levelCounts}
              search={searchInput}
              level={level}
              loading={loading}
              selectedId={editing?.id}
              onSearchChange={setSearchInput}
              onLevelChange={(next) => updateParams({ level: next, page: 1 })}
              onEdit={handleEdit}
              onDelete={openDelete}
            />
            {data.total > 0 && (
              <Pagination
                page={Math.min(page, Math.max(data.totalPages, 1))}
                pageSize={pageSize}
                total={data.total}
                totalPages={data.totalPages}
                pageSizes={PageSizes}
                disabled={loading}
                onPageChange={(next) => updateParams({ page: next })}
                onPageSizeChange={(next) =>
                  updateParams({ pageSize: next, page: 1 })
                }
              />
            )}
          </>
        )}
      </section>
      <ConfirmDialog
        open={deleting !== null}
        title={t("deleteWordTitle")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        busy={deleteBusy}
        error={deleteError}
        danger
        onConfirm={() => void confirmDelete()}
        onCancel={closeDelete}
      >
        {deleting && (
          <>
            <div className="delete-preview">
              <span className="kj" lang="ja">
                {deleting.kanji}
              </span>
              <span className="rd" lang="ja">
                {deleting.reading}
              </span>
              <span className="hint">
                {[
                  deleting.meaningsTh.join(" / "),
                  deleting.meaningsEn.join(" / "),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
            <p className="hint">{t("deleteWordBody")}</p>
          </>
        )}
      </ConfirmDialog>
    </main>
  );
};
