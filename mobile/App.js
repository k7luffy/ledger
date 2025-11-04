import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

import TransactionsScreen from "./src/screens/TransactionsScreen";
import AddScreen from "./src/screens/AddScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/store";

const Stack = createNativeStackNavigator();

/* --------------------- Home-only bottom bar --------------------- */

/* --------------------- Home (with bottom bar) --------------------- */

/* --------------------- Root Navigator --------------------- */
export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerTitleAlign: "center" }}
          >
            {/* Home shows the custom bottom bar */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              // options={{ headerShown: false }}
            />

            {/* Child pages have default back button, no bottom bar */}
            <Stack.Screen
              name="Transactions"
              component={TransactionsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

/* --------------------- Styles --------------------- */
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
