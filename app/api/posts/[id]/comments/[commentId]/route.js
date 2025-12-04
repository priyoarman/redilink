import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Post from "@/models/posts";
import connectMongoDB from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectMongoDB();
    const { id, commentId } = await params;

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Find the comment
    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user is the comment owner
    if (post.comments[commentIndex].user.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // Remove the comment
    post.comments.splice(commentIndex, 1);
    await post.save();

    return NextResponse.json({ success: true, commentsCount: post.comments.length });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
