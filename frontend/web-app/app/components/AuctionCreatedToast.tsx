import { Auction } from '@/types'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
type Props = {
    auction: Auction;
}
export default function AuctionCreatedToast({auction}: Props) {
  return (
    <Link href={`/auctions/details/${auction.id}`} className='flex flex-col items-center'>
        <div className='flex items-center gap-2 flex-row'>
            <Image height={80} width={80} src={auction.imageUrl} className=' rounded-lg w-auto h-auto' alt='image'/>
            <span>New Auction! {auction.make} {auction.model} has been added</span>
        </div>
    </Link>
  )
}
