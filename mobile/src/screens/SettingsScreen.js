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
    <View style={styles.page}>
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
    backgroundColor: "#FFFFFF",
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#666" },
});
