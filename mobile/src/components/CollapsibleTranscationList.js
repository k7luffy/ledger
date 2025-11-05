import { useState } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import TransactionItem from "./TransactionItem";
import { useTransactions } from "../hooks/useTransactions";

// 🧩 按日期分组z
function groupByMonth(data) {
  const groups = {};
  data.forEach((t) => {
    const date = new Date(t.dateISO);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 补0
    const key = `${year}-${month}`; // 例如 "2025-11"
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
  });
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a)) // 日期倒序
    .map((key) => ({ title: key, data: groups[key] }));
}

function getStatisticsMonth(groups, getStatistics) {
  const statisticsMonth = {};
  groups.forEach((transactions) => {
    statisticsMonth[transactions.title] = getStatistics(transactions.data);
  });

  return statisticsMonth;
}

export default function CollapsibleTransactionList({ transactions }) {
  const [collapsed, setCollapsed] = useState({}); // 记录哪些日期展开

  const sections = groupByMonth(transactions);

  const { getStatistics } = useTransactions();
  const statisticsMonth = getStatisticsMonth(sections, getStatistics);

  const sectionsToRender = sections.map((s) =>
    collapsed[s.title] ? { ...s, data: [] } : s
  );

  const toggleSection = (title) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderItem = ({ item, section, index }) => {
    if (collapsed[section.title]) return null; // 👈 收起时不渲染

    const prev = section.data[index - 1];
    const showDateHeader = !prev || prev.date !== item.date;

    return (
      <View>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={{ fontWeight: "700", color: "#5d5e5dff" }}>
              {formatDate(item.dateISO)}
            </Text>
          </View>
        )}
        <TransactionItem item={item} />
      </View>
    );
  };

  const renderSectionHeader = ({ section }) => {
    const isOpen = !collapsed[section.title];
    return (
      <TouchableOpacity
        style={styles.header}
        onPress={() => toggleSection(section.title)}
        activeOpacity={1}
      >
        {/* <Text style={styles.headerText}>
          {isOpen ? "▼" : "▶"} {section.title}
        </Text> */}
        {/* <Text style={styles.headerCount}>{section.data.length} 条</Text> */}
        <View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#333" }}>
            {new Date(section.title).getMonth() + 1}月
          </Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#797a79ff" }}>
            2025
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text style={{ color: "#797a79ff" }}>结余</Text>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {" "}
              {statisticsMonth[section.title].balance.toFixed(2)}
            </Text>
          </View>
          <Text>
            收入 {statisticsMonth[section.title].totalIncome.toFixed(2)} | 支出
            {statisticsMonth[section.title].totalExpense.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SectionList
      sections={sectionsToRender}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      ItemSeparatorComponent={() => (
        <View style={{ height: 1, backgroundColor: "#f9f8f8ff" }} />
      )}
    />
  );
}

function formatDate(str) {
  const d = new Date(str);
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
  return `${m}月${day}日（周${weekday}）`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  headerText: { fontSize: 15, fontWeight: "600", color: "#333" },
  headerCount: { fontSize: 13, color: "#888" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  title: { fontSize: 16, color: "#333" },
  amount: { fontSize: 16, fontWeight: "600" },
  dateHeader: {
    paddingVertical: 5,
    paddingTop: 15,
  },
});
