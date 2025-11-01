"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CommentsSection({ postId, initialComments }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!session) {
      alert("Log in to comment.");
      return;
    }
    if (!newComment.trim()) {
      alert("Write something to comment!");
      return;
    };

    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Comment API error:", res.status, err);
        return;
      }
      const data = await res.json();
      setComments((c) => [
        ...c,
        {
          id: data.latestComment._id,
          userId: data.latestComment.user,
          email: data.latestComment.email,
          body: data.latestComment.body,
          createdAt: data.latestComment.createdAt,
        },
      ]);
      setNewComment("");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="z-10 flex w-full flex-row gap-2 border-slate-300 bg-gray-50 shadow-md transition-all hover:shadow-lg pb-12 sm:gap-0">
      <div className="flex w-full flex-col space-y-4">
        <h3 className="px-4 py-2 text-lg font-semibold text-gray-600">
          {comments.length} Comments
        </h3>
        <div className="space-y-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex w-full flex-col border border-gray-100 p-2 pl-4 text-[16px] hover:bg-cyan-50"
            >
              <div className="flex flex-row justify-between">
                <p className="flex font-semibold text-gray-600">{c.email}</p>{" "}
                <span className="text-sm text-neutral-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="flex py-4">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <textarea
            className="h-24 w-full resize-none border-b-1 border-gray-200 bg-gray-50 px-4 py-4 outline-0 placeholder:font-medium"
            rows={3}
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={saving}
          />
          <button
            className="mx-2 my-2 h-10 cursor-pointer rounded-3xl bg-gray-500 px-4 text-sm font-bold text-white hover:bg-cyan-500"
            onClick={handleAdd}
            disabled={saving}
          >
            {saving ? "Posting…" : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
