import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";
import PostCard from "./PostCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function PostsList() {
  await connectMongoDB();
  const session = await getServerSession(authOptions);
  const rawPosts = await Post.find()
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });

  const posts = rawPosts.map((doc) => {
    const likesArray = Array.isArray(doc.likes) ? doc.likes : [];

    return {
      _id: doc._id.toString(),
      body: doc.body,
      authorId: doc.authorId,
      authorName: doc.authorName,
      authorEmail: doc.authorEmail,
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
    <div className="z-20 bg-gray-50 pt-6 pb-12">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
