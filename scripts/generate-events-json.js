import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function parseFileNumber(fileName) {
  return fileName
    .replace(/\.md$/, '')
    .split('.')
    .map((part) => Number(part))
}

function compareFileNames(a, b) {
  const aParts = parseFileNumber(a)
  const bParts = parseFileNumber(b)

  const maxLength = Math.max(aParts.length, bParts.length)

  for (let i = 0; i < maxLength; i++) {
    const aVal = aParts[i] ?? 0
    const bVal = bParts[i] ?? 0

    if (aVal !== bVal) {
      return aVal - bVal
    }
  }

  // 57 < 57.1
  return aParts.length - bParts.length
}

function getEventsForLang(lang) {
  const dir = path.join(process.cwd(), 'data/events', lang)

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .sort(compareFileNames)

  return files.map((file) => {
    const fullPath = path.join(dir, file)
    const fileContent = fs.readFileSync(fullPath, 'utf-8')
    const { data, content } = matter(fileContent)

    return {
      ...data,
      description: content.trim(),
    }
  })
}

const languages = ['tr', 'en', 'de']

languages.forEach((lang) => {
  const events = getEventsForLang(lang)
  const outputPath = path.join(process.cwd(), 'app/json', `events_${lang}.json`)

  fs.writeFileSync(outputPath, JSON.stringify(events, null, 2), 'utf-8')
})
