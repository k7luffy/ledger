import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";

function HomeTopBar() {
  return (
    <View style={styles.topSection}>
      <Pressable style={styles.topButton}>
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

export default HomeTopBar;
