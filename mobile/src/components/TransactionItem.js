import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

function TransactionItem({ item }) {
  return (
    <View style={styles.item}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <MaterialCommunityIcons
          name="food-fork-drink"
          size={29}
          color="#bbc2b3ff"
        />
        <View style={{ paddingLeft: 12 }}>
          <Text style={styles.category}>{item.categoryChild}</Text>
          <Text style={{ fontSize: 11, marginTop: 5, color: "#797a79ff" }}>
            现金 . Fred . 00:47
          </Text>
        </View>
      </View>
      <View style={{ justifyContent: "center" }}>
        <Text
          style={[
            styles.amount,
            { color: item.type === "expense" ? "#34C759" : "#FF3B30" },
          ]}
        >
          {item.amount.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

export default TransactionItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#F8F9FB",
    // paddingHorizontal: 7,
    paddingVertical: 15,
    paddingLeft: 5,
    // borderRadius: 12,
  },
  category: { fontSize: 17, fontWeight: "500", color: "#3d3c3cff" },
  amount: { fontSize: 16, fontWeight: "500" },
});
