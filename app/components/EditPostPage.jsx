"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EditPostPage = ({ id, body }) => {
  const [newBody, setNewBody] = useState(body);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newBody }),
      });
      if (!res.ok) throw new Error("Failed to update post");
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sticky z-10 container flex flex-col border-r-1 border-gray-200 py-2 md:w-2/4">
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-col justify-around border-b-1 border-gray-200"
      >
        <input
          onChange={(e) => setNewBody(e.target.value)}
          value={newBody}
          className="mb-2 h-24 resize-none border-b-1 border-gray-200 bg-gray-50 px-4 py-4 outline-blue-400"
          type="text"
          placeholder="What's on your mind?"
        />
        <div className="flex flex-row justify-end-safe">
          <button className="mx-2 my-2 h-10 cursor-pointer rounded-3xl bg-gray-500 px-4 text-sm font-bold text-white hover:bg-blue-400">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostPage;
