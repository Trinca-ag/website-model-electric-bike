/**
 * Ícones inline em SVG.
 * Evita uma dependência de biblioteca de ícones — só o que é usado vai pro bundle,
 * e como são Server Components por padrão, nada disso vira JavaScript no cliente.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    'aria-hidden': true,
    focusable: false,
    ...props,
  } as SVGProps<SVGSVGElement>
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base({ strokeWidth: 2.5, ...props })}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function IconArrowDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  )
}

export function IconMapPin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base({ strokeLinecap: 'round', ...props })}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export function IconBolt(props: IconProps) {
  return (
    <svg
      {...base({
        strokeWidth: 2.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...props,
      })}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export function IconCoins(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 18v2m0-14v2" />
    </svg>
  )
}

export function IconNoLicense(props: IconProps) {
  return (
    <svg {...base({ strokeLinecap: 'round', ...props })}>
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  )
}

export function IconLeaf(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 22c4.24-.71 8.54-4.06 10.18-8 2.3-5.52-.26-11.37-5-14 0 3.67.87 7.05 3 9z" />
    </svg>
  )
}

export function IconWrench(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export function IconSun(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  )
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

export function IconStopwatch(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9.5 2.5h5" />
      <path d="M12 2.5v2" />
    </svg>
  )
}

export function IconTag(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  )
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m-2 9h8l-1.68-4.19A2 2 0 0 0 18.4 12H13a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2z" />
    </svg>
  )
}

export function IconCreditCard(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}

export function IconFilter(props: IconProps) {
  return (
    <svg {...base(props)}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="10" y1="18" x2="14" y2="18" />
    </svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function IconGrid(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  )
}

export function IconList(props: IconProps) {
  return (
    <svg {...base(props)}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

export function IconBike(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5l4-4-3-3-3 3 1.5 3M9 6l3 2.5" />
    </svg>
  )
}

export function IconScooter(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M6 19h9l3-13h2" />
    </svg>
  )
}

export function IconWaves(props: IconProps) {
  return (
    <svg
      {...base({ strokeLinecap: 'round', strokeLinejoin: 'round', ...props })}
    >
      <path d="M2 16c2 0 3-1.5 5-1.5s3 1.5 5 1.5 3-1.5 5-1.5 3 1.5 5 1.5" />
      <path d="M2 20c2 0 3-1.5 5-1.5s3 1.5 5 1.5 3-1.5 5-1.5 3 1.5 5 1.5" />
    </svg>
  )
}

/** WhatsApp — glifo sólido, não usa stroke. */
export function IconWhatsapp({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}




