"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, posts, users
  const searchRef = useRef(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = useCallback(async () => {
    try {
      setIsSearching(true);
      const [postsRes, usersRes] = await Promise.all([
        fetch(`/api/search/posts?q=${encodeURIComponent(searchQuery)}&limit=5`),
        fetch(`/api/search/users?q=${encodeURIComponent(searchQuery)}&limit=5`),
      ]);

      const postsData = await postsRes.json();
      const usersData = await usersRes.json();

      setSuggestions({
        posts: postsData.posts || [],
        users: usersData.users || [],
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    // Save to search history
    try {
      await fetch("/api/search/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, type: "all" }),
      });
    } catch (error) {
      console.error("Error saving search history:", error);
    }

    setSearchQuery("");
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSelectSuggestion = (suggestion, type) => {
    if (type === "user") {
      router.push(`/profile/${suggestion.username}`);
    } else if (type === "post") {
      router.push(`/posts/${suggestion._id}`);
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayPosts = suggestions.posts || [];
  const displayUsers = suggestions.users || [];

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2 border border-gray-300 dark:border-gray-700 focus-within:border-blue-400">
        <BsSearch className="text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search for posts, users, hashtags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery);
            }
          }}
          onFocus={() => searchQuery.trim() && setShowDropdown(true)}
          className="w-full ml-3 bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-400 text-sm placeholder:text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSuggestions([]);
              setShowDropdown(false);
            }}
            className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <MdClose size={20} />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 px-4 py-2 text-center font-semibold ${
                    activeTab === "all"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex-1 px-4 py-2 text-center font-semibold ${
                    activeTab === "posts"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 px-4 py-2 text-center font-semibold ${
                    activeTab === "users"
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Users
                </button>
              </div>

              {/* Results */}
              <div className="p-2">
                {(activeTab === "all" || activeTab === "posts") && displayPosts.length > 0 && (
                  <>
                    <div className="text-xs font-semibold text-gray-500 px-4 py-2">POSTS</div>
                    {displayPosts.map((post) => (
                      <button
                        key={post._id}
                        onClick={() => handleSelectSuggestion(post, "post")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded truncate text-sm"
                      >
                        <p className="truncate">{post.body}</p>
                        <p className="text-xs text-gray-500">by @{post.authorUsername}</p>
                      </button>
                    ))}
                  </>
                )}

                {(activeTab === "all" || activeTab === "users") && displayUsers.length > 0 && (
                  <>
                    <div className="text-xs font-semibold text-gray-500 px-4 py-2">USERS</div>
                    {displayUsers.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => handleSelectSuggestion(user, "user")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-3 text-sm"
                      >
                        {user.profileImage && (
                          <Image
                            src={user.profileImage}
                            alt={user.username}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}

                {!isSearching &&
                  displayPosts.length === 0 &&
                  displayUsers.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  )}
              </div>

              {/* Search Button */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 text-sm"
                >
                  Search for "{searchQuery}"
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
