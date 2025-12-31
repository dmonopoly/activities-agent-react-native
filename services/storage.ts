import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "userId";

export const storage = {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  async getUserId(): Promise<string | null> {
    return this.get(USER_ID_KEY);
  },

  async setUserId(userId: string): Promise<void> {
    return this.set(USER_ID_KEY, userId);
  },

  async generateAndSetUserId(): Promise<string> {
    const newUserId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    await this.setUserId(newUserId);
    return newUserId;
  },

  async getOrCreateUserId(): Promise<string> {
    const existing = await this.getUserId();
    if (existing) return existing;
    return this.generateAndSetUserId();
  },
};
