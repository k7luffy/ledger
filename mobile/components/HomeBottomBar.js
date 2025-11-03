import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeBottomBar({ onTransactions, onAdd, onSettings }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      edges={["bottom"]}
      style={[styles.barDocked, { paddingBottom: Math.max(insets.bottom, 0) }]}
    >
      <Pressable style={styles.tab} onPress={onTransactions}>
        <MaterialCommunityIcons name="format-list-bulleted" size={22} />
        <Text style={styles.tabLabel}>Transactions</Text>
      </Pressable>

      <Pressable style={[styles.tab, styles.primaryTab]} onPress={onAdd}>
        <MaterialCommunityIcons name="plus-circle" size={26} />
        <Text style={[styles.tabLabel, styles.primaryLabel]}>Add</Text>
      </Pressable>

      <Pressable style={styles.tab} onPress={onSettings}>
        <MaterialCommunityIcons name="cog-outline" size={22} />
        <Text style={styles.tabLabel}>Settings</Text>
      </Pressable>
    </View>
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
    backgroundColor: "#ffffffff",
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
    // backgroundColor: "#def1deff",
    marginHorizontal: 8,
  },
  primaryLabel: { fontWeight: "700", color: "#2C2C2C" },
});
