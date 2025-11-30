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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim() && !image) {
      alert("Write something to be seen!");
      return;
      setIsSubmitting(true);
    }

    const formData = new FormData();
    formData.append("body", body);
    if (image) {
      formData.append("image", image)
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setBody("");
        setImage(null);
        setImagePreview(null);
        router.refresh();
      } else {
        throw new Error("Failed to create a post");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false)
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
        placeholder="What's happening?"
      />
      {imagePreview && (
        <div className="relative my-2">
          <img src={imagePreview} alt="Preview" className="rounded-md" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full px-3 py-0.5 pb-1 font-bold"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex flex-row items-center justify-between gap-2 bg-gray-50">
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <div className="flex flex-row">
          <div className="pl-6 text-2xl text-cyan-500">
            <label htmlFor="imageUpload">
              <PiImageSquareBold className="cursor-pointer hover:text-gray-500" />
            </label>
          </div>
          <div className="pl-6 text-2xl text-cyan-500">
            <input type="file" name="" id="gifUpload" hidden />
            <label htmlFor="gifUpload">
              <MdOutlineGifBox className="cursor-pointer hover:text-gray-500" />
            </label>
          </div>
          <div className="pl-6 text-2xl text-cyan-500">
            <input type="file" name="" id="listUpload" hidden />
            <label htmlFor="listUpload">
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
