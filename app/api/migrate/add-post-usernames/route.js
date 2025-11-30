import connectMongoDB from "@/lib/mongodb";
import Post from "@/models/posts";
import User from "@/models/user";
import { NextResponse } from "next/server";

/**
 * Migration endpoint to add authorUsername to existing posts.
 * POST /api/migrate/add-post-usernames
 */
export async function POST(request) {
  try {
    await connectMongoDB();

    // Find all posts without authorUsername
    const postsWithoutUsername = await Post.find({
      authorUsername: { $exists: false },
    });

    if (postsWithoutUsername.length === 0) {
      return NextResponse.json({
        message: "No posts need migration",
        migratedCount: 0,
      });
    }

    let migratedCount = 0;
    const errors = [];

    // Fetch usernames for all unique authorIds
    const authorIds = Array.from(
      new Set(postsWithoutUsername.map((p) => p.authorId))
    );
    const users = await User.find({ _id: { $in: authorIds } }).lean();
    const userById = {};
    users.forEach((u) => {
      userById[u._id.toString()] = u;
    });

    // Update each post with authorUsername
    for (const post of postsWithoutUsername) {
      try {
        const user = userById[post.authorId];
        if (user && user.username) {
          post.authorUsername = user.username;
          await post.save();
          migratedCount++;
        } else {
          errors.push({
            postId: post._id,
            authorId: post.authorId,
            error: "User or username not found",
          });
        }
      } catch (err) {
        errors.push({
          postId: post._id,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      message: `Migration completed. ${migratedCount} posts updated.`,
      migratedCount,
      errors,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    );
  }
}
