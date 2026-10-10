import { Mail, PhoneCall, UserRound } from 'lucide-react'
import { CONTACT_EMAIL, NURSE_WHATSAPP_LINK, NURSE_WHATSAPP_NUMBER } from '../content/types'
import { useLanguage } from '../i18n/useLanguage'
import { Section } from './Section'
import { WhatsAppIcon } from './WhatsAppIcon'

// Card order: study nurse (left), emergency (centre), general questions (right).
export function Contact() {
  const { contact } = useLanguage().t
  return (
    <Section id="contact" title={contact.title}>
      <div className="contact-grid">
        <div className="card">
          <UserRound className="card__icon" aria-hidden="true" />
          <h3>{contact.nurse.label}</h3>
          <p>{contact.nurse.text}</p>
          {/* wa.me opens a chat with this number in the WhatsApp app or WhatsApp Web. */}
          <a className="whatsapp-button" href={NURSE_WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="whatsapp-button__icon" />
            <span>
              {contact.nurse.whatsapp}
              <span className="whatsapp-button__number">{NURSE_WHATSAPP_NUMBER}</span>
            </span>
          </a>
        </div>
        <div className="card card--alert">
          <PhoneCall className="card__icon" aria-hidden="true" />
          <h3>{contact.emergency.label}</h3>
          <p>{contact.emergency.text}</p>
        </div>
        <div className="card">
          <Mail className="card__icon" aria-hidden="true" />
          <h3>{contact.general.label}</h3>
          <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        </div>
      </div>
    </Section>
  )
}
