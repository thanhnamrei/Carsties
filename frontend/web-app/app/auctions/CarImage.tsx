'use client'
import Image from 'next/image'
import React, { useState } from 'react'

type Props = {
    imageUrl: string
}

export default function CarImage({imageUrl}: Props) {
    const [isLoading,setIsLoading] = useState(true);

  return (
    <Image
            src={imageUrl}
            alt=''
            fill
            priority
            sizes='(max-width:768px) 100vw'
            className={`
                object-cover 
                group-hover:opacity-75
                duration-700 
                ease-in-out
                ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}    
            `
            } 
            onLoadingComplete={() => setIsLoading(false)}/>
  )
}
