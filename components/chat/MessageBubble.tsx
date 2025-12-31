import { Text, useWindowDimensions, View } from "react-native";
import Markdown from "react-native-markdown-display";

import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { width } = useWindowDimensions();
  const { colors: themeColors, isDark } = useTheme();
  const isUser = message.role === "user";
  const maxWidth = width * 0.8;

  const markdownStyles = {
    body: {
      color: themeColors.assistantBubbleText,
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      fontSize: 18,
      fontWeight: "700" as const,
      marginBottom: 8,
      color: themeColors.assistantBubbleText,
    },
    heading2: {
      fontSize: 16,
      fontWeight: "600" as const,
      marginBottom: 6,
      color: themeColors.assistantBubbleText,
    },
    heading3: {
      fontSize: 15,
      fontWeight: "600" as const,
      marginBottom: 4,
      color: themeColors.textSecondary,
    },
    strong: {
      fontWeight: "600" as const,
      color: colors.rose600,
    },
    em: {
      fontStyle: "italic" as const,
      color: themeColors.textSecondary,
    },
    bullet_list: {
      marginVertical: 4,
    },
    ordered_list: {
      marginVertical: 4,
    },
    list_item: {
      marginVertical: 2,
    },
    paragraph: {
      marginVertical: 4,
    },
    link: {
      color: colors.rose500,
      textDecorationLine: "underline" as const,
    },
    code_inline: {
      backgroundColor: isDark ? colors.gray700 : colors.gray200,
      color: themeColors.assistantBubbleText,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: "monospace",
      fontSize: 13,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: themeColors.border,
      paddingLeft: 12,
      marginVertical: 8,
    },
  };

  if (isUser) {
    return (
      <View className="mb-3 flex-row justify-end">
        <View
          style={{ maxWidth, backgroundColor: themeColors.userBubble }}
          className="rounded-2xl px-4 py-3"
        >
          <Text
            style={{ color: themeColors.userBubbleText }}
            className="text-base leading-relaxed"
          >
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-3 flex-row justify-start">
      <View
        style={{ maxWidth, backgroundColor: themeColors.assistantBubble }}
        className="rounded-2xl px-4 py-3"
      >
        <Markdown style={markdownStyles}>{message.content}</Markdown>
      </View>
    </View>
  );
}
