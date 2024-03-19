'use server'
import { Auction, Bid, PagedResult } from "@/types";
import { RedirectType } from "next/navigation";
import { getTokenWorkaround } from "./authActions";
import { fetchWrapper } from "@/lib/fetchWrapper";
import { FieldValues } from "react-hook-form";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    const data = await fetchWrapper.get(`search?${query}`);
    return data;
}
  

export async function  updateAuctionTest() {
  const data = {
    mileage: Math.floor(Math.random() * 100000) + 1
  }

  return await fetchWrapper.put('auctions/47111973-d176-4feb-848d-0ea22641c31a',data)
}

export async function createAuction(data: FieldValues) {
  return await fetchWrapper.post('auctions',data);
}

export async function getDetailedViewData(id:string): Promise<Auction> {
  return await fetchWrapper.get(`auctions/${id}`);
}

export async function updateAuction(data: FieldValues,id: string) {
  return await fetchWrapper.put(`auctions/${id}`,data);
}

export async function deleteAuction(id: string) {
  return await fetchWrapper.del(`auctions/${id}`);
}

export async function getBidsFroAuction(id:string):Promise<Bid[]> {
  return await fetchWrapper.get(`bids/${id}`);
}

export async function placedBidAuction(auctionId:string, amount: number) {
  return await fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`,{});
  
}