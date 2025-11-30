import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    file.arrayBuffer().then((buffer) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "redilink_posts",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        }
      );
      stream.end(Buffer.from(buffer))
    })
  })
}

export async function POST(request) {
  await connectMongoDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to create a post." },
      { status: 401 }
    );
  }

  const data = await request.formData();
  const body = data.get("body");
  const file = data.get("image");

  if (!body && !file) {
    return NextResponse.json(
      { error: "Post cannot be empty" },
      { status: 400 }
    );
  }

  let imageUrls = [];

  // 3. Upload image if it exists
  if (file) {
    try {
      const uploadResult = await uploadToCloudinary(file);
      imageUrls.push(uploadResult.secure_url); // Get the secure URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image." },
        { status: 500 }
      );
    }
  }

  const post = await Post.create({
    body,
    images: imageUrls,
    authorId: session.user.id,
    authorName: session.user.name,
    authorUsername: session.user.username,
  });
  return NextResponse.json(post, { status: 201 });
}
