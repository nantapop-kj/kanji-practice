import { useCallback, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { AnswerFeedback, ChoiceList, QuestionCard, QuizSettings, SessionScoreCard, Spinner, TypingForm } from '@/components';
import { useAuth, useI18n } from '@/contexts';
import { AnswerMode, ErrorCode, QuestionType } from '@/enums';
import { useLevelCounts, useQuizHotkeys, useQuizPrefs, useQuizSession } from '@/hooks';
import { apiErrorMessage } from '@/lib';
import { Paths } from '@/routes/paths';
import { ApiError } from '@/services';
import type { LevelCounts, UseQuizSessionResult } from '@/types';
import './QuizPage.css';

export const QuizPage = (): JSX.Element => {
    const { t, language } = useI18n();
    const { isAdmin } = useAuth();
    const { prefs, updatePrefs } = useQuizPrefs();
    const counts: LevelCounts | null = useLevelCounts();
    const session: UseQuizSessionResult = useQuizSession(prefs, language);
    const { question, result, given, loading, submitting, overridden, error, score } = session;

    const choices: string[] = question?.choices ?? [];
    const choose = useCallback((index: number): void => void session.submit(choices[index]), [session.submit, choices]);
    const next = useCallback((): void => void session.loadNext(), [session.loadNext]);

    useQuizHotkeys({
        choiceCount: question?.mode === AnswerMode.Choice ? choices.length : 0,
        answered: result !== null,
        disabled: loading || submitting,
        onChoose: choose,
        onNext: next,
    });

    const notEnoughWords: boolean = error instanceof ApiError && error.code === ErrorCode.NotEnoughWords;

    return (
        <main className="quiz-layout">
            <aside>
                <QuizSettings prefs={prefs} counts={counts} onChange={updatePrefs} />
                <SessionScoreCard score={score} onReset={session.resetScore} />
            </aside>
            <section className="card quiz-card">
                {loading && !question ? (
                    <div className="empty" role="status">
                        <Spinner />
                        {t('loading')}
                    </div>
                ) : !question ? (
                    <div className="empty">
                        <p className="msg ng">{apiErrorMessage(error, t)}</p>
                        {notEnoughWords && isAdmin && (
                            <p className="hint">
                                <Link to={Paths.adminWords}>{t('addWordsHint')}</Link>
                            </p>
                        )}
                        <button className="btn sm" onClick={next}>
                            {t('retry')}
                        </button>
                    </div>
                ) : (
                    <div className={loading ? 'quiz-loading' : undefined} aria-busy={loading}>
                        <QuestionCard question={question} />
                        {question.mode === AnswerMode.Choice ? (
                            <ChoiceList
                                choices={choices}
                                japanese={question.qtype === QuestionType.Read}
                                selected={given}
                                correctAnswer={result?.correctAnswer}
                                disabled={loading || submitting}
                                onChoose={(choice: string): void => void session.submit(choice)}
                            />
                        ) : (
                            <TypingForm
                                lang={question.lang}
                                disabled={loading || submitting}
                                answered={result !== null}
                                onSubmit={(answer: string): void => void session.submit(answer)}
                            />
                        )}
                        {error !== null && <div className="msg ng quiz-error">{apiErrorMessage(error, t)}</div>}
                        {result && (
                            <AnswerFeedback
                                result={result}
                                given={given}
                                overridden={overridden}
                                busy={submitting}
                                onOverride={(): void => void session.override()}
                                onNext={next}
                            />
                        )}
                        {!result && question.mode === AnswerMode.Choice && (
                            <div className="hint quiz-hint">{t('choiceHotkeys')}</div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
};
