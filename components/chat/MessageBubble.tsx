import { View, Text, useWindowDimensions } from 'react-native';
import Markdown from 'react-native-markdown-display';
import type { ChatMessage } from '@/types';
import { colors } from '@/constants/colors';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { width } = useWindowDimensions();
  const isUser = message.role === 'user';
  const maxWidth = width * 0.8;

  const markdownStyles = {
    body: {
      color: colors.gray900,
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      fontSize: 18,
      fontWeight: '700' as const,
      marginBottom: 8,
      color: colors.gray900,
    },
    heading2: {
      fontSize: 16,
      fontWeight: '600' as const,
      marginBottom: 6,
      color: colors.gray900,
    },
    heading3: {
      fontSize: 15,
      fontWeight: '600' as const,
      marginBottom: 4,
      color: colors.gray700,
    },
    strong: {
      fontWeight: '600' as const,
      color: colors.rose600,
    },
    em: {
      fontStyle: 'italic' as const,
      color: colors.gray600,
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
      textDecorationLine: 'underline' as const,
    },
    code_inline: {
      backgroundColor: colors.gray200,
      color: colors.gray900,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.gray300,
      paddingLeft: 12,
      marginVertical: 8,
    },
  };

  if (isUser) {
    return (
      <View className="flex-row justify-end mb-3">
        <View
          style={{ maxWidth }}
          className="bg-rose-500 rounded-2xl px-4 py-3"
        >
          <Text className="text-white text-base leading-relaxed">
            {message.content}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row justify-start mb-3">
      <View style={{ maxWidth }} className="bg-gray-100 rounded-2xl px-4 py-3">
        <Markdown style={markdownStyles}>{message.content}</Markdown>
      </View>
    </View>
  );
}

