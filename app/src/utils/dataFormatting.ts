// Modified from https://stackoverflow.com/a/8358141
export function formatPhone(phone: string) {
  const stripNonNumbers = ('' + phone).replace(/\D/g, '')
  const match = stripNonNumbers.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return ''
}
