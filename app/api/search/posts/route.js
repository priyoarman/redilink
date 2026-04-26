import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Create regex patterns for search
    const searchRegex = new RegExp(query.trim(), "i");
    const hashtagRegex = new RegExp(`#${query.trim()}`, "i");

    // Search in post body and hashtags
    const posts = await Post.find({
      $or: [
        { body: searchRegex },
        { body: hashtagRegex },
      ],
    })
      .populate("authorId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Post.countDocuments({
      $or: [
        { body: searchRegex },
        { body: hashtagRegex },
      ],
    });

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search posts error:", error);
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}
