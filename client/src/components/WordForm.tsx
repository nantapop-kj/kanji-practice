import { useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useI18n } from '@/contexts';
import { DefaultLevel, JlptLevel, JlptLevels } from '@/enums';
import { apiErrorMessage, validateWord } from '@/lib';
import { wordsApi } from '@/services';
import type { FormMessage, Word, WordFieldErrors, WordFormProps, WordFormState, WordInput } from '@/types';

const Empty: WordFormState = { kanji: '', reading: '', meaningsTh: '', meaningsEn: '', level: DefaultLevel };

const splitMeanings = (value: string): string[] =>
    value
        .split(/[/|]/)
        .map((s: string): string => s.trim())
        .filter(Boolean);

const toForm = (word: Word): WordFormState => ({
    kanji: word.kanji,
    reading: word.reading,
    meaningsTh: word.meaningsTh.join(' / '),
    meaningsEn: word.meaningsEn.join(' / '),
    level: word.level,
});

export const WordForm = ({ editing, onSaved, onCancel }: WordFormProps): JSX.Element => {
    const { t } = useI18n();
    const [form, setForm] = useState<WordFormState>(Empty);
    const [busy, setBusy] = useState<boolean>(false);
    const [message, setMessage] = useState<FormMessage | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect((): void => {
        setSubmitted(false);
        if (editing) {
            setMessage(null);
            setForm(toForm(editing));
        } else {
            setForm((f: WordFormState): WordFormState => ({ ...Empty, level: f.level }));
        }
    }, [editing]);

    const update =
        (key: keyof WordFormState) =>
        (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void =>
            setForm((f: WordFormState): WordFormState => ({ ...f, [key]: e.target.value }));

    const input: WordInput = {
        kanji: form.kanji.trim(),
        reading: form.reading.trim(),
        meaningsTh: splitMeanings(form.meaningsTh),
        meaningsEn: splitMeanings(form.meaningsEn),
        level: form.level,
    };
    const fieldErrors: WordFieldErrors = validateWord(input);
    const visibleErrors: WordFieldErrors = submitted ? fieldErrors : {};

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setSubmitted(true);
        setMessage(null);

        if (Object.keys(fieldErrors).length > 0) return;

        setBusy(true);
        try {
            if (editing) await wordsApi.update(editing.id, input);
            else await wordsApi.create(input);

            setMessage({ ok: true, text: t(editing ? 'wordUpdated' : 'wordAdded', { k: input.kanji }) });
            setForm({ ...Empty, level: form.level });
            setSubmitted(false);
            onSaved();
        } catch (err) {
            setMessage({ ok: false, text: apiErrorMessage(err, t) });
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <h3 className="card-title">{editing ? t('editWord', { k: editing.kanji }) : t('addWord')}</h3>
            <form
                className="form words-form"
                onSubmit={(e: FormEvent<HTMLFormElement>): void => void handleSubmit(e)}
                autoComplete="off"
                noValidate
            >
                <div className="two">
                    <div className="field">
                        <input
                            lang="ja"
                            placeholder={t('phKanji')}
                            value={form.kanji}
                            onChange={update('kanji')}
                            aria-invalid={Boolean(visibleErrors.kanji)}
                            required
                        />
                        {visibleErrors.kanji && <div className="msg ng">{t(visibleErrors.kanji)}</div>}
                    </div>
                    <div className="field">
                        <input
                            lang="ja"
                            placeholder={t('phReading')}
                            value={form.reading}
                            onChange={update('reading')}
                            aria-invalid={Boolean(visibleErrors.reading)}
                            required
                        />
                        {visibleErrors.reading && <div className="msg ng">{t(visibleErrors.reading)}</div>}
                    </div>
                </div>
                <label className="field">
                    <span className="lbl">{t('meaningTh')}</span>
                    <input
                        lang="th"
                        placeholder={t('phMeaningTh')}
                        value={form.meaningsTh}
                        onChange={update('meaningsTh')}
                        aria-invalid={Boolean(visibleErrors.meaningsTh)}
                    />
                    {visibleErrors.meaningsTh && <span className="msg ng">{t(visibleErrors.meaningsTh)}</span>}
                </label>
                <label className="field">
                    <span className="lbl">{t('meaningEn')}</span>
                    <input
                        lang="en"
                        placeholder={t('phMeaningEn')}
                        value={form.meaningsEn}
                        onChange={update('meaningsEn')}
                        aria-invalid={Boolean(visibleErrors.meaningsEn)}
                    />
                    {visibleErrors.meaningsEn && <span className="msg ng">{t(visibleErrors.meaningsEn)}</span>}
                </label>
                <div className="hint">{t('meaningNote')}</div>
                <div className="two">
                    <label className="field">
                        <span className="lbl">{t('level')}</span>
                        <select className="select" value={form.level} onChange={update('level')}>
                            {JlptLevels.map(
                                (level: JlptLevel): JSX.Element => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ),
                            )}
                        </select>
                    </label>
                    <div className="row words-form-actions">
                        {editing && (
                            <button type="button" className="btn ghost sm" onClick={onCancel}>
                                {t('cancel')}
                            </button>
                        )}
                        <button className="btn" disabled={busy}>
                            {t('save')}
                        </button>
                    </div>
                </div>
                {message && <div className={`msg ${message.ok ? 'ok' : 'ng'}`}>{message.text}</div>}
            </form>
        </>
    );
};
