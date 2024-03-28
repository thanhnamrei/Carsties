'use client'
import { useAuctionStore } from '@/hooks/useAuctionStore';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, Bid } from '@/types';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { User } from 'next-auth';
import React, { ReactNode, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import AuctionCreatedToast from '../components/AuctionCreatedToast';


type Props ={
    children: ReactNode,
    user: User | null
}
export default function SignalRProvider({children,user}: Props) {
    const [connection,setConnection] = useState<HubConnection | null>(null);
    const addBid = useBidStore(state => state.addBid);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://api.carsties.com/notifications'
        : process.env.NEXT_PUBLIC_NOTIFY_URL;
    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(apiUrl!)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    },[apiUrl])

    useEffect(() => {
        if(connection) {
            connection.start()
                .then(() => {
                    console.log('connected to notification hub' );
                    connection.on("BidPlaced",(bid: Bid) => {
                    
                        if(bid.bidStatus.includes('Accepted')) {
                            setCurrentPrice(bid.auctionId,bid.amount)
                        }
                        addBid(bid);
                    });

                    connection.on('AuctionCreated',(auction: Auction) => {
                        if(user?.username !== auction.seller) {
                            toast(<AuctionCreatedToast auction={auction}/>, {duration: 10000})
                        }
                    })
                }).catch(error => console.log(error))
        }

        return () => {
            connection?.stop();
        }
    },[connection,setCurrentPrice,user?.username,addBid])
  return (
    children
  )
}