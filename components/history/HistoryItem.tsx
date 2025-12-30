import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import type { ChatHistoryListItem } from "@/types";

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
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

export function HistoryItem({
  item,
  onLoad,
  onDelete,
  isDeleting = false,
}: HistoryItemProps) {
  const { colors: themeColors } = useTheme();

  return (
    <View
      className="mb-3 rounded-xl p-4"
      style={{
        backgroundColor: themeColors.card,
        borderWidth: 1,
        borderColor: themeColors.border,
      }}
    >
      <View className="mb-2 flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text
            className="text-base font-medium"
            style={{ color: themeColors.text }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
        <Text className="text-xs" style={{ color: themeColors.textMuted }}>
          {formatDate(item.updated_at)}
        </Text>
      </View>

      <View className="mb-3 flex-row items-center">
        <Ionicons
          name="chatbubbles-outline"
          size={14}
          color={themeColors.textMuted}
        />
        <Text className="ml-1 text-xs" style={{ color: themeColors.textMuted }}>
          {item.message_count} messages
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={onLoad}
          className="flex-1 items-center rounded-lg bg-rose-500 py-2.5 active:bg-rose-600"
        >
          <Text className="text-sm font-medium text-white">Load</Text>
        </Pressable>

        <Pressable
          onPress={onDelete}
          disabled={isDeleting}
          className="items-center rounded-lg px-4 py-2.5 active:opacity-70"
          style={{ backgroundColor: themeColors.backgroundSecondary }}
        >
          {isDeleting ? (
            <Text className="text-sm" style={{ color: themeColors.textMuted }}>
              ...
            </Text>
          ) : (
            <Ionicons
              name="trash-outline"
              size={18}
              color={themeColors.textSecondary}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}
