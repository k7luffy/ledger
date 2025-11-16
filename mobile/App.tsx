import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PlatformColor, StyleSheet, View } from "react-native";

import TransactionsScreen from "./src/screens/TransactionsScreen";
import AddScreen from "./src/screens/AddScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import LedgerScreen from "./src/screens/LedgerScreen";
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
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: PlatformColor("systemGray1"),
              borderTopWidth: 0, // hide top hairline
            },
          }}
        >
          {/* Home shows the custom bottom bar */}
          <Tab.Screen
            name="Ledger"
            component={LedgerScreen}
            options={{
              headerShown: false,
              title: "账本",
              tabBarIcon: ({ color, size, focused }) => (
                <MaterialCommunityIcons
                  name={focused ? "file-document" : "file-document-outline"}
                  size={size}
                  color={color}
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
                <MaterialCommunityIcons
                  name={focused ? "file-document" : "file-document-outline"}
                  size={size}
                  color={color}
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
                <MaterialCommunityIcons
                  name={focused ? "plus-circle" : "plus-circle-outline"}
                  size={size}
                  color={color}
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
                <MaterialCommunityIcons
                  name={focused ? "account" : "account-outline"}
                  size={size}
                  color={color}
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

const styles = StyleSheet.create({
  tabLabel: { fontSize: 12, color: "#2C2C2C" },
});
