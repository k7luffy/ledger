import { Button, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { clearTransactions } from "../features/transactions/transactionsSlice";
import { resetCategories } from "../features/categories/categoriesSlice";

export default function StatisticsScreen() {
  const dispatch = useDispatch();

  const handleClearTransactions = () => {
    dispatch(clearTransactions());
  };

  const handleClearCategories = () => {
    dispatch(resetCategories());
  };

  return (
    <View style={[styles.page]}>
      <Text style={styles.title}>Settings</Text>
      <Button
        title="清空transactions"
        onPress={handleClearTransactions}
      ></Button>
      <Button title="清空categories" onPress={handleClearCategories}></Button>
    </View>
  );
}

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
