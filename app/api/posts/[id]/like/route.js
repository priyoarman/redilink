import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(request, {params}) {
    const session = await getServerSession(authOptions);
    if(!session){
        return NextResponse.json({error: "Not authenticated"}, { status: 401})
    }

    const {id} = await params;
    await connectMongoDB();
    const post = await Post.findById(id)

    if(!post){
        return NextResponse.json({ error: "Post not found" }, { status: 404})
    }
    
    const userId = session.user.id;
    const hasLiked = post.likes.some(uid => uid.toString() === userId);

    if (hasLiked) {
    post.likes.pull(userId)
  } else {
    post.likes.push(userId)
  }

  await post.save();

  return NextResponse.json({
    liked: !hasLiked,
    likesCount: post.likes.length
  })
    
}