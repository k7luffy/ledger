import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { type ComponentProps, type ComponentType } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AssetsScreen from "./screens/AssetsScreen";
import LedgerScreen from "./screens/LedgerScreen";
import SavingsScreen from "./screens/SavingsScreen";
import StatisticsScreen from "./screens/StatisticsScreen";
import { persistor, store } from "./store";

const Tab = createBottomTabNavigator();

type TabConfig = {
  name: string;
  title: string;
  component: ComponentType;
  activeIcon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  inactiveIcon: ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const tabs: TabConfig[] = [
  {
    name: "Ledger",
    title: "账本",
    component: LedgerScreen,
    activeIcon: "file-document",
    inactiveIcon: "file-document-outline",
  },
  {
    name: "Assets",
    title: "资产",
    component: AssetsScreen,
    activeIcon: "wallet",
    inactiveIcon: "wallet-outline",
  },
  {
    name: "Savings",
    title: "存钱",
    component: SavingsScreen,
    activeIcon: "piggy-bank",
    inactiveIcon: "piggy-bank-outline",
  },
  {
    name: "Statistics",
    title: "统计",
    component: StatisticsScreen,
    activeIcon: "chart-box",
    inactiveIcon: "chart-box-outline",
  },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
                tabBarStyle: {
                  backgroundColor: "#F2F2F2",
                  borderTopWidth: 0, // hide top hairline
                },
              }}
            >
              {tabs.map((tab) => (
                <Tab.Screen
                  key={tab.name}
                  name={tab.name}
                  component={tab.component}
                  options={{
                    title: tab.title,
                    tabBarIcon: ({ color, size, focused }) => (
                      <MaterialCommunityIcons
                        name={focused ? tab.activeIcon : tab.inactiveIcon}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                />
              ))}
            </Tab.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
