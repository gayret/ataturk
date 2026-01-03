import { useLanguageStore } from "../stores/languageStore"

const localeMap: Record<string, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  de: 'de-DE',
}

export function formatDate(date: string, languageCode?: string): string {
  const currentLanguageCode = languageCode ?? useLanguageStore.getState().currentLanguageCode
  const locale = localeMap[currentLanguageCode] || 'tr-TR'

  if (date.length === 17) {
    // ay ve yıl
    return new Date(date).toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    })
  } else if (date.length === 14) {
    // sadece yıl
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
    })
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(date).toLocaleDateString(locale, options)
  }
}

export function getYear(date: string): number {
  const year = new Date(date).getFullYear()
  return isNaN(year) ? 0 : year
}

export function convertDateFormat(input: string): string {
  // Input: "31.12.1885 23:00:00"
  // Output: "1885-12-31 23:00:00"
  const [datePart, timePart] = input?.split(" ");
  const [day, month, year] = datePart?.split(".");

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart}`;
}

