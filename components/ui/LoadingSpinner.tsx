import { ActivityIndicator, View } from "react-native";

import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

export function LoadingSpinner({ size = "large", color }: LoadingSpinnerProps) {
  const { colors: themeColors } = useTheme();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: themeColors.background }}
    >
      <ActivityIndicator size={size} color={color || colors.rose500} />
    </View>
  );
}
