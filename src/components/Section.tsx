import type { ReactNode } from 'react'

type Props = {
  id: string
  title: string
  subtitle?: string
  tone?: 'plain' | 'tinted'
  children: ReactNode
}

export function Section({ id, title, subtitle, tone = 'plain', children }: Props) {
  return (
    <section id={id} className={`section section--${tone}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="section__header">
          <h2 id={`${id}-title`}>{title}</h2>
          {subtitle && <p className="section__subtitle">{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
