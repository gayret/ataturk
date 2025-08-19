/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import styles from './Contributors.module.css'

type Contributor = {
  login: string
  avatar_url: string
  html_url: string
  type: string
}

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([])

  useEffect(() => {
    // Fetch contributors from GitHub API
    fetch('https://api.github.com/repos/gayret/ataturk/contributors')
      .then((response) => response.json())
      .then((data) => {
        const contributors = data.map((contributor: Contributor) => ({
          login: contributor.login,
          avatar_url: contributor.avatar_url,
          html_url: contributor.html_url,
          type: contributor.type,
        }))

        setContributors(
          contributors.filter((contributor: Contributor) => contributor.type !== 'Bot')
        )
      })
      .catch((error) => console.error('Error fetching contributors:', error))
  }, [])

  return (
    contributors.length > 0 && (
      <section>
        <h4>Geliştirenler</h4>

        <small>
          Projenin kaynak kodları ve verileri herkese açıktır. Geliştirmek için{' '}
          <a href='https://github.com/gayret/ataturk' target='_blank'>
            <strong>GitHub</strong>&#39;a
          </a>{' '}
          göz atabilirsiniz.
        </small>

        <div className={styles.contributors}>
          {contributors.map((contributor, index) => (
            <a
              href={contributor.html_url}
              key={index}
              title={contributor.login}
              target='_blank'
              className={styles.contributor}
            >
              <img src={contributor.avatar_url} width={50} height={50} alt={contributor.login} />
            </a>
          ))}
        </div>
      </section>
    )
  )
}
