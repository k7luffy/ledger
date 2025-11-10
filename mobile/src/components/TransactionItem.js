import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { selectCategoryById } from "../store/categoriesSlice";
import { useNavigation } from "@react-navigation/native";

function TransactionItem({ item }) {
  const navigation = useNavigation();

  const childCategory = useSelector((state) =>
    selectCategoryById(state, item.categoryChildId)
  );
  return (
    <Pressable
      style={styles.item}
      onPress={() =>
        navigation.navigate("Add", { screenType: "edit", transaction: item })
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* <MaterialCommunityIcons
          name={childCategory.icon}
          size={29}
          color={COLORS.softBrown}
        /> */}
        <View style={[styles.txnIconBox, { backgroundColor: "#FFF7E3" }]}>
          <MaterialCommunityIcons
            name={childCategory.icon}
            size={22}
            color={childCategory.tint}
          />
        </View>
        <View style={{ paddingLeft: 12 }}>
          <Text style={styles.category}>{childCategory.label}</Text>
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
    </Pressable>
  );
}

export default TransactionItem;

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
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#F8F9FB",
    // paddingHorizontal: 7,
    paddingVertical: 15,
    paddingLeft: 5,
    // borderRadius: 12,
  },
  category: { fontSize: 17, fontWeight: "500", color: COLORS.brown },
  amount: { fontSize: 16, fontWeight: "500" },
  txnIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
