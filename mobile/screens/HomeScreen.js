import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeBottomBar from "../components/HomeBottomBar";
import HomeTopBar from "../components/HomeTopBar";
import HomeSummary from "../components/HomeSummary";
import HomeTransactions from "../components/HomeTransactions";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const barHeight = 70; // roughly the visual height of the bar
  return (
    <View style={{ flex: 1 }}>
      <HomeTopBar />

      {/* <View style={[styles.page, { paddingBottom: barHeight + insets.bottom }]}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Welcome to your ledger 👋</Text>
      </View> */}
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
});
