import { useEffect, useState } from 'react'
import styles from './styles.module.css'

const BRAND_NAME = 'Simplapp'

interface LoadingProps {
  isVisible?: boolean
}

export function Loading({ isVisible = true }: LoadingProps) {
  const [shouldRender, setShouldRender] = useState(isVisible)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      setIsExiting(false)
    } else {
      // Iniciar animación de salida
      setIsExiting(true)
      // Esperar a que termine la animación antes de desmontar
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 800) // Duración de la animación de fade-out

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-700 ease-out ${isExiting ? 'opacity-0' : 'opacity-100'
        }`}
    >
      <div className={styles.LoadingWave}>
        <div className={styles.LoadingBar} />
        <div className={styles.LoadingBar} />
        <div className={styles.LoadingBar} />
        <div className={styles.LoadingBar} />
      </div>
      <h1 className={styles.title} aria-label={BRAND_NAME}>
        {BRAND_NAME.split('').map((char, i) => (
          <span key={i} className={styles.letter}>
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}

