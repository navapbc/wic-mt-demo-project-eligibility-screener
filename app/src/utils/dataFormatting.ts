// Modified from https://stackoverflow.com/a/8358141
// Expects a 9-digit string
// Returns a string in the format of: ###-###-####
export function formatPhone(phone: string) {
  const parsedPhone = ('' + phone).replace(/\D/g, '')
  const match = parsedPhone.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return ''
}
