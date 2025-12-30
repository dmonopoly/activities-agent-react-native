/**
 * User ID management utilities.
 */

import { api } from "@/services/api";
import { storage } from "@/services/storage";

export interface InitUserResult {
  userId: string;
  allUsers: string[];
}

/**
 * Initialize a valid user ID.
 *
 * @returns Promise with the valid userId and all available users.
 */
export async function initializeValidUserId(): Promise<InitUserResult> {
  const [storedId, users] = await Promise.all([
    storage.getUserId(),
    api.getAllUsers().catch(() => [] as string[]),
  ]);

  let userId = "";

  if (storedId && users.includes(storedId)) {
    // Stored ID is valid
    userId = storedId;
  } else if (users.length > 0) {
    // Fall back to first user from backend
    userId = users[0];
    await storage.setUserId(userId);
  } else if (storedId) {
    // Offline scenario: use stored ID
    userId = storedId;
  } else {
    // Last resort: generate new ID
    userId = await storage.generateAndSetUserId();
  }

  return { userId, allUsers: users };
}
