import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function getEventsForLang(lang) {
  const dir = path.join(process.cwd(), 'data/events', lang)

  // 🔥 Dosya adlarını numerik olarak sırala
  const files = fs.readdirSync(dir).sort((a, b) => {
    const aNum = parseInt(a, 10)
    const bNum = parseInt(b, 10)
    return aNum - bNum
  })

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
  fs.writeFileSync(`app/json/events_${lang}.json`, JSON.stringify(events, null, 2))
})
