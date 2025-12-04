"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import ThemeToggle from "./ThemeToggle";


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
    <div ref={ref} className="relative flex items-center gap-3">
      {open && (
        <div className="absolute right-0 bottom-full mb-1 w-full rounded-lg bg-panel z-50 flex flex-col overflow-hidden border-default border shadow-lg">
          <div className="w-full flex justify-center items-center gap-1 text-center text-[16px] font-bold py-2 px-2 border-b border-default cursor-pointer">
            <ThemeToggle />
          </div>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full flex justify-center items-center gap-1 text-center text-[16px] font-bold py-2 hover-panel hover:text-red-500 cursor-pointer text-primary"
          >
            <IoLogOut /> Logout
          </button>
        </div>
      )}
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
        <div className="text-[16px] font-bold text-primary truncate">
          {user?.name ?? "No User"}
        </div>
        <div className="text-[14px] font-medium text-muted truncate">
          @{user?.username ?? "nouser"}
        </div>
      </div>

      {/* Three Dots */}
      <div className="flex-shrink-0">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 rounded-full hover-panel flex items-center justify-center cursor-pointer"
          aria-label="Open profile menu"
        >
          <BsThreeDots />
        </button>
      </div>
    </div>
  );
};

export default MiniProfile;
