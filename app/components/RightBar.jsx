"use client";

import RightBarTop from "./RightBarTop";
import RightBarBottom from "./RightBarBottom";
import SearchBar from "./SearchBar";

const RightBar = () => {
  return (
    <div className="sticky hidden flex-col items-stretch gap-3 overflow-x-hidden overflow-y-auto px-2 py-2 sm:flex sm:w-1/4 lg:w-1/4">
      <SearchBar />
      <RightBarTop />
      <RightBarBottom />
    </div>
  );
};

export default RightBar;
