import { View, StyleSheet, Pressable, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { resetTransactions } from "../store/transactionsSlice";
import { resetCategories } from "../store/categoriesSlice";

export default function SettingsScreen() {
  const dispatch = useDispatch();

  const handleClearTransactions = () => {
    dispatch(resetTransactions());
  };

  const handleClearCategories = () => {
    dispatch(resetCategories());
  };

  return (
    <View style={[styles.page, { backgroundColor: COLORS.cream }]}>
      <Text style={styles.title}>Settings</Text>
      <Button
        title="清空transactions"
        onPress={handleClearTransactions}
      ></Button>
      <Button title="清空categories" onPress={handleClearCategories}></Button>
    </View>
  );
}

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
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#666" },
});
