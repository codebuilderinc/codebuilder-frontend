'use client'
import React, { useState } from 'react'

interface VideoPlayerProps {
  mp4Src: string
  webmSrc: string
  posterSrc: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ mp4Src, webmSrc, posterSrc }) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadedData = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
          <div className="h-32 w-full bg-gray-400" />
        </div>
      )}
      <video
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-[500px] object-cover ${isLoading ? 'hidden' : 'block'}`}
        poster={posterSrc}
        onLoadedData={handleLoadedData}
        autoPlay={true}
        loop
        muted
        controls={true}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer
