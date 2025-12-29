import { useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import type { ChatMessage } from '@/types';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { SuggestionChips } from '@/components/chat/SuggestionChips';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const { userId } = useUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const saveHistory = useCallback(
    async (newMessages: ChatMessage[]) => {
      try {
        const result = await api.saveChatHistory(historyId, newMessages);
        if (!historyId) {
          setHistoryId(result.id);
          // Navigate to the specific chat URL
          router.replace(`/chat/${result.id}`);
        }
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    },
    [historyId, router]
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || !userId) return;

      Keyboard.dismiss();

      const userMessage: ChatMessage = { role: 'user', content: text };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      scrollToBottom();

      try {
        const response = await api.sendMessage(text, userId);
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response,
        };
        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages(finalMessages);
        await saveHistory(finalMessages);
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        };
        setMessages([...updatedMessages, errorMessage]);
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    },
    [messages, isLoading, userId, saveHistory, scrollToBottom]
  );

  const handleChipSelect = useCallback(
    (suggestion: string) => {
      handleSend(suggestion);
    },
    [handleSend]
  );

  const hasMessages = messages.length > 0;

  return (
    <View className="flex-1 bg-white">
      {!hasMessages ? (
        // Empty state - centered content
        <View className="flex-1 justify-center px-4">
          <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
            What can I help with?
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Ask me about activities, events, and things to do
          </Text>
          <SuggestionChips onSelect={handleChipSelect} />
          <View className="mt-4">
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </View>
        </View>
      ) : (
        // Conversation view
        <>
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
          />
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </>
      )}
    </View>
  );
}

