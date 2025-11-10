import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, StyleSheet, View } from "react-native";

import TransactionsScreen from "./src/screens/TransactionsScreen";
import AddScreen from "./src/screens/AddScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/store";
import AccountsScreen from "./src/screens/AccountsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

/* --------------------- Home-only bottom bar --------------------- */

/* --------------------- Home (with bottom bar) --------------------- */

/* --------------------- Root Navigator --------------------- */
export default function App() {
  const Tab = createBottomTabNavigator();

  function Tabs() {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.cream }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              height: 110,
              paddingBottom: 0,
              borderColor: "#F3D9AE",
              backgroundColor: COLORS.tabBg,
              borderRadius: 22,
              borderWidth: 1,
            },
            tabBarItemStyle: { paddingTop: 15 },
            tabBarLabelStyle: {
              marginTop: 15, // label 离底边的距离
              fontWeight: "700",
              fontSize: 11,
              fontWeight: "700",
            },
            tabBarActiveTintColor: "#5B3A29",
            tabBarInactiveTintColor: "#B9A88F",
          }}
        >
          {/* Home shows the custom bottom bar */}
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              title: "首页",
              tabBarIcon: ({ color, size, focused }) => (
                <Image
                  source={require("./src/assets/bottomIcon/home.png")}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              ),
            }}
          />

          {/* Child pages have default back button, no bottom bar */}
          <Tab.Screen
            name="Transactions"
            component={TransactionsScreen}
            options={{
              headerShown: false,
              title: "账单",
              tabBarIcon: ({ color, size, focused }) => (
                <Image
                  source={require("./src/assets/bottomIcon/transactions2.png")}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddScreen}
            options={{
              headerShown: false,
              title: "记一笔",
              tabBarIcon: ({ color, size, focused }) => (
                <Image
                  source={require("./src/assets/bottomIcon/add.png")}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              headerShown: false,
              title: "我的",
              tabBarIcon: ({ color, size, focused }) => (
                <Image
                  source={require("./src/assets/bottomIcon/bear.png")}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Accounts" component={AccountsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

/* --------------------- Styles --------------------- */
const COLORS = {
  bgOrange: "#FF9F45", // 顶部橙
  cream: "#FFF5E6", // 页面奶油底
  card: "#FFE7BD", // 卡片黄
  border: "#F1D9B2",
  brown: "#5B3A29", // 文字棕
  softBrown: "#B38A6A",
  tabBg: "#FFEDC9",
  chip: "#F8D9A6",
};

const styles = StyleSheet.create({
  // Docked bottom bar (full width, stuck to bottom)
  barDocked: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6E6E6",
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tab: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: { fontSize: 12, color: "#2C2C2C" },

  // make Add more prominent visually
  primaryTab: {
    backgroundColor: "#EAF2FF",
    marginHorizontal: 8,
  },
  primaryLabel: { fontWeight: "700", color: "#007AFF" },
});
