import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useI18n } from '@/contexts';
import { Paths } from '@/routes/paths';
import type { LandingFeature } from '@/types';
import './LandingPage.css';

const Features: LandingFeature[] = [
    { kanji: '読', title: 'featureQuizTitle', body: 'featureQuizBody' },
    { kanji: '弱', title: 'featureWeakTitle', body: 'featureWeakBody' },
    { kanji: '級', title: 'featureLevelTitle', body: 'featureLevelBody' },
];
const SampleChoices: string[] = ['がくせい', 'べんきょう', 'せんせい', 'きょうしつ'];
const SampleAnswer = 'べんきょう';

export const LandingPage = (): JSX.Element => {
    const { t } = useI18n();
    const { user } = useAuth();

    return (
        <main className="landing">
            <section className="landing-hero">
                <div>
                    <span className="badge">JLPT N5–N1</span>
                    <h2>{t('heroTitle')}</h2>
                    <p className="landing-lead">{t('heroLead')}</p>
                    <Link className="btn landing-cta" to={user ? Paths.quiz : Paths.login}>
                        {t('heroCta')}
                    </Link>
                </div>
                <div className="card landing-sample" aria-hidden="true">
                    <div className="hint">{t('sampleLabel')}</div>
                    <div className="landing-sample-kanji" lang="ja">
                        勉強
                    </div>
                    <div className="landing-sample-choices" lang="ja">
                        {SampleChoices.map(
                            (choice: string): JSX.Element => (
                                <div key={choice} className={choice === SampleAnswer ? 'is-correct' : undefined}>
                                    {choice}
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>
            <section className="landing-features">
                {Features.map(
                    (feature: LandingFeature): JSX.Element => (
                        <article key={feature.title} className="card">
                            <div className="landing-feature-kanji" lang="ja" aria-hidden="true">
                                {feature.kanji}
                            </div>
                            <h3>{t(feature.title)}</h3>
                            <p className="hint">{t(feature.body)}</p>
                        </article>
                    ),
                )}
            </section>
        </main>
    );
};
