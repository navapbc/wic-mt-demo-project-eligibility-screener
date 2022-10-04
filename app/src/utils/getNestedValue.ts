const getNestedValue = (obj: object, path: string) => {
  return path
    .split('.')
    .reduce((acc: object, val: string) => acc?.[val as keyof typeof acc], obj)
}

export default getNestedValue
