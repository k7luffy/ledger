import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { addTransaction } from "../store/transactionsSlice";
import { StackActions } from "@react-navigation/native";

const TYPES = ["expense", "income"];

// 图标+颜色按截图风格（可继续补充/改名）
const CATEGORY_SECTIONS = [
  {
    title: "最近使用",
    key: "recent",
    items: [
      { label: "早午晚餐", icon: "silverware-fork-knife", tint: "#FFE8E8" },
    ],
  },
  {
    title: "食品酒水",
    key: "food",
    items: [
      { label: "早午晚餐", icon: "silverware-fork-knife", tint: "#FFE8E8" },
      { label: "烟酒茶", icon: "glass-cocktail", tint: "#FFF3D7" },
      { label: "水果零食", icon: "ice-cream", tint: "#E7F6FF" },
    ],
  },
  {
    title: "行车交通",
    key: "transport",
    items: [
      { label: "公共交通", icon: "bus", tint: "#E9F4FF" },
      { label: "打车租车", icon: "car", tint: "#FFF0E1" },
      { label: "私家车费用", icon: "car-cog", tint: "#EEE9FF" },
    ],
  },
  {
    title: "居家物业",
    key: "home",
    items: [
      { label: "水电煤气", icon: "water", tint: "#EAFBF2" },
      { label: "房租物业", icon: "home-city-outline", tint: "#FFF1F1" },
      { label: "维修清洁", icon: "toolbox-outline", tint: "#F3F6FF" },
    ],
  },
];

