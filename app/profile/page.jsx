import ProfilePage from "../components/ProfilePage";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";

const Profile = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    `redirect("/login")`;
  }

  await connectMongoDB();
  const rawPosts = await Post.find({ authorId: session.user.id })
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });

  const posts = rawPosts.map((doc) => {
    const likesArray = Array.isArray(doc.likes) ? doc.likes : [];
    return {
      _id: doc._id.toString(),
      body: doc.body,
      images: doc.images || [],
      authorId: doc.authorId,
      authorName: doc.authorName,
      authorUsername: doc.authorUsername,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
      likesCount: doc.likesCount ?? likesArray.length,
      likedByMe: session
        ? likesArray.map(String).includes(session.user.id)
        : false,
      commentsCount: doc.commentsCount ?? doc.comments?.length ?? 0,
    };
  });

  return <ProfilePage posts={posts} />;
};

export default Profile;
