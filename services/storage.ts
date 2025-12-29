import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'userId';

export const storage = {
  async getUserId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(USER_ID_KEY);
    } catch (error) {
      console.error('Error getting userId:', error);
      return null;
    }
  },

  async setUserId(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    } catch (error) {
      console.error('Error setting userId:', error);
    }
  },

  async generateAndSetUserId(): Promise<string> {
    const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await this.setUserId(newUserId);
    return newUserId;
  },

  async getOrCreateUserId(): Promise<string> {
    const existing = await this.getUserId();
    if (existing) return existing;
    return this.generateAndSetUserId();
  },
};

