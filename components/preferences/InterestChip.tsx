import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

interface InterestChipProps {
  interest: string;
  onRemove: () => void;
}

export function InterestChip({ interest, onRemove }: InterestChipProps) {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <View
      className="mb-2 mr-2 flex-row items-center rounded-full px-3 py-1.5"
      style={{
        backgroundColor: themeColors.primaryLight,
        borderWidth: 1,
        borderColor: themeColors.primaryBorder,
      }}
    >
      <Text
        className="mr-1 text-sm font-medium"
        style={{ color: isDark ? colors.rose300 : colors.rose600 }}
      >
        {interest}
      </Text>
      <Pressable
        onPress={onRemove}
        className="ml-1 active:opacity-60"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close-circle" size={16} color={colors.rose500} />
      </Pressable>
    </View>
  );
}
