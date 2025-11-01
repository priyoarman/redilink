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
    .lean();

  const posts = rawPosts.map((doc) => ({
    _id: doc._id.toString(),
    body: doc.body,
    createdAt: doc.createdAt.toISOString(),
  }));

  return <ProfilePage posts={posts} />;
};

export default Profile;
