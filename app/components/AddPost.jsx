"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PiImageSquareBold } from "react-icons/pi";
import { MdOutlineGifBox } from "react-icons/md";
import { HiMiniListBullet } from "react-icons/hi2";

export default function AddPost() {
  const { data: session, status } = useSession();
  const [body, setBody] = useState("");
  const router = useRouter();

  if (status === "loading") return null;
  if (!session) {
    return (
      <p className="mx-2 my-2 mb-8 flex h-34 items-center justify-center gap-1.5 px-4 py-4 text-center font-semibold text-gray-700">
        Please{" "}
        <a href="/login" className="text-blue-400">
          log in
        </a>{" "}
        to post.
      </p>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      alert("Write something to be seen!");
      return;
    }
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        setBody("");
        router.refresh();
      } else {
        throw new Error("Failed to create a post");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="z-20 flex flex-col justify-around border-b-1 border-gray-200"
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="h-24 resize-none border-b-1 border-gray-200 bg-gray-50 px-4 py-4 outline-0 placeholder:font-medium"
        placeholder="What's on your mind?"
      />
      <div className="flex flex-row items-center justify-between gap-2 bg-gray-50">
        <div className="flex flex-row">
          <div className="pl-6 text-2xl text-cyan-500">
            <input type="file" name="" id="imageUpload" hidden />
            <label htmlFor="imageUpload">
              <PiImageSquareBold className="cursor-pointer hover:text-gray-500" />
            </label>
          </div>
          <div className="pl-6 text-2xl text-cyan-500">
            <input type="file" name="" id="imageUpload" hidden />
            <label htmlFor="imageUpload">
              <MdOutlineGifBox className="cursor-pointer hover:text-gray-500" />
            </label>
          </div>
          <div className="pl-6 text-2xl text-cyan-500">
            <input type="file" name="" id="imageUpload" hidden />
            <label htmlFor="imageUpload">
              <HiMiniListBullet className="cursor-pointer hover:text-gray-500" />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mx-2 my-2 h-10 cursor-pointer rounded-3xl bg-gray-500 px-4 text-sm font-bold text-white hover:bg-cyan-500"
        >
          Post
        </button>
      </div>
    </form>
  );
}
