"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PostCard from "../components/PostCard";
import LeftBar from "../components/LeftBar";
import RightBar from "../components/RightBar";
import { BsSearch } from "react-icons/bs";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("all"); // all, posts, users
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [postsRes, usersRes] = await Promise.all([
          fetch(`/api/search/posts?q=${encodeURIComponent(query)}`),
          fetch(`/api/search/users?q=${encodeURIComponent(query)}`),
        ]);

        const postsData = await postsRes.json();
        const usersData = await usersRes.json();

        if (!postsRes.ok) {
          console.error("Posts error:", postsData);
          setPosts([]);
        } else {
          setPosts(postsData.posts || ["No posts found"]);
        }

        if (!usersRes.ok) {
          console.error("Users error:", usersData);
          setUsers([]);
        } else {
          setUsers(usersData.users || ["No users found"]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch search results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const filteredPosts = activeTab === "all" || activeTab === "posts" ? posts : [];
  const filteredUsers = activeTab === "all" || activeTab === "users" ? users : [];

  return (
    <div className="flex h-screen overflow-hidden bg-panel text-primary">
      <div className="flex-1 flex flex-col border-r border-default lg:w-2/4">
        {/* Search Header */}
        <div className="sticky top-0 z-10 border-b border-default bg-panel bg-opacity-80 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-2xl hover-accent rounded-full p-2"
            >
              ←
            </Link>
            <div className="flex-1">
              <p className="text-xl font-bold">Search Results</p>
              <p className="text-sm text-secondary">
                {query.length > 50 ? query.substring(0, 50) + "..." : query}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-14 z-10 flex border-b border-default bg-panel bg-opacity-80 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 px-4 py-3 text-center font-semibold transition ${
              activeTab === "all"
                ? "border-b-2 border-accent text-accent"
                : "text-secondary hover:text-primary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 px-4 py-3 text-center font-semibold transition ${
              activeTab === "posts"
                ? "border-b-2 border-accent text-accent"
                : "text-secondary hover:text-primary"
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 px-4 py-3 text-center font-semibold transition ${
              activeTab === "users"
                ? "border-b-2 border-accent text-accent"
                : "text-secondary hover:text-primary"
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin">
                <BsSearch size={32} className="text-secondary" />
              </div>
            </div>
          ) : (
            <>
              {filteredPosts.length === 0 && filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-center px-4">
                  <BsSearch size={48} className="text-secondary mb-4" />
                  <p className="text-xl font-bold">No results found</p>
                  <p className="text-secondary">
                    Try searching for posts, users, or hashtags
                  </p>
                </div>
              ) : (
                <>
                  {/* Posts Results */}
                  {filteredPosts.length > 0 && (
                    <div>
                      {filteredPosts.map((post) => (
                        <PostCard key={post._id} post={post} />
                      ))}
                    </div>
                  )}

                  {/* Users Results */}
                  {filteredUsers.length > 0 && (
                    <div className="border-t border-default">
                      {filteredUsers.map((user) => (
                        <Link
                          key={user._id}
                          href={`/profile/${user.username}`}
                          className="flex items-center gap-4 px-4 py-3 hover-accent border-b border-default transition"
                        >
                          {user.profileImage ? (
                            <Image
                              src={user.profileImage}
                              alt={user.username}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{user.name}</p>
                            <p className="text-secondary truncate">@{user.username}</p>
                            {user.bio && (
                              <p className="text-sm text-secondary line-clamp-2 mt-1">
                                {user.bio}
                              </p>
                            )}
                            <p className="text-xs text-secondary mt-1">
                              {user.followers?.length || 0} followers
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
