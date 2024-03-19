'use client'
import { getBidsFroAuction } from '@/app/actions/auctionActions'
import Heading from '@/app/components/Heading'
import { useBidStore } from '@/hooks/useBidStore'
import { Auction, Bid } from '@/types'
import { User } from 'next-auth'
import React, { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import BidItem from './BidItem'
import EmptyFilter from '@/app/components/EmptyFilter'
import BidForm from './BidForm'

type Props = {
    user: User | null,
    auction: Auction
}

export default function BidList({ user, auction }: Props) {
    const bids = useBidStore(state => state.bids);
    const setBids = useBidStore(state => state.setBids);
    const [loading, setLoading] = useState(true);
    const highBid = bids.reduce((prev, current) => prev > current.amount ? prev : current.amount, 0)
    useEffect(() => {
        getBidsFroAuction(auction.id)
            .then((res: any) => {
                if (res.error) throw new res.error;
                setBids(res as Bid[]);

            }).catch((error: any) => {
                toast.error(error.code + ' ' + error.message)
            }).finally(() => setLoading(false))
    }, [auction.id, setLoading, setBids])

    if (loading) return <div>Loading ...</div>
    return (
        <div className=" rounded-lg shadow-md ">
            <div className=' py-2 px-4 bg-white'>
                <div className=' sticky top-0 p-2 bg-white'>
                    <Heading title={`Current high bid is $${highBid}`} />
                </div>
            </div>
            <div className=' overflow-auto h-[400px] flex flex-col-reverse px-2'>
                {
                    bids.length === 0
                        ? <EmptyFilter title='No bids for this item' subtitle='Please feel free to make bid' />
                        : <>
                            {bids.map(bid => (
                                <BidItem key={bid.id} bid={bid} />
                            ))}
                        </>
                }
            </div>
            <div className='pb-2 px-2 text-gray-500'>
                {!user ? (
                    <div className=' flex items-center justify-center p-2 text-lg font-semibold'>
                        Please login to make bid
                    </div>
                ) : user && user.username === auction.seller ? (
                    <div className=' flex items-center justify-center p-2 text-lg font-semibold'>
                        You cannot bid your own auction
                    </div>
                ) :
                    <BidForm auctionId={auction.id} highBid={highBid} />

                }
            </div>
        </div>
    )
}
