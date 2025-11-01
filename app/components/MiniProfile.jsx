import { BsThreeDots } from "react-icons/bs";

const MiniProfile = () => {
  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-row gap-2">
        <div className="flex h-10 w-10 flex-row rounded-full bg-neutral-600"></div>

        <div className="flex-col">
          <div className="hidden text-[16px] font-bold text-gray-800 sm:flex">
            My Name
          </div>
          <div className="hidden text-[14px] font-medium text-gray-600 sm:flex">
            @myusername
          </div>
        </div>
      </div>

      <div className="hidden w-fit flex-col items-center justify-center sm:flex">
        <BsThreeDots />
      </div>
    </div>
  );
};

export default MiniProfile;
