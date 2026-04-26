import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
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
    const searchRegex = new RegExp(query.trim(), "i");

    // Search in username, name, and bio
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { name: searchRegex },
        { bio: searchRegex },
      ],
    })
      .select("username name bio profileImage followers")
      .sort({ followers: -1 }) // Sort by most followers
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments({
      $or: [
        { username: searchRegex },
        { name: searchRegex },
        { bio: searchRegex },
      ],
    });

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
