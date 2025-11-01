const RightBarBottom = () => {
  return (
    <div className="flex flex-col space-y-3 rounded-xl border border-gray-200 bg-gray-50 pt-2 text-gray-800">
      <h3 className="px-4 pt-2 text-xl font-bold">Who to follow</h3>
      <div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 transition duration-200 last:rounded-b-xl hover:bg-white/10"
          >
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 flex-none rounded-full bg-neutral-600"></div>
              <div className="flex flex-col">
                <div className="text-sm font-bold">User{i + 1}</div>
                <div className="text-xs font-medium text-gray-500">
                  @User{i + 3010}
                </div>
              </div>
            </div>

            <button className="cursor-pointer rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-white text-shadow-xs hover:bg-cyan-500">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightBarBottom;
