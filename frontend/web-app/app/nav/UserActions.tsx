'use client'
import { Button, Dropdown } from 'flowbite-react'
import { User } from 'next-auth'
import Link from 'next/link'
import React, { use } from 'react'
import {HiCog, HiUser} from 'react-icons/hi2'
import {AiFillTrophy,AiFillCar, AiOutlineLogout} from 'react-icons/ai'
import { signOut } from 'next-auth/react'
type Props = {
  user: Partial<User>;
}

export default function UserActions({user}: Props) {
  return (
   <Dropdown inline label={`Welcome ${user.name}`}>
      <Dropdown.Item icon={HiUser}>
        <Link href='/'>
          My Auctions
        </Link>
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillTrophy}>
        <Link href='/'>
          Auctions won
        </Link>
      </Dropdown.Item>
      <Dropdown.Item icon={AiFillCar}>
        <Link href='/'>
          Sell my car
        </Link>
      </Dropdown.Item>
      <Dropdown.Item icon={HiCog}>
        <Link href='/session'>
         Session (dev only)
        </Link>
      </Dropdown.Item>
      <Dropdown.Divider/>
      <Dropdown.Item icon={AiOutlineLogout} onClick={() => signOut({callbackUrl: '/'})}>
        Sign Out
      </Dropdown.Item>
   </Dropdown>
    // <Button outline>
    //   <Link href='/session'>
    //     Session
    //   </Link>
    // </Button>
  )
}
