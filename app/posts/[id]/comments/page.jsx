import Post from "@/models/posts";
import connectMongoDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentsSection from "@/app/components/CommentsSection";
import PostCard from "@/app/components/PostCard";

export default async function CommentsPage({ params }) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const doc = await Post.findById(id).lean({ virtuals: true }).populate({
    path: "comments.user",
    select: "name",
  });

  if (!doc) {
    return <p className="p-4">Post not found.</p>;
  }

  const likedByMe = session
    ? (doc.likes || []).map(String).includes(session.user.id)
    : false;

  const commentsArray = Array.isArray(doc.comments) ? doc.comments : [];

  const post = {
    _id: doc._id.toString(),
    body: doc.body,
    authorId: doc.authorId,
    authorName: doc.authorName,
    authorEmail: doc.authorEmail,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    likesCount: doc.likesCount,
    likedByMe,
    commentsCount: doc.commentsCount,
    comments: commentsArray.map((c) => ({
      id: c._id.toString(),
      userId: c.user?._id.toString(),
      email: c.email || c.user?.name || "Unknown",
      body: c.body,
      createdAt: c.createdAt.toISOString(),
    })),
  };

  return (
    <div className="sticky z-10 container flex flex-col border-r-1 border-gray-200 py-2 md:w-2/4">
      <p className="flex px-4 py-4 font-bold text-gray-700">Comments</p>
      <PostCard post={post} />
      <CommentsSection postId={post._id} initialComments={post.comments} />
    </div>
  );
}
