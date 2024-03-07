'use server'
import { Auction, PagedResult } from "@/types";
import { RedirectType } from "next/navigation";
import { getTokenWorkaround } from "./authActions";

export async function getData(query: string): Promise<PagedResult<Auction>> {
    const res = await fetch(`http://localhost:6001/search${query}`);
    if (!res.ok) throw new Error('Failed to fetch data');

   
    const data = await res.json();


  
    return data;
  }
  

export async function  updateAuctionTest() {
  const data = {
    mileage: Math.floor(Math.random() * 100000) + 1
  }

  const token = await getTokenWorkaround();

  const res = await fetch(`http://localhost:6001/auctions/47111973-d176-4feb-848d-0ea22641c31a`, {
    method: "PUT",
    headers: {
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + token?.access_token
    },
    body: JSON.stringify(data)
  })

  if(!res.ok) return {status: res.status, message: res.statusText}

  return res.statusText;
}