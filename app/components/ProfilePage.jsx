"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FaLink } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import Link from "next/link";
import { HiOutlinePencilAlt } from "react-icons/hi";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineRetweet,
  AiOutlineEye,
} from "react-icons/ai";
import Image from "next/image";
import RemoveBtn from "./RemoveBtn";


const ProfilePage = ({ posts }) => {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = React.useState({});
  const [liked, setLiked] = React.useState({});

  React.useEffect(() => {
    const initialLikes = {};
    const initialLiked = {};
    posts.forEach((post) => {
      initialLikes[post._id] = post.likesCount || 0;
      initialLiked[post._id] = post.likedByMe || false;
    });
    setLikesCount(initialLikes);
    setLiked(initialLiked);
  }, [posts]);

  const handleLike = async (postId) => {
    const newLiked = !liked[postId];
    setLiked((prev) => ({ ...prev, [postId]: newLiked }));
    setLikesCount((prev) => ({
      ...prev,
      [postId]: prev[postId] + (newLiked ? 1 : -1),
    }));

    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
    });

    if (res.ok) {
      const { liked: newLikedState, likesCount: newCount } = await res.json();
      setLiked((prev) => ({ ...prev, [postId]: newLikedState }));
      setLikesCount((prev) => ({ ...prev, [postId]: newCount }));
    } else {
      // rollback
      setLiked((prev) => ({ ...prev, [postId]: !newLiked }));
      setLikesCount((prev) => ({
        ...prev,
        [postId]: prev[postId] + (newLiked ? -1 : 1),
      }));
    }
  };

  return (
    <div className="sticky sm:w-2/4 flex flex-col container border-r-1 border-default">
      <div className="w-full">
        <div className="flex flex-row w-full h-42 justify-center items-center bg-gray-500 text-2xl text-white">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={`${session.user.name || 'User'} cover`}
              className="h-[100%] w-[100%] object-cover"
            />
          ) : (
            <div className="h-[100%] w-[100%] bg-gray-500" />
          )}
        </div>
        <div className="flex flex-row justify-between h-36 w-full">
          <div className="flex container justify-center items-center h-32 w-32 ml-6 mt-[-64] rounded-full border-4 border-gray-50 text-2xl text-white overflow-hidden">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={`${session.user.name || 'User'} avatar`}
                className="h-[100%] w-[100%] object-cover rounded-full"
              />
            ) : (
              <div className="flex h-[100%] w-[100%] items-center justify-center bg-cyan-500 text-3xl font-bold text-white">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>
          <div className="py-2 px-2">
            <button onClick={() => signOut()} className="rounded-full px-4 py-2 bg-red-500 text-white font-semibold hover:bg-red-600 cursor-pointer text-shadow-xs text-sm">
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-1 mt-[-72] bg-panel">
        <div className="pb-2">
          <div className="text-xl text-primary font-bold">{session?.user?.name}</div>
          <div className="text-[17px] text-primary font-medium">
            {session?.user?.username ? `@${session.user.username}` : "@username"}
          </div>
        </div>

        <div className="flex felx-row w-fit text-[16px] text-primary">
          Here goes my short bio for Y
        </div>

        <div className="flex felx-row gap-4 w-fit text-[16px]">
          <div className="flex flex-row gap-2">
            <p className="flex flex-row pt-1 text-muted"><FaLink/></p>
            <a href="https://github.com/priyoarman" className="text-blue-400 hover:underline cursor-pointer">github.com/priyoarman</a>
          </div>
          <div className="sm:flex flex-row gap-2 hidden">
            <p className="flex flex-row pt-1 text-muted"><IoCalendarOutline/></p>
            <a className="text-muted cursor-pointer">Joined October 2024</a>
          </div>
        </div>

        <div className="flex felx-row w-fit gap-2 text-[16px] text-gray-800 font-medium">
          <p><span className="font-bold">0</span> Followers</p>
          <p><span className="font-bold">0</span> Following</p>
          
        </div>
      </div>

      <h2 className="text-primary text-xl font-bold px-4 py-4 mb-4 border-y-1 border-default">Posts</h2>

      {posts.length ? (
        <div className="z-20 bg-panel pb-2">
          {posts.map((post) => (
            <div
              key={post._id}
              className="z-20 flex w-full flex-row gap-2 border-slate-300 bg-panel shadow-xs transition-all hover:shadow-sm sm:gap-0 hover-panel"
            >
              <div className="flex w-1/12 flex-col items-start justify-items-start px-4 py-4">
                <div className="flex h-10 w-10 rounded-full bg-neutral-600"></div>
              </div>

              <div className="flex w-11/12 flex-col gap-4 p-4 sm:gap-2">
                <div className="flex h-8 flex-row justify-between p-0">
                  <div className="flex w-full flex-row justify-between gap-2 px-1 sm:pl-0">
                    <div className="flex flex-col sm:flex-row sm:gap-2">
                      <h2 className="cursor-pointer text-[16px] font-bold text-neutral-700 hover:underline sm:text-lg">
                        {post.authorName}
                      </h2>
                      <h3 className="cursor-pointer text-[16px] font-bold text-neutral-500 sm:text-lg">
                        @{post.authorUsername}
                      </h3>
                    </div>

                    <h4 className="mt-1 text-[12px] text-neutral-400 sm:mt-0.5 sm:text-[16px]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </h4>
                  </div>

                  <div className="flex flex-row items-end justify-end">
                    <div className="mt-2 flex w-full flex-row justify-around gap-2">
                      <Link
                        className="pt-0.5 text-cyan-500"
                        href={`/editPost/${post._id}`}
                      >
                        <HiOutlinePencilAlt />
                      </Link>
                      <RemoveBtn id={post._id} />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="my-4 px-1 text-lg text-neutral-600 sm:pl-0">
                    {post.body}
                  </p>
                  <div className="my-4 cursor-pointer text-neutral-600"></div>
                  {post.images && post.images.length > 0 && (
                    <div className="mt-2 overflow-hidden rounded-xl">
                      {post.images.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt="Post image"
                          width={500}
                          height={300}
                          className="w-full object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-row justify-between px-2 pt-2">
                  <div
                    className={`flex cursor-pointer flex-row justify-center gap-1.5 ${
                      liked[post._id]
                        ? "text-red-600"
                        : "text-muted hover:text-red-600"
                    }`}
                    onClick={() => handleLike(post._id)}
                  >
                    {liked[post._id] ? (
                      <AiFillHeart className="text-lg" />
                    ) : (
                      <AiOutlineHeart className="text-lg" />
                    )}
                    <p className="font-semi text-sm">{likesCount[post._id] || 0}</p>
                  </div>

                  <Link
                    className="flex cursor-pointer flex-row justify-center gap-1.5 text-muted hover:text-blue-500"
                    href={`/posts/${post._id}/comments`}
                  >
                    <AiOutlineComment className="cursor-pointer text-lg font-bold" />
                    <p className="font-semi mt-0.5 flex flex-row text-sm">
                      {post.commentsCount ?? 0}
                    </p>
                  </Link>

                  <div className="flex cursor-pointer flex-row justify-center gap-1.5 text-muted hover:text-green-500">
                    <button className="flex flex-row items-center justify-center justify-items-center">
                      <AiOutlineRetweet className="cursor-pointer text-lg font-bold" />
                    </button>
                    <p className="font-semi mt-0.5 flex flex-row text-sm">0</p>
                  </div>

                  <div className="flex cursor-pointer flex-row justify-center gap-1.5 text-muted hover:text-yellow-500">
                    <button className="flex flex-row items-center justify-center justify-items-center">
                      <AiOutlineEye className="cursor-pointer text-lg font-bold" />
                    </button>
                    <p className="font-semi mt-0.5 flex flex-row text-sm">0</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-primary text-lg mx-4 mb-4">
          You haven't posted anything yet.
        </p>
      )}
    </div>
  );
};

export default ProfilePage;
