import { View, Text, Pressable, ScrollView } from 'react-native';

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="mb-4"
    >
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={index}
          onPress={() => onSelect(suggestion)}
          className="bg-rose-50 border border-rose-200 rounded-full px-4 py-2 active:bg-rose-100"
        >
          <Text className="text-rose-600 text-sm font-medium">{suggestion}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

