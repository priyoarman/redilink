import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";
import User from "@/models/user";
import PostCard from "./PostCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function PostsList() {
  await connectMongoDB();
  const session = await getServerSession(authOptions);
  const rawPosts = await Post.find()
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });

  // Fetch profile images for authors to show avatars
  const authorIds = Array.from(new Set(rawPosts.map((p) => p.authorId))).filter(Boolean);
  const users = authorIds.length
    ? await User.find({ _id: { $in: authorIds } }).lean()
    : [];
  const userById = {};
  users.forEach((u) => {
    userById[u._id.toString()] = u;
  });

  const posts = rawPosts.map((doc) => {
    const likesArray = Array.isArray(doc.likes) ? doc.likes : [];
    const author = userById[doc.authorId];

    return {
      _id: doc._id.toString(),
      body: doc.body,
      images: doc.images || [],
      authorId: doc.authorId,
      authorName: doc.authorName,
      authorUsername: doc.authorUsername,
      authorImage: author?.profileImage || null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
      likesCount: doc.likesCount ?? likesArray.length,
      likedByMe: session
        ? likesArray.map(String).includes(session.user.id)
        : false,
      commentsCount: doc.commentsCount ?? doc.comments?.length ?? 0,
    };
  });

  return (
    <div className="z-20 bg-gray-50 py-2">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
