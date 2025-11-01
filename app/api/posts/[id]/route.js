import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectMongoDB();
  const { id } = await params;
  const post = await Post.findById(id).lean();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  // return as { post }
  return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(request, { params }) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { newBody } = await request.json();
  const { id } = await params;
  const post = await Post.findById(id);

  if (!post) 
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (post.authorId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  post.body = newBody;
  await post.save();
  return NextResponse.json({ message: "Post Updated" }, { status: 200 });
}

export async function DELETE(request, { params }) {
  await connectMongoDB();
  const { id } = await params;
  await Post.findByIdAndDelete(id);
  return NextResponse.json({ message: "Post Deleted" }, { status: 200 });
}