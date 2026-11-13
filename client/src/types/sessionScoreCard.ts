import type { SessionScore } from './quiz';

export interface SessionScoreCardProps {
    score: SessionScore;
    onReset: () => void;
}
