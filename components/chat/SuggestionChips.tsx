import { View, Text, Pressable } from 'react-native';
import { colors } from '@/constants/colors';

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  'What should I do this weekend?',
  'Find outdoor activities nearby',
  'Suggest a romantic date night',
  'Budget-friendly activities for today',
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <View className="flex-row flex-wrap justify-center gap-2 px-4 mb-6">
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={index}
          onPress={() => onSelect(suggestion)}
          className="bg-white border border-gray-200 rounded-full px-4 py-2.5 active:bg-rose-50 active:border-rose-300"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text className="text-gray-700 text-sm font-medium">{suggestion}</Text>
        </Pressable>
      ))}
    </View>
  );
}

