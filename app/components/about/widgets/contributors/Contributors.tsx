import { useEffect, useState, useRef } from 'react'
import styles from './Contributors.module.css'
import Link from 'next/link'
import { useLanguageStore } from '@/app/stores/languageStore'

type Contributor = {
  login: string
  avatar_url: string
  html_url: string
  type: string
  contributions: number
}

type UserProfile = {
  login: string
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

const HoverCard = ({
  contributor,
  userProfile,
  isVisible,
  position,
  isLoading,
  onMouseEnter,
  onMouseLeave,
}: {
  contributor: Contributor
  userProfile: UserProfile | null
  isVisible: boolean
  position: { x: number; y: number }
  isLoading: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}) => {
  if (!isVisible) return null

  return (
    <div
      className={styles.hovercard}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isLoading ? (
        <div className={styles.hovercardLoading}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading...</span>
        </div>
      ) : userProfile ? (
        <>
          <div className={styles.hovercardHeader}>
            <img
              src={userProfile.avatar_url}
              alt={userProfile.login}
              className={styles.hovercardAvatar}
            />
            <div className={styles.hovercardInfo}>
              <h4 className={styles.hovercardName}>{userProfile.name || userProfile.login}</h4>
              <span className={styles.hovercardUsername}>@{userProfile.login}</span>
            </div>
          </div>

          {userProfile.bio && <p className={styles.hovercardBio}>{userProfile.bio}</p>}

          <div className={styles.hovercardStats}>
            <div className={styles.hovercardStat}>
              <span className={styles.statNumber}>{contributor.contributions}</span>
              <span className={styles.statLabel}>katkı</span>
            </div>
            <div className={styles.hovercardStat}>
              <span className={styles.statNumber}>{userProfile.public_repos}</span>
              <span className={styles.statLabel}>repo</span>
            </div>
            <div className={styles.hovercardStat}>
              <span className={styles.statNumber}>{userProfile.followers}</span>
              <span className={styles.statLabel}>takipçi</span>
            </div>
          </div>

          {userProfile.location && (
            <div className={styles.hovercardLocation}>📍 {userProfile.location}</div>
          )}
        </>
      ) : (
        <div className={styles.hovercardError}>Profil yüklenemedi</div>
      )}
    </div>
  )
}

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [hoveredUser, setHoveredUser] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useLanguageStore()

  useEffect(() => {
    // Fetch contributors from GitHub API
    fetch('https://api.github.com/repos/gayret/ataturk/contributors')
      .then((response) => response.json())
      .then((data) => {
        // data bir dizi değilse (hata durumunda)
        if (!Array.isArray(data)) {
          setContributors([])
          return
        }

        const contributors = data.map((contributor: Contributor) => ({
          login: contributor.login,
          avatar_url: contributor.avatar_url,
          html_url: contributor.html_url,
          type: contributor.type,
          contributions: contributor.contributions || 0,
        }))

        setContributors(
          contributors.filter((contributor: Contributor) => contributor.type !== 'Bot')
        )
      })
      .catch((error) => console.error('Error fetching contributors:', error))
  }, [])

  const fetchUserProfile = async (username: string) => {
    setIsLoadingProfile(true)
    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      const userData = await response.json()
      setUserProfile(userData)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleMouseEnter = (contributor: Contributor, event: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    const rect = event.currentTarget.getBoundingClientRect()
    setHoverPosition({
      x: rect.left + rect.width / 2 - 150, // Kartı ortala
      y: rect.top - 10, // Avatar'ın üstünde göster
    })

    setHoveredUser(contributor.login)
    fetchUserProfile(contributor.login)
  }

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredUser(null)
      setUserProfile(null)
    }, 300) // 300ms gecikme ile kapat
  }

  const handleCardMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
  }

  const handleCardMouseLeave = () => {
    setHoveredUser(null)
    setUserProfile(null)
  }

  return (
    contributors.length > 0 && (
      <>
        <section>
          <small>
            {t.About.Contributors.intro}&nbsp;
            <Link href='https://github.com/gayret/ataturk' target='_blank'>
              {t.About.Contributors.linkText}
            </Link>
            .
          </small>

          <h2>{t.About.Contributors.title}</h2>

          <div className={styles.contributors}>
            {contributors.map((contributor, index) => (
              <a
                href={contributor.html_url}
                key={index}
                title={contributor.login}
                target='_blank'
                className={styles.contributor}
                onMouseEnter={(e) => handleMouseEnter(contributor, e)}
                onMouseLeave={handleMouseLeave}
              >
                <img src={contributor.avatar_url} width={50} height={50} alt={contributor.login} />
              </a>
            ))}
          </div>
        </section>

        <HoverCard
          contributor={contributors.find((c) => c.login === hoveredUser)!}
          userProfile={userProfile}
          isVisible={!!hoveredUser}
          position={hoverPosition}
          isLoading={isLoadingProfile}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      </>
    )
  )
}
