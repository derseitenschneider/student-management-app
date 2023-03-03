export const formatDateToDisplay = (date: string): string => {
  return date.split('-').reverse().join('.')
}

export const formatDateToDatabase = (date: string): string => {
  return date.split('.').reverse().join('-')
}
