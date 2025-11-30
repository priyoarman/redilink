import User from "@/models/user";

/**
 * Generate a unique username based on user's name.
 * Falls back to random suffix if base username is taken.
 */
export async function generateUniqueUsername(fullName) {
  if (!fullName) {
    // fallback to random username if no name provided
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Extract first and last name, create base username
  const nameParts = fullName.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let baseUsername = "";

  if (nameParts.length === 1) {
    baseUsername = nameParts[0];
  } else if (nameParts.length === 2) {
    baseUsername = nameParts[0] + nameParts[1];
  } else {
    // Use first and last name
    baseUsername = nameParts[0] + nameParts[nameParts.length - 1];
  }

  // Remove non-alphanumeric characters
  baseUsername = baseUsername.replace(/[^a-z0-9]/g, "");

  if (!baseUsername) {
    // If no valid characters, use random
    return `user_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if base username is available
  let username = baseUsername;
  let counter = 1;
  let isAvailable = !(await User.findOne({ username }));

  // If taken, append numbers until we find an available one
  while (!isAvailable && counter < 100) {
    username = `${baseUsername}${counter}`;
    isAvailable = !(await User.findOne({ username }));
    counter++;
  }

  // If still not available after 100 tries, use random suffix
  if (!isAvailable) {
    username = `${baseUsername}_${Math.random().toString(36).substr(2, 5)}`;
  }

  return username;
}
