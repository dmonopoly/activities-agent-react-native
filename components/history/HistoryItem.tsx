import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ChatHistoryListItem } from '@/types';
import { colors } from '@/constants/colors';

interface HistoryItemProps {
  item: ChatHistoryListItem;
  onLoad: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

export function HistoryItem({
  item,
  onLoad,
  onDelete,
  isDeleting = false,
}: HistoryItemProps) {
  return (
    <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text
            className="text-base font-medium text-gray-900"
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">
          {formatDate(item.updated_at)}
        </Text>
      </View>

      <View className="flex-row items-center mb-3">
        <Ionicons name="chatbubbles-outline" size={14} color={colors.gray400} />
        <Text className="text-xs text-gray-400 ml-1">
          {item.message_count} messages
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={onLoad}
          className="flex-1 bg-rose-500 rounded-lg py-2.5 items-center active:bg-rose-600"
        >
          <Text className="text-white text-sm font-medium">Load</Text>
        </Pressable>

        <Pressable
          onPress={onDelete}
          disabled={isDeleting}
          className="bg-gray-100 rounded-lg px-4 py-2.5 items-center active:bg-gray-200"
        >
          {isDeleting ? (
            <Text className="text-gray-400 text-sm">...</Text>
          ) : (
            <Ionicons name="trash-outline" size={18} color={colors.gray600} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

