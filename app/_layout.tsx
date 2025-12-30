import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/contexts/UserContext';
import { DrawerContent } from '@/components/ui/DrawerContent';
import { colors } from '@/constants/colors';
import '../global.css';

export default function RootLayout() {
  return (
    <UserProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Drawer
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerTintColor: colors.roseMain,
            headerTitleStyle: {
              fontWeight: '600',
              color: colors.roseMain,
            },
            headerShadowVisible: true,
            drawerStyle: {
              width: 280,
            },
            swipeEnabled: true,
          }}
          drawerContent={() => <DrawerContent />}
        >
          <Drawer.Screen
            name="index"
            options={{
              title: 'Activities Agent',
            }}
          />
          <Drawer.Screen
            name="history"
            options={{
              title: 'Chat History',
            }}
          />
          <Drawer.Screen
            name="preferences"
            options={{
              title: 'Preferences',
            }}
          />
          <Drawer.Screen
            name="chat/[id]"
            options={{
              title: 'Chat',
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </UserProvider>
  );
}
