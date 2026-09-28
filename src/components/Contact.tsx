import { Mail, PhoneCall, UserRound } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'
import { Text } from './Text'

export function Contact() {
  const { contact } = useLanguage().t
  return (
    <Section id="contact" title={contact.title}>
      <div className="contact-grid">
        <div className="card">
          <Mail className="card__icon" aria-hidden="true" />
          <h3>{contact.general.label}</h3>
          <p><Text>{contact.general.email}</Text> · <Text>{contact.general.phone}</Text></p>
        </div>
        <div className="card">
          <UserRound className="card__icon" aria-hidden="true" />
          <h3>{contact.nurse.label}</h3>
          <p>{contact.nurse.text}</p>
        </div>
        <div className="card card--alert">
          <PhoneCall className="card__icon" aria-hidden="true" />
          <h3>{contact.emergency.label}</h3>
          <p>{contact.emergency.text}</p>
        </div>
      </div>
    </Section>
  )
}
