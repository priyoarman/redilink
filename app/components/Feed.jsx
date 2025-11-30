import { BsSearch } from "react-icons/bs";
import AddPost from "./AddPost";
import MiniProfile from "./MiniProfile";
import PostsList from "./PostsList";
import Link from "next/link";
import Image from "next/image";

export default function Feed() {
  return (
    <div className="sticky z-10 container flex flex-col border-r-1 border-gray-200 py-2 lg:w-2/4">
      <div className="flex h-12 flex-row items-stretch justify-between border-b-1 border-gray-200 sm:hidden">
          <div className="flex h-10 w-10 rounded-full bg-neutral-600 ml-2 cursor-pointer border-1 border-gray-200 px-3 pt-1"></div>
        <Link
          href={"/"}
          className="text-blue-40 flex w-fit items-center justify-center space-x-2 rounded-3xl px-4 pb-2 mx-auto text-[28px] font-bold text-blue-400 transition duration-200 hover:bg-gray-200 lg:w-fit lg:px-4"
        >
          <Image
            src="/ReDI.png"
            width={28}
            height={28}
            alt="ReDI"
            className="animate-[spin_5s] [animation-iteration-count:infinite]"
          />
          {/* <p className="hidden lg:block">Twitter</p> */}
        </Link>
        <div className="mr-2 flex h-10 w-fit cursor-pointer rounded-2xl border-1 border-gray-200 px-3 pt-1">
          🔆
        </div>
      </div>
      <AddPost />
      <PostsList />
    </div>
  );
}
