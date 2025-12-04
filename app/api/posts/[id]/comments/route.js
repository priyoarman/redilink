import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Post from "@/models/posts";
import User from "@/models/user";
import connectMongoDB from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  await connectMongoDB();
  const post = await Post.findById(params.id)
    .select("comments")
    .lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post.comments || []);
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { comment } = await request.json();
    if (!comment?.trim()) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
    }

    await connectMongoDB();
    const {id} = await params;
    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    post.comments.push({
      user: session.user.id,
      username: session.user.username || session.user.email,
      email: session.user.email,
      body: comment.trim(),
    });
    await post.save();

    const latest = post.comments[post.comments.length - 1].toObject();
    
    // Fetch user to get profile image
    const user = await User.findById(session.user.id).lean();
    
    return NextResponse.json({
      commentsCount: post.comments.length,
      latestComment: {
        _id:       latest._id.toString(),
        user:      latest.user.toString(),
        name:      session.user.name || "Unknown",
        username:  latest.username,
        email:     latest.email,
        profileImage: user?.profileImage || null,
        body:      latest.body,
        createdAt: latest.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Comment POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}