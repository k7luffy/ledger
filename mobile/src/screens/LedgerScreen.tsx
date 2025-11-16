import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PlatformColor, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeSummary from "../components/HomeSummary";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View style={{ flex: 1, paddingTop: 15 }}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View>
              <Text style={styles.bookTitle}>默认账本</Text>
            </View>
            <Pressable>
              <View style={{ marginLeft: 5 }}>
                <MaterialCommunityIcons
                  name="swap-horizontal-circle-outline"
                  size={30}
                  color={PlatformColor("systemBlue")}
                />
              </View>
            </Pressable>
          </View>

          <View style={styles.monthArrowRow}>
            <Text style={styles.monthText}>2025年11月</Text>
            <Pressable style={styles.calendarBtn}>
              <Text style={styles.calendarBtnText}>收支日历</Text>
            </Pressable>
          </View>
        </View>
        {/* Month summary card */}
        <View style={styles.monthRow}>
          <Pressable style={styles.monthArrowBtn}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={22}
              color="#111827"
            />
          </Pressable>
          <View style={styles.summaryCard}>
            <HomeSummary />
          </View>
          <Pressable style={styles.monthArrowBtn}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="#111827"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerBackIcon: {
    color: "#111827",
  },
  bookTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 150,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  monthArrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  monthArrowBtn: {
    flex: 1,
    height: "25%",
    backgroundColor: "#E5E7EB",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarBtn: {
    alignSelf: "flex-end",
    marginLeft: "auto",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: PlatformColor("systemGray5"),
  },
  calendarBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  summaryCard: {
    height: "100%",
    marginHorizontal: 5,
    flex: 8,
  },
  summaryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  summaryTagText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#92400E",
    fontWeight: "600",
  },
  summaryAmount: {
    fontSize: 40,
    fontWeight: "800",
    color: "#111827",
  },
  summaryFooterRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  summaryFooterText: {
    fontSize: 13,
    color: "#6B7280",
    marginRight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  dayHeaderLeft: {
    fontSize: 14,
    color: "#6B7280",
  },
  dayHeaderRight: {
    fontSize: 14,
    color: "#6B7280",
  },
  transactionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  transactionRow: {
    flexDirection: "row",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FB6A4A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  transactionTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  transactionRight: {},
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
