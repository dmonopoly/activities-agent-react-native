import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { HistoryItem } from "@/components/history/HistoryItem";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { api } from "@/services/api";
import type { ChatHistoryListItem } from "@/types";

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useTheme();

  const [histories, setHistories] = useState<ChatHistoryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Delete confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [historyToDelete, setHistoryToDelete] = useState<string | null>(null);

  // Clear all confirmation modal
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const loadHistories = useCallback(async () => {
    try {
      const data = await api.getChatHistories();
      setHistories(data);
    } catch (error) {
      console.error("Failed to load histories:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHistories();
  }, [loadHistories]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadHistories();
  }, [loadHistories]);

  const handleLoad = useCallback(
    (id: string) => {
      router.push(`/chat/${id}`);
    },
    [router]
  );

  const handleDeleteRequest = useCallback((id: string) => {
    setHistoryToDelete(id);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!historyToDelete) return;

    try {
      setDeletingId(historyToDelete);
      await api.deleteChatHistory(historyToDelete);
      setHistories((prev) => prev.filter((h) => h.id !== historyToDelete));
    } catch (error) {
      console.error("Failed to delete history:", error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setHistoryToDelete(null);
    }
  }, [historyToDelete]);

  const handleClearAllConfirm = useCallback(async () => {
    try {
      await api.clearAllChatHistory();
      setHistories([]);
    } catch (error) {
      console.error("Failed to clear all histories:", error);
    } finally {
      setShowClearAllConfirm(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: themeColors.backgroundSecondary }}
    >
      <FlatList
        data={histories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onLoad={() => handleLoad(item.id)}
            onDelete={() => handleDeleteRequest(item.id)}
            isDeleting={deletingId === item.id}
          />
        )}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16,
          flexGrow: 1,
        }}
        ListFooterComponent={
          histories.length > 0 ? (
            <View
              className="mt-4 pt-4"
              style={{ borderTopWidth: 1, borderTopColor: themeColors.border }}
            >
              <Pressable
                onPress={() => setShowClearAllConfirm(true)}
                className="flex-row items-center justify-center py-2 active:opacity-70"
              >
                <Ionicons
                  name="trash-outline"
                  size={14}
                  color={themeColors.textMuted}
                />
                <Text
                  className="ml-1 text-xs"
                  style={{ color: themeColors.textMuted }}
                >
                  Clear All History
                </Text>
              </Pressable>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.rose500}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <View
              className="mb-4 h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: themeColors.border }}
            >
              <Ionicons
                name="chatbubbles"
                size={40}
                color={themeColors.textMuted}
              />
            </View>
            <Text
              className="mb-1 text-lg font-medium"
              style={{ color: themeColors.text }}
            >
              No conversations yet
            </Text>
            <Text
              className="mb-6 text-center"
              style={{ color: themeColors.textSecondary }}
            >
              Start a new chat to see your history here
            </Text>
            <Pressable
              onPress={() => router.push("/")}
              className="rounded-full bg-rose-500 px-6 py-3 active:bg-rose-600"
            >
              <Text className="font-medium text-white">Start New Chat</Text>
            </Pressable>
          </View>
        }
      />

      {/* Delete Single Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteConfirm}
        title="Delete Conversation?"
        message="This will permanently delete this conversation. This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setHistoryToDelete(null);
        }}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        visible={showClearAllConfirm}
        title="Clear All History?"
        message="This will permanently delete all your chat history. This action cannot be undone."
        confirmLabel="Clear All"
        isDestructive
        onConfirm={handleClearAllConfirm}
        onCancel={() => setShowClearAllConfirm(false)}
      />
    </View>
  );
}
