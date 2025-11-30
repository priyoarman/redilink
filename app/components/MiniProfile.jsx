"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";


const MiniProfile = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", handleOutside);
    return () => document.removeEventListener("click", handleOutside);
  }, []);

  if (status === "loading") return null;

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-between gap-2 w-full px-2 py-2"
    >
      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-full rounded-lg bg-gray-200 z-50 flex flex-col overflow-hidden">
          <Link
            href="/profile"
            className="w-full flex justify-center items-center gap-1 text-center text-[16px] font-bold py-2 hover:bg-gray-100 cursor-pointer hover:text-cyan-500"
            onClick={() => setOpen(false)}
          >
            <IoSettingsSharp /> Settings
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full flex justify-center items-center gap-1 text-center text-[16px] font-bold py-2 hover:bg-gray-100 cursor-pointer hover:text-red-500"
          >
            <IoLogOut /> Logout
          </button>
        </div>
      )}

      {/* Avatar */}
      <div className="flex-shrink-0">
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-neutral-600 flex items-center justify-center text-white font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>

      {/* Name and Username */}
      <div className="flex flex-col flex-grow min-w-0">
        <div className="text-[16px] font-bold text-gray-800 truncate">
          {user?.name ?? "No User"}
        </div>
        <div className="text-[14px] font-medium text-gray-600 truncate">
          @{user?.username ?? "nouser"}
        </div>
      </div>

      {/* Three Dots */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 rounded-full hover:bg-gray-400 flex items-center justify-center cursor-pointer"
          aria-label="Open profile menu"
        >
          <BsThreeDots />
        </button>
      </div>
    </div>
  );
};

export default MiniProfile;
