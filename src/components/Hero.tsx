import gutBrain from '../assets/illustrations/gut-brain.svg'
import { STUDY_NAME } from '../content/types'
import { useLanguage } from '../i18n/useLanguage'

export function Hero() {
  const { t } = useLanguage()
  return (
    <section id="home" className="hero" aria-labelledby="home-title">
      <div className="container hero__inner">
        <div className="hero__text">
          <p className="hero__eyebrow">{STUDY_NAME}</p>
          <h1 id="home-title">{t.hero.headline}</h1>
          <p className="hero__lead">{t.hero.subheadline}</p>
          <div className="button-row">
            <a className="button button--primary" href="#eligibility">{t.hero.primaryCta}</a>
            <a className="button button--secondary" href="#register">{t.hero.secondaryCta}</a>
          </div>
        </div>
        {/* Decorative: the headline already says what the study is about. */}
        <img className="hero__art" src={gutBrain} alt="" width="520" height="460" />
      </div>
    </section>
  )
}
