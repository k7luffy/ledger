import { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { selectAllAccounts } from "../store/accountsSlice";

const CURRENCY = "¥";

export default function AccountsScreen({ navigation }) {
  const accounts = useSelector(selectAllAccounts);

  const totalAssets = useMemo(() => {
    return accounts.reduce(
      (sum, sec) =>
        sum + sec.items.reduce((t, it) => t + Math.max(it.amount, 0), 0),
      0
    );
  }, []);

  const totalDebts = 0;
  const netWorth = totalAssets - totalDebts;

  const formatCurrency = (n) => `${CURRENCY}${n.toFixed(2)}`;

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Pressable
          onPress={() => navigation?.goBack?.()}
          style={styles.headerBtn}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={26}
            color="#111827"
          />
        </Pressable>
        <Text style={styles.headerTitle}>账户</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="dots-horizontal-circle-outline"
              size={22}
              color="#6B7280"
            />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <MaterialCommunityIcons name="magnify" size={22} color="#6B7280" />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <MaterialCommunityIcons name="plus" size={22} color="#111827" />
          </Pressable>
        </View>
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <Text style={styles.netWorthValue}>{formatCurrency(netWorth)}</Text>
        <Text style={styles.netWorthLabel}>净资产</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            总资产 {formatCurrency(totalAssets)}
          </Text>
          <Text style={styles.summaryText}>
            总负债 {formatCurrency(totalDebts)}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {accounts.map((sec) => {
          const sectionTotal = sec.items.reduce((s, it) => s + it.amount, 0);
          return (
            <View key={sec.id} style={styles.sectionBlock}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{sec.title}</Text>
                <Text style={styles.sectionAsset}>
                  资产 {formatCurrency(sectionTotal)}
                </Text>
              </View>

              <View style={styles.sectionCard}>
                {sec.items.map((it, idx) => (
                  <Pressable
                    key={it.id}
                    style={[
                      styles.itemRow,
                      idx === 0 && styles.itemFirst,
                      idx === sec.items.length - 1 && styles.itemLast,
                    ]}
                    onPress={() =>
                      // navigation?.navigate?.("AccountDetail", {
                      //   accountId: it.id,
                      // })
                      null
                    }
                  >
                    <View style={styles.itemLeft}>
                      <View style={styles.iconBubble}>
                        <MaterialCommunityIcons
                          name={it.icon}
                          size={18}
                          color="#0EA5E9"
                        />
                      </View>
                      <Text style={styles.itemLabel}>{it.label}</Text>
                    </View>

                    <View style={styles.itemRight}>
                      <Text style={styles.itemAmount}>
                        {formatCurrency(it.amount)}
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color="#9CA3AF"
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 6,
  },
  headerBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    textAlign: "left",
    marginLeft: 4,
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIcon: { padding: 6 },

  summaryCard: {
    marginHorizontal: 14,
    marginTop: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
    padding: 16,
  },
  netWorthValue: { fontSize: 34, fontWeight: "700", color: "#111827" },
  netWorthLabel: { marginTop: 2, color: "#6B7280", fontSize: 14 },
  summaryRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryText: { color: "#6B7280", fontSize: 13 },

  scrollBody: { paddingBottom: 24 },
  sectionBlock: { marginTop: 14 },
  sectionHeader: {
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { color: "#6B7280", fontSize: 14 },
  sectionAsset: { color: "#9CA3AF", fontSize: 12 },
  sectionCard: {
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  itemRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  itemFirst: { borderTopWidth: 0 },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: { fontSize: 16, color: "#111827" },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  itemAmount: { fontSize: 16, color: "#111827" },
});
