import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

interface SuggestionChipsProps {
  onSelect: (suggestion: string) => void;
}

const suggestions = [
  "What should I do this weekend?",
  "Find outdoor activities nearby",
  "Suggest a romantic date night",
  "Budget-friendly activities for today",
];

export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <View className="mb-6 flex-row flex-wrap justify-center gap-2 px-4">
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={index}
          onPress={() => onSelect(suggestion)}
          className="rounded-full px-4 py-2.5 active:opacity-80"
          style={{
            backgroundColor: themeColors.card,
            borderWidth: 1,
            borderColor: themeColors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDark ? 0.2 : 0.05,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text
            className="text-sm font-medium"
            style={{ color: themeColors.text }}
          >
            {suggestion}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
