import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      searchHistory: user.searchHistory || [],
    });
  } catch (error) {
    console.error("Get search history error:", error);
    return NextResponse.json(
      { error: "Failed to get search history" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 }
      );
    }

    const { query, type } = await request.json();

    if (!query || !type) {
      return NextResponse.json(
        { error: "Query and type are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Initialize searchHistory if it doesn't exist
    if (!user.searchHistory) {
      user.searchHistory = [];
    }

    // Remove duplicate if it exists (to move it to the top)
    user.searchHistory = user.searchHistory.filter(
      (item) => item.query !== query
    );

    // Add new search to the beginning
    user.searchHistory.unshift({
      query,
      type, // 'post' or 'user'
      createdAt: new Date(),
    });

    // Keep only last 20 searches
    user.searchHistory = user.searchHistory.slice(0, 20);

    await user.save();

    return NextResponse.json({
      message: "Search history saved",
      searchHistory: user.searchHistory,
    });
  } catch (error) {
    console.error("Save search history error:", error);
    return NextResponse.json(
      { error: "Failed to save search history" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectMongoDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove the search from history
    user.searchHistory = user.searchHistory.filter(
      (item) => item.query !== query
    );

    await user.save();

    return NextResponse.json({
      message: "Search removed from history",
      searchHistory: user.searchHistory,
    });
  } catch (error) {
    console.error("Delete search history error:", error);
    return NextResponse.json(
      { error: "Failed to delete search history" },
      { status: 500 }
    );
  }
}
