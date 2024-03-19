'use client'

import { placedBidAuction } from '@/app/actions/auctionActions';
import { useBidStore } from '@/hooks/useBidStore';
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
    auctionId: string;
    highBid: number;
}

export default function BidForm({auctionId, highBid}: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors
        }
    } = useForm();

    const addBid = useBidStore(state => state.addBid);

    function onSubmit(data: FieldValues) {
        placedBidAuction(auctionId,+data.amount)
            .then(res => {
                console.log(res);
                if(res.error) throw  res.error;
               
                addBid(res);
                reset();
            }).catch(error => toast.error(error.message))
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className=' border-gray-200 border-2 rounded-lg flex items-center py-2'>
        <input
            type='number'
            {...register('amount')}
            className='input-customer text-sm text-gray-600'
            placeholder={`Enter your bid (minium bid is $${highBid})`}
        />
    </form>
  )
}
