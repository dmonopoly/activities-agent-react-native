import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: "/" | "/history" | "/preferences";
}

const navItems: NavItem[] = [
  { label: "New Chat", icon: "chatbubble-outline", route: "/" },
  { label: "Chat History", icon: "time-outline", route: "/history" },
  { label: "Preferences", icon: "settings-outline", route: "/preferences" },
];

function ThemeToggle() {
  const { preference, toggleTheme, colors: themeColors } = useTheme();

  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (preference) {
      case "light":
        return "sunny-outline";
      case "dark":
        return "moon-outline";
      case "system":
        return "desktop-outline";
    }
  };

  const getLabel = () => {
    switch (preference) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  };

  return (
    <Pressable
      onPress={toggleTheme}
      className="flex-row items-center rounded-xl px-4 py-3 active:opacity-70"
      style={{ backgroundColor: themeColors.backgroundSecondary }}
    >
      <Ionicons name={getIcon()} size={22} color={themeColors.textSecondary} />
      <Text
        className="ml-3 text-base font-medium"
        style={{ color: themeColors.textSecondary }}
      >
        Theme: {getLabel()}
      </Text>
    </Pressable>
  );
}

export function DrawerContent() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { userId } = useUser();
  const { colors: themeColors, isDark } = useTheme();

  const isActive = (route: string) => {
    if (route === "/") return pathname === "/" || pathname.startsWith("/chat");
    return pathname === route;
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: themeColors.background }}
    >
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, flexGrow: 1 }}
      >
        {/* Header */}
        <View
          className="px-6 pb-6"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
          }}
        >
          <Pressable onPress={() => router.push("/")}>
            <Text
              className="text-2xl font-bold"
              style={{ color: colors.roseMain }}
            >
              Activities Agent
            </Text>
          </Pressable>
        </View>

        {/* Navigation Items */}
        <View className="px-4 py-4">
          {navItems.map((item) => {
            const active = isActive(item.route);
            return (
              <Pressable
                key={item.route}
                onPress={() => router.push(item.route)}
                className="mb-1 flex-row items-center rounded-xl px-4 py-3"
                style={{
                  backgroundColor: active
                    ? themeColors.primaryLight
                    : "transparent",
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? colors.rose500 : themeColors.textSecondary}
                />
                <Text
                  className="ml-3 text-base font-medium"
                  style={{ color: active ? colors.rose500 : themeColors.text }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}

          {/* Theme Toggle */}
          <View
            className="mt-2 pt-2"
            style={{ borderTopWidth: 1, borderTopColor: themeColors.border }}
          >
            <ThemeToggle />
          </View>
        </View>
      </ScrollView>

      {/* User Badge */}
      {userId && (
        <Pressable
          onPress={() => router.push("/preferences")}
          className="px-6 py-4 active:opacity-70"
          style={{
            paddingBottom: insets.bottom + 16,
            borderTopWidth: 1,
            borderTopColor: themeColors.border,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: isDark
                  ? "rgba(244, 63, 94, 0.3)"
                  : colors.rose100,
              }}
            >
              <Ionicons name="person" size={20} color={colors.rose500} />
            </View>
            <View className="ml-3 flex-1">
              <Text
                className="text-xs"
                style={{ color: themeColors.textMuted }}
              >
                Current User
              </Text>
              <Text
                className="text-sm font-medium"
                style={{ color: themeColors.text }}
                numberOfLines={1}
              >
                {userId}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
