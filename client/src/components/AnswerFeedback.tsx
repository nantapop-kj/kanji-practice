import { useEffect, useRef, type JSX, type RefObject } from 'react';
import { useI18n } from '@/contexts';
import type { AnswerFeedbackProps, Word } from '@/types';

export const AnswerFeedback = ({ result, given, overridden, busy, onOverride, onNext }: AnswerFeedbackProps): JSX.Element => {
    const { t } = useI18n();
    const nextButton: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement>(null);
    const word: Word = result.word;

    useEffect((): void => {
        nextButton.current?.focus();
    }, []);

    return (
        <div className={`feedback ${result.correct ? 'ok' : 'ng'}`} role="status" aria-live="polite">
            <div className="verdict">
                {overridden ? t('countedCorrect') : result.correct ? t('answerCorrect') : t('answerWrong')}
            </div>
            {!result.correct && given && <div className="hint">{t('youAnswered', { a: given })}</div>}
            <div className="ans-line">
                <span className="big" lang="ja">
                    {word.kanji}
                </span>
                <span className="rd" lang="ja">
                    {word.reading}
                </span>
                <span className="badge">{word.level}</span>
            </div>
            <div className="ans-meanings">
                {word.meaningsTh.length > 0 && <div lang="th">{word.meaningsTh.join(' / ')}</div>}
                {word.meaningsEn.length > 0 && (
                    <div className="hint" lang="en">
                        {word.meaningsEn.join(' / ')}
                    </div>
                )}
            </div>
            <div className="fb-actions">
                {result.canOverride && (
                    <button type="button" className="btn ghost sm" onClick={onOverride} disabled={busy}>
                        {t('overrideAnswer')}
                    </button>
                )}
                <button ref={nextButton} type="button" className="btn sm" onClick={onNext} disabled={busy}>
                    {t('nextQuestion')}
                </button>
            </div>
            <div className="hint fb-hint">{t('enterForNext')}</div>
        </div>
    );
};
