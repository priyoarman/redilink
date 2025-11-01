import Link from "next/link";
import Image from "next/image";
import { BiHomeCircle } from "react-icons/bi";
import { CgHashtag } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import MiniProfile from "./MiniProfile";

const LeftBar = () => {
  return (
    <div className="z-20 bg-gray-50 sm:sticky sm:top-0 sm:flex sm:h-screen sm:w-14 sm:flex-col sm:items-stretch sm:justify-center sm:border-r-1 sm:border-gray-200 sm:py-3 lg:w-1/4 lg:px-12">
      <div className="fixed inset-x-0 bottom-0 z-20 flex flex-row items-center justify-around space-y-2 bg-gray-50 py-2 text-black sm:static sm:inset-auto sm:bottom-auto sm:flex sm:h-screen sm:w-fit sm:flex-col sm:items-start sm:justify-start lg:w-1/4">
        <Link
          href={"/"}
          className="hidden hover:bg-gray-200 sm:flex sm:w-full sm:items-center sm:justify-start sm:space-x-2 sm:rounded-3xl sm:px-2 sm:py-2 sm:pl-4 sm:text-[28px] sm:font-bold sm:text-blue-400 sm:transition sm:duration-200"
        >
          <Image
            src="/ReDI.png"
            width={24}
            height={24}
            alt="ReDI"
            className="animate-[spin_5s] [animation-iteration-count:infinite]"
          />
          {/* <p className="hidden lg:block">Twitter</p> */}
        </Link>
        <Link
          href={"/"}
          className="flex w-full items-center justify-center space-x-2 rounded-3xl px-2 py-2 pl-4 text-2xl font-bold text-gray-800 transition duration-200 hover:bg-gray-200 sm:justify-start lg:w-fit lg:px-4 lg:text-xl"
        >
          <BiHomeCircle />
          <p className="hidden lg:block">Home</p>
        </Link>
        <Link
          href={"/explore"}
          className="flex w-full items-center justify-center space-x-2 rounded-3xl px-2 py-2 pl-4 text-2xl font-bold text-gray-800 transition duration-200 hover:bg-gray-200 sm:justify-start lg:w-fit lg:px-4 lg:text-xl"
        >
          <CgHashtag />
          <p className="hidden lg:block">Explore</p>
        </Link>{" "}
        <Link
          href={"/notifications"}
          className="flex w-full items-center justify-center space-x-2 rounded-3xl px-2 py-2 pl-4 text-2xl font-bold text-gray-800 transition duration-200 hover:bg-gray-200 sm:justify-start lg:w-fit lg:px-4 lg:text-xl"
        >
          <IoMdNotificationsOutline />

          <p className="hidden lg:block">Notifications</p>
        </Link>
        <Link
          href={"/messages"}
          className="flex w-full items-center justify-center space-x-2 rounded-3xl px-2 py-2 pl-4 text-2xl font-bold text-gray-800 transition duration-200 hover:bg-gray-200 sm:justify-start lg:w-fit lg:px-4 lg:text-xl"
        >
          <HiOutlineEnvelope />

          <p className="hidden lg:block">Messages</p>
        </Link>
        <Link
          href={"/profile"}
          className="flex w-full items-center justify-center space-x-2 rounded-3xl px-2 py-2 pb-4 pl-4 text-2xl font-bold text-gray-800 transition duration-200 hover:bg-gray-200 sm:justify-start sm:pb-2 lg:w-fit lg:px-4 lg:text-xl"
        >
          <IoPersonOutline />

          <p className="hidden lg:block">Profile</p>
        </Link>
      </div>

      <div className="hidden w-full cursor-pointer flex-row justify-between gap-2 rounded-full px-2 py-2 hover:bg-gray-200 lg:flex">
        <MiniProfile />
      </div>
    </div>
  );
};

export default LeftBar;
