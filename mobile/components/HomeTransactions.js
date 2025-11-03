import { StyleSheet, Text, View } from "react-native";
import TransactionItem from "./TransactionItem";
import { FlatList } from "react-native-gesture-handler";
import HomeCurTran from "./HomeCurTran";

const transactions = [
  { id: "1", title: "Coffee", amount: -4.5, date: "2025-11-02" },
  { id: "2", title: "Salary", amount: 1500, date: "2025-11-01" },
  { id: "3", title: "Groceries", amount: -45.2, date: "2025-11-01" },
];

function HomeTransactions() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <HomeCurTran type="today" />
        <HomeCurTran type="week" />
        <HomeCurTran type="month" />
        <HomeCurTran type="year" />
      </View>
    </View>
  );
}

export default HomeTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    paddingBottom: 130,
  },
  card: {
    flex: 1,
    backgroundColor: "#EAF2FF",
    borderRadius: 16,
    overflow: "hidden",
  },
  separator: { height: 12 },
});
