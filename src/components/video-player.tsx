'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  mp4Src: string
  webmSrc?: string
  posterSrc: string
  objectPosition?: string
}

function getType(src: string): string | undefined {
  if (src.endsWith('.webm')) return 'video/webm'
  if (src.endsWith('.mp4')) return 'video/mp4'
  if (src.endsWith('.ogg') || src.endsWith('.ogv')) return 'video/ogg'
  return undefined
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mp4Src, webmSrc, posterSrc, objectPosition = 'center' }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const attemptPlay = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      // Reset to beginning if needed and ensure muted (required for autoplay)
      video.muted = true
      await video.play()
      setIsPlaying(true)
    } catch {
      // Autoplay was blocked — retry once after a short delay
      retryTimerRef.current = setTimeout(async () => {
        retryTimerRef.current = null
        try {
          if (video.paused) {
            await video.play()
            setIsPlaying(true)
          }
        } catch {
          // Autoplay truly blocked (e.g. strict browser policy).
          // The poster image remains visible as fallback.
        }
      }, 500)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlaying = () => setIsPlaying(true)
    const onCanPlay = () => {
      if (video.paused) attemptPlay()
    }

    video.addEventListener('playing', onPlaying)
    video.addEventListener('canplay', onCanPlay)

    // If the video is already ready (cached), kick-start it immediately
    if (video.readyState >= 3) {
      attemptPlay()
    }

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('canplay', onCanPlay)
      if (retryTimerRef.current !== null) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
    }
  }, [attemptPlay])

  return (
    <div className="relative w-full h-full">
      {/* Poster/still image — always rendered underneath, visible until video plays */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition }}
      />

      {/* Video element — layered on top, fades in once playing */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectPosition }}
        poster={posterSrc}
        autoPlay
        playsInline
        loop
        muted
        controls={false}
        preload="auto"
      >
        {webmSrc && <source src={webmSrc} type={getType(webmSrc)} />}
        <source src={mp4Src} type={getType(mp4Src)} />
      </video>
    </div>
  )
}

export default VideoPlayer