export default function AddScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("0");

  const [category, setCategory] = useState({
    parent: "食品酒水",
    child: "早午晚餐",
  });
  const [account, setAccount] = useState("现金 (CNY)");
  const [dateLabel, setDateLabel] = useState(getTodayLabel());
  const [note, setNote] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [recentItems, setRecentItems] = useState(["早午晚餐"]); // 最近使用展示用

  const dispatch = useDispatch();

  const signColor = useMemo(
    () => (type === "income" ? "#FF6B6B" : "#34C759"),
    [type]
  );

  const onKey = (k) => {
    setAmount((prev) => inputLogic(prev, k));
  };

  const onConfirm = () => {
    // 在这里提交
    // 你可以把 amount 转成 number，并带上 type/category/account/date/note
    navigation.goBack();
  };

  const onConfirmAdd = () => {
    const payload = {
      type,
      amount: Number(parseFloat(String(amount)).toFixed(2)),
      categoryParent: category.parent,
      categoryChild: category.child,
      account,
      note,
      dateISO: new Date().toISOString(),
    };
    dispatch(addTransaction(payload));
    // navigation.navigate("Transactions");
    navigation.dispatch(StackActions.replace("Transactions"));
  };

  const barHeight = 76 + insets.bottom;
  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="chevron-left" size={26} />
        </Pressable>
        <Text style={styles.topTitle}>Home</Text>
        <Pressable onPress={onConfirm} style={[styles.saveBtn]}>
          <Text style={styles.saveText}>✓</Text>
        </Pressable>
      </View>

      {/* 类型切换 */}
      <View style={styles.segment}>
        {TYPES.map((t) => {
          const active = t === type;
          return (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.segItem, active && styles.segItemActive]}
            >
              <Text style={[styles.segText, active && styles.segTextActive]}>
                {t === "expense" ? "支出" : t === "income" ? "收入" : "转账"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 可滚动内容（为底部键盘预留空间） */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: barHeight + 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.amountCard}>
            <Text style={[styles.amountText, { color: signColor }]}>
              {amount}
            </Text>
            <View style={styles.divider} />
          </View>

          {/* 字段列表 */}
          <FieldRow
            icon="view-grid-outline"
            label="分类"
            value={`${category.parent}  >  ${category.child}`}
            onPress={() => setCategoryModalVisible(true)}
          />
          <FieldRow
            icon="wallet-outline"
            label="账户"
            value={account}
            onPress={() => {}}
          />
          <FieldRow
            icon="clock-outline"
            label="时间"
            value={dateLabel}
            onPress={() => {}}
          />
          <FieldRow
            icon="bookmark-outline"
            label="备注"
            value={note || "…"}
            onPress={() => {}}
          />
          <View style={styles.tagsRow}>
            {["早餐", "商家", "项目"].map((t) => (
              <Pressable key={t} style={styles.chip}>
                <Text style={styles.chipText}>{t}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* 底部数字键盘 */}
        <View style={[styles.padWrap, { paddingBottom: insets.bottom }]}>
          <View style={styles.padLeft}>
            <PadRow onKey={onKey} a="7" b="8" c="9" />
            <PadRow onKey={onKey} a="4" b="5" c="6" />
            <PadRow onKey={onKey} a="1" b="2" c="3" />
            <PadRow onKey={onKey} a="." b="0" c="back" />
          </View>

          <View style={styles.padRight}>
            <PadKey label="-" onPress={() => onKey("-")} />
            <PadKey label="+" onPress={() => onKey("+")} />
            <Pressable style={[styles.confirmBtn]} onPress={onConfirmAdd}>
              <Text style={styles.confirmText}>确定</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCategoryModalVisible(false)}
        >
          {/* 阻止点击内容区域时关闭 */}
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {/* 顶部栏 */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>选择分类</Text>
              <Pressable onPress={() => setCategoryModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color="#333" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              {CATEGORY_SECTIONS.map((sec) => {
                const items =
                  sec.key === "recent"
                    ? sec.items.filter((it) => recentItems.includes(it.label))
                    : sec.items;

                if (!items.length) return null;

                return (
                  <View key={sec.key} style={styles.section}>
                    <Text style={styles.sectionTitle}>{sec.title}</Text>
                    <View style={styles.grid}>
                      {items.map((it) => (
                        <Pressable
                          key={it.label}
                          style={styles.gridItem}
                          onPress={() => {
                            let parent = "食品酒水";
                            if (
                              ["公共交通", "打车租车", "私家车费用"].includes(
                                it.label
                              )
                            )
                              parent = "行车交通";
                            if (
                              ["水电煤气", "房租物业", "维修清洁"].includes(
                                it.label
                              )
                            )
                              parent = "居家物业";

                            setCategory({ parent, child: it.label });
                            setRecentItems((prev) => {
                              const next = [
                                it.label,
                                ...prev.filter((x) => x !== it.label),
                              ];
                              return next.slice(0, 8);
                            });
                            setCategoryModalVisible(false);
                          }}
                        >
                          <View
                            style={[
                              styles.iconWrap,
                              { backgroundColor: it.tint },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={it.icon}
                              size={22}
                              color="#111"
                            />
                          </View>
                          <Text style={styles.gridText} numberOfLines={1}>
                            {it.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function PadRow({ onKey, a, b, c }) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <PadKey label={a} onPress={() => onKey(a)} />
      <PadKey label={b} onPress={() => onKey(b)} />
      <PadKey label={c} onPress={() => onKey(c)} />
    </View>
  );
}

function PadKey({ label, onPress }) {
  const isBack = label === "back";
  return (
    <Pressable style={styles.key} onPress={onPress}>
      {isBack ? (
        <MaterialCommunityIcons
          name="backspace-outline"
          size={22}
          color="#111"
        />
      ) : (
        <Text style={styles.keyText}>{label}</Text>
      )}
    </Pressable>
  );
}

function FieldRow({ icon, label, value, onPress }) {
  return (
    <Pressable style={styles.fieldRow} onPress={onPress}>
      <View style={styles.fieldLeft}>
        <MaterialCommunityIcons name={icon} size={18} color="#6B7280" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <Text style={styles.fieldValue} numberOfLines={1}>
        {value}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#C7CBD1" />
    </Pressable>
  );
}

function getTodayLabel() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `今天 ${m.toString().padStart(2, "0")}月${day
    .toString()
    .padStart(2, "0")}日`;
}

function inputLogic(prev, k) {
  // 清理空开头
  if (prev === "0") prev = "0";

  if (/^\d$/.test(k)) {
    // 数字
    if (prev === "0") return k; // 0 -> 5
    return prev + k;
  }
  if (k === ".") {
    if (prev.includes(".")) return prev;
    return prev + ".";
  }
  if (k === "back") {
    const next = prev.slice(0, -1);
    return next.length ? next : "0";
  }
  if (k === "-" || k === "+") {
    // 切换收支符号：仅改变首位是否带负号
    if (k === "-") {
      return prev.startsWith("-")
        ? prev
        : prev === "0"
        ? "-0"
        : "-" + prev.replace(/^-/, "");
    } else {
      return prev.replace(/^-/, "") || "0";
    }
  }
  return prev;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },

  topBar: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  iconBtn: { padding: 6, borderRadius: 10 },
  topTitle: { flex: 1, textAlign: "left", fontSize: 17, fontWeight: "600" },
  saveBtn: { width: 36, alignItems: "center", justifyContent: "center" },
  saveText: { fontSize: 18, color: "#F59E0B", fontWeight: "700" },

  segment: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  segItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F4F6FA",
  },
  segItemActive: { backgroundColor: "#FFEED8" },
  segText: { fontSize: 14, color: "#6B7280" },
  segTextActive: { color: "#D97706", fontWeight: "700" },

  amountCard: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 },
  amountText: { fontSize: 44, fontWeight: "700" },
  divider: {
    marginTop: 10,
    height: 2,
    backgroundColor: "#D9F0EB",
    borderRadius: 2,
  },

  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
    gap: 10,
  },
  fieldLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  fieldLabel: { fontSize: 14, color: "#6B7280" },
  fieldValue: { flex: 1, textAlign: "right", color: "#111", fontSize: 14 },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F2F4F8",
  },
  chipText: { color: "#4B5563", fontSize: 12 },

  padWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    padding: 12,
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EDEDED",
  },
  padLeft: { flex: 1, gap: 8 },
  padRight: { width: 84, gap: 8, alignItems: "stretch" },

  key: {
    flex: 1,
    backgroundColor: "#F7F8FA",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 56,
  },
  keyText: { fontSize: 20, fontWeight: "600" },

  confirmBtn: {
    flex: 1,
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  sheetTitle: { fontSize: 16, fontWeight: "600" },

  section: { paddingHorizontal: 12, paddingTop: 12 },
  sectionTitle: {
    fontSize: 13,
    color: "#9AA0A6",
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "25%", // 一行四个
    alignItems: "center",
    paddingVertical: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  gridText: { fontSize: 12, color: "#222", maxWidth: 72, textAlign: "center" },
});
