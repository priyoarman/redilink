"use client";

import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RightBarTop from "./RightBarTop";
import RightBarBottom from "./RightBarBottom";

const RightBar = () => {
  const [input, setInput] = useState("");
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/search/${input}`);
    setTimeout(() => {
      router.refresh();
    }, 100);
  };
  return (
    <div className="sticky hidden flex-col items-stretch gap-3 overflow-x-hidden overflow-y-auto px-2 py-2 sm:flex sm:w-1/4 lg:w-1/4">
      <form onSubmit={handleSubmit} className="group relative h-fit w-full">
        <input
          id="searchBox"
          className="h-full w-full rounded-xl border border-default bg-panel py-2 pr-4 pl-14 text-primary"
          type="text"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <label
          htmlFor="searchBox"
          className="peer-focus:text-primary absolute top-0 left-0 flex h-full items-center justify-center p-4 text-muted"
        >
          <BsSearch className="h-5 w-5" />
        </label>
      </form>
      <RightBarTop />
      <RightBarBottom />
    </div>
  );
};

export default RightBar;
