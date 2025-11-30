import connectMongoDB from "@/lib/mongodb";
import User from "@/models/user";
import { generateUniqueUsername } from "@/lib/username";
import { NextResponse } from "next/server";

/**
 * Migration endpoint to add usernames to existing users who don't have one.
 * POST /api/migrate/add-usernames
 */
export async function POST(request) {
  try {
    await connectMongoDB();

    // Find all users without a username
    const usersWithoutUsername = await User.find({ username: { $exists: false } });

    if (usersWithoutUsername.length === 0) {
      return NextResponse.json({
        message: "No users need migration",
        migratedCount: 0,
      });
    }

    let migratedCount = 0;
    const errors = [];

    // Generate and save username for each user
    for (const user of usersWithoutUsername) {
      try {
        const username = await generateUniqueUsername(user.name);
        user.username = username;
        await user.save();
        migratedCount++;
      } catch (err) {
        errors.push({
          userId: user._id,
          name: user.name,
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      message: `Migration completed. ${migratedCount} users updated.`,
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
