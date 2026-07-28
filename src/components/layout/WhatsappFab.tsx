import { IconWhatsapp } from '@/components/ui/Icons'
import { waLink } from '@/lib/whatsapp'

export default function WhatsappFab() {
  return (
    <a
      href={waLink(
        'Olá! Gostaria de mais informações sobre os modelos disponíveis.',
      )}
      className="wa"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <IconWhatsapp size={24} style={{ color: '#fff' }} />
    </a>
  )
}
