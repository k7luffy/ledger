import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 用于返回箭头图标
import CollapsibleTransactionList from "../components/CollapsibleTranscationList";
import { useTransactions } from "../hooks/useTransactions";
import { useSelector } from "react-redux";
import { selectAllRecords } from "../store/transactionsSlice";

export default function TransactionsScreen({ navigation }) {
  const { getStatistics } = useTransactions();
  const transactions = useSelector(selectAllRecords);
  const { totalIncome, totalExpense, balance } = getStatistics(transactions);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 👇 自定义 Header */}
      <ImageBackground
        style={styles.header}
        source={require("../assets/card.png")}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#333" />
            <Text style={styles.backText}>Home</Text>
          </TouchableOpacity>

          {/* 右侧按钮或图标（可选） */}
          <TouchableOpacity onPress={() => navigation.navigate("Add")}>
            <Ionicons name="add-circle-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: "flex-end" }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "600",
                  lineHeight: 30,
                  color: "#333",
                }}
              >
                {balance}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={{ lineHeight: 26, fontWeight: "700" }}> 结余</Text>
            </View>
          </View>
          <Text
            style={{ marginTop: 10, fontWeight: "700", color: "#3e3d3dff" }}
          >
            收入 {totalIncome} | 支出 {totalExpense}
          </Text>
        </View>
        {/* 左侧返回 */}
      </ImageBackground>

      {/* 👇 页面内容 */}
      <View style={{ flex: 1, backgroundColor: "#F0F8E7" }}>
        <View
          style={{
            flex: 1,
            borderRadius: 30,
            backgroundColor: "#ffffff",
            overflow: "hidden",
            paddingBottom: 50,
          }}
        >
          <CollapsibleTransactionList transactions={transactions} />
          {/* <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionItem item={item} />}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: "#E0E0E0", // 灰色分割线
                  marginVertical: 8, // 上下间距（可选）
                }}
              />
            )}
            contentContainerStyle={{ padding: 16, paddingTop: 40 }}
          /> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 200, // 👈 自定义高度
    paddingTop: 65,
    paddingBottom: 20,
    paddingHorizontal: 16,
    // alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF5EC",
    // position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  backButton: {
    flexDirection: "row",
    // alignItems: "center",
  },
  backText: {
    marginLeft: 4,
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
});
