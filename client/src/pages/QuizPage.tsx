import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnswerFeedback } from '@/components/AnswerFeedback';
import { ChoiceList } from '@/components/ChoiceList';
import { QuestionCard } from '@/components/QuestionCard';
import { QuizSettings } from '@/components/QuizSettings';
import { SessionScoreCard } from '@/components/SessionScoreCard';
import { Spinner } from '@/components/Spinner';
import { TypingForm } from '@/components/TypingForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLevelCounts } from '@/hooks/useLevelCounts';
import { useQuizHotkeys } from '@/hooks/useQuizHotkeys';
import { useQuizPrefs } from '@/hooks/useQuizPrefs';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useI18n } from '@/i18n';
import { apiErrorMessage } from '@/lib/api-error';
import { Paths } from '@/routes/paths';
import { ApiError } from '@/services/http';
import './QuizPage.css';

export const QuizPage = () => {
    const { t, language } = useI18n();
    const { isAdmin } = useAuth();
    const { prefs, updatePrefs } = useQuizPrefs();
    const counts = useLevelCounts();
    const session = useQuizSession(prefs, language);
    const { question, result, given, loading, submitting, overridden, error, score } = session;

    const choices = question?.choices ?? [];
    const choose = useCallback((index: number) => void session.submit(choices[index]), [session.submit, choices]);
    const next = useCallback(() => void session.loadNext(), [session.loadNext]);

    useQuizHotkeys({
        choiceCount: question?.mode === 'choice' ? choices.length : 0,
        answered: result !== null,
        disabled: loading || submitting,
        onChoose: choose,
        onNext: next,
    });

    const notEnoughWords = error instanceof ApiError && error.code === 'NOT_ENOUGH_WORDS';

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
                        {question.mode === 'choice' ? (
                            <ChoiceList
                                choices={choices}
                                japanese={question.qtype === 'read'}
                                selected={given}
                                correctAnswer={result?.correctAnswer}
                                disabled={loading || submitting}
                                onChoose={(choice) => void session.submit(choice)}
                            />
                        ) : (
                            <TypingForm
                                lang={question.lang}
                                disabled={loading || submitting}
                                answered={result !== null}
                                onSubmit={(answer) => void session.submit(answer)}
                            />
                        )}
                        {error !== null && <div className="msg ng quiz-error">{apiErrorMessage(error, t)}</div>}
                        {result && (
                            <AnswerFeedback
                                result={result}
                                given={given}
                                overridden={overridden}
                                busy={submitting}
                                onOverride={() => void session.override()}
                                onNext={next}
                            />
                        )}
                        {!result && question.mode === 'choice' && <div className="hint quiz-hint">{t('choiceHotkeys')}</div>}
                    </div>
                )}
            </section>
        </main>
    );
};
