'use client'
import { useParamsStore } from "@/hooks/useParamsStore";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const setParams = useParamsStore(state => state.setParams);
  const [value,setValue] = useState('');

  function search() {
    if(pathname !== '/') router.push('/');
    setParams({searchTerm:value});
  }
  return (
    <div className="flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm">
      <input
        type="text"
        placeholder="Search for cars by make, model or color"
        className="
            input-customer text-sm text-gray-600
        "
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === 'Enter') search();
        }}
      />
      <button onClick={search}>
        <FaSearch size={34} className='bg-red-400 text-white rounded-full p-2'/>
      </button>
    </div>
  );
}
