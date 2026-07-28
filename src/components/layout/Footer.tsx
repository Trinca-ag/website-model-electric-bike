import Link from 'next/link'

import Logo from '@/components/layout/Logo'
import { FOOTER_SECTIONS, SITE } from '@/data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="fg">
          <div>
            <Logo className="flogo" />
            <p className="ftagline">
              Especialistas em mobilidade elétrica de alta performance. 4
              unidades no Brasil para você testar, comprar e ser assessorado.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="fct">{section.title}</h2>
              <ul className="flinks">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="fct">Suporte</h2>
            <ul className="flinks">
              <li>
                <Link href="/#test-ride">Agendar Test Ride</Link>
              </li>
              <li>
                <Link href="/#unidades">Onde Encontrar</Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar no WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="fbot">
          <div className="fcopy">
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos
            reservados.
          </div>
          <div className="flegal">
            <a href="#">Privacidade</a>
            <a href="#">Termos</a>
            <a href="#">LGPD</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
