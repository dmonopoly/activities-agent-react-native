import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '@/services/api';
import { storage } from '@/services/storage';
import type { ChatMessage } from '@/types';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [userId, setUserId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    storage.getOrCreateUserId().then(setUserId);
  }, []);

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
      console.error('Failed to load chat history:', error);
      // Navigate back to home if history not found
      router.replace('/');
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
        console.error('Failed to save chat history:', error);
      }
    },
    [id]
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

  if (isLoadingHistory) {
    return <LoadingSpinner />;
  }

  return (
    <View className="flex-1 bg-white">
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
            <Text className="text-gray-400">No messages yet</Text>
          </View>
        }
      />
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </View>
  );
}

