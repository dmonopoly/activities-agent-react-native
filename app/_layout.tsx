import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";

import { DrawerContent } from "@/components/ui/DrawerContent";
import { colors } from "@/constants/colors";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { UserProvider } from "@/contexts/UserContext";

import "../global.css";

function ThemedDrawer() {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: themeColors.headerBackground,
          },
          headerTintColor: colors.roseMain,
          headerTitleStyle: {
            fontWeight: "600",
            color: colors.roseMain,
          },
          headerShadowVisible: true,
          drawerStyle: {
            width: 280,
            backgroundColor: themeColors.background,
          },
          sceneStyle: {
            backgroundColor: themeColors.background,
          },
          swipeEnabled: true,
        }}
        drawerContent={() => <DrawerContent />}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Activities Agent",
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: "Chat History",
          }}
        />
        <Drawer.Screen
          name="preferences"
          options={{
            title: "Preferences",
          }}
        />
        <Drawer.Screen
          name="chat/[id]"
          options={{
            title: "Chat",
          }}
        />
      </Drawer>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemedDrawer />
        </GestureHandlerRootView>
      </UserProvider>
    </ThemeProvider>
  );
}
