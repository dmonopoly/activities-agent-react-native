import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/services/api';
import type { ChatHistoryListItem } from '@/types';
import { HistoryItem } from '@/components/history/HistoryItem';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { colors } from '@/constants/colors';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      console.error('Failed to load histories:', error);
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
      console.error('Failed to delete history:', error);
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
      console.error('Failed to clear all histories:', error);
    } finally {
      setShowClearAllConfirm(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Actions */}
      {histories.length > 0 && (
        <View className="bg-white border-b border-gray-200 px-4 py-3">
          <Pressable
            onPress={() => setShowClearAllConfirm(true)}
            className="flex-row items-center justify-center py-2 active:opacity-70"
          >
            <Ionicons name="trash-outline" size={16} color={colors.red500} />
            <Text className="text-red-500 text-sm font-medium ml-1">
              Clear All History
            </Text>
          </Pressable>
        </View>
      )}

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
            <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
              <Ionicons name="chatbubbles" size={40} color={colors.gray400} />
            </View>
            <Text className="text-lg font-medium text-gray-900 mb-1">
              No conversations yet
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Start a new chat to see your history here
            </Text>
            <Pressable
              onPress={() => router.push('/')}
              className="bg-rose-500 rounded-full px-6 py-3 active:bg-rose-600"
            >
              <Text className="text-white font-medium">Start New Chat</Text>
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

