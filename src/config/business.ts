export const BUSINESS = {
  name: 'JUKI REPAIR',
  owner: 'R.A.Saman Kumara',
  address: 'No. 374 1/B Watareka, Padukka, Sri Lanka',
  phoneDisplay: '+9477 949 1631',
  phoneE164: '+9477 949 1631',
  whatsappE164: '+9474 338 5599',
}

export function telHref(phoneE164: string) {
  return `tel:${phoneE164.replace(/\s+/g, '')}`
}

export function whatsappHref(phoneE164: string, message?: string) {
  const digits = phoneE164.replace(/[^\d+]/g, '')
  const text = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${digits.replace('+', '')}${text}`
}

