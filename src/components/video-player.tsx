'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  mp4Src: string
  webmSrc: string
  posterSrc: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mp4Src, webmSrc, posterSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

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
      setTimeout(async () => {
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
    }
  }, [attemptPlay])

  return (
    <div className="relative w-full h-full">
      {/* Poster/still image — always rendered underneath, visible until video plays */}
      <img src={posterSrc} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />

      {/* Video element — layered on top, fades in once playing */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        poster={posterSrc}
        autoPlay
        playsInline
        loop
        muted
        controls={false}
        preload="auto"
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoPlayer
