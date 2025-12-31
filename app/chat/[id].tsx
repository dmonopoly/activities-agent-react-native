import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { api } from "@/services/api";
import type { ChatMessage } from "@/types";

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const { userId } = useUser();
  const { colors: themeColors } = useTheme();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadHistory();
    }
  }, [id]);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await api.getChatHistory(id!);
      setMessages(history.messages);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      // Navigate back to home if history not found
      router.replace("/");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const saveHistory = useCallback(
    async (newMessages: ChatMessage[]) => {
      try {
        await api.saveChatHistory(id!, newMessages);
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    },
    [id]
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || !userId) return;

      Keyboard.dismiss();

      const userMessage: ChatMessage = { role: "user", content: text };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      scrollToBottom();

      try {
        const response = await api.sendMessage(text, userId);
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.response,
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        await saveHistory(finalMessages);
      } catch (error) {
        console.error("Chat error:", error);
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        setMessages([...updatedMessages, errorMessage]);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    },
    [messages, isLoading, userId, saveHistory, scrollToBottom]
  );

  if (isLoadingHistory) {
    return <LoadingSpinner />;
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: themeColors.background }}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 8,
        }}
        onContentSizeChange={scrollToBottom}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text style={{ color: themeColors.textMuted }}>
              No messages yet
            </Text>
          </View>
        }
      />
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </View>
  );
}
