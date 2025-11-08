import { Pressable, StyleSheet, Text, View } from "react-native";
import HomeBottomBar from "../components/HomeBottomBar";
import HomeSummary from "../components/HomeSummary";
import HomeTransactions from "../components/HomeTransactions";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <HomeTopBar navigation={navigation} />
      <HomeSummary />
      <HomeTransactions />
      <HomeBottomBar
        onTransactions={() => navigation.navigate("Transactions")}
        onAdd={() => navigation.navigate("Add")}
        onSettings={() => navigation.navigate("Settings")}
      />
    </View>
  );
}

function HomeTopBar({ navigation }) {
  return (
    <View style={styles.topSection}>
      <Pressable
        style={styles.topButton}
        onPress={() => navigation.navigate("Accounts")}
      >
        <MaterialCommunityIcons
          name="wallet-outline"
          size={26}
          color="#007AFF"
        />
        <Text style={styles.topButtonText}>Accounts</Text>
      </Pressable>
      <Pressable style={styles.topButton}>
        <MaterialCommunityIcons
          name="fridge-variant-outline"
          size={26}
          color="#007AFF"
        />
        <Text style={styles.topButtonText}>Budget</Text>
      </Pressable>
      <Pressable style={styles.topButton}>
        <MaterialCommunityIcons name="chart-bar" size={26} color="#007AFF" />
        <Text style={styles.topButtonText}>Charts</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#E8F3F1",
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#666" },
  // Docked bottom bar (full width, stuck to bottom)
  topSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    height: 120,
    alignItems: "center",
  },
  /* 每个按钮 */
  topButton: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    backgroundColor: "#EAF2FF",
    marginHorizontal: 10,
  },
  topButtonText: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
    color: "#333",
  },
});
