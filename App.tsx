import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AssetsScreen from "./AssetsScreen";
import LedgerScreen from "./LedgerScreen";
import SavingsScreen from "./SavingsScreen";
import StatisticsScreen from "./StatisticsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
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
        <Tab.Screen
          name="Ledger"
          component={LedgerScreen}
          options={{
            headerShown: false,
            title: "Ledger",
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
          name="Assets"
          component={AssetsScreen}
          options={{
            headerShown: false,
            title: "Assets",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "wallet" : "wallet-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Savings"
          component={SavingsScreen}
          options={{
            headerShown: false,
            title: "Savings",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "piggy-bank" : "piggy-bank-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{
            headerShown: false,
            title: "Statistics",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "chart-box" : "chart-box-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
