import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  removeTransaction,
  updateTransaction,
} from "../store/transactionsSlice";
import { StackActions } from "@react-navigation/native";
import {
  resetCategories,
  selectAllCategories,
  selectCategoryById,
} from "../store/categoriesSlice";
import DatePickerModal from "../components/DatePickerModal";
import { TextInput } from "react-native-gesture-handler";

const TYPES = ["expense", "income"];

export default function AddScreen({ navigation, route }) {
  const inputRef = useRef(null);
  const { screenType, transaction } = route.params || {};
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(
    screenType === "edit" ? transaction.type : "expense"
  );
  const [amount, setAmount] = useState(
    screenType === "edit" ? Number(transaction.amount).toFixed(2) : "0.00"
  );
  const amountOrigin = useRef({
    partInt: "",
    decimal: false,
    partDec: "",
  });
  const [showPad, setShowPad] = useState(screenType === "edit" ? false : true);

  const [category, setCategory] = useState(
    screenType === "edit"
      ? {
          parent: transaction.categoryParent,
          childId: transaction.categoryChildId,
        }
      : {
          parent: "食品酒水",
          childId: 1,
        }
  );
  const childCategory = useSelector((state) =>
    selectCategoryById(state, category.childId)
  );
  const [account, setAccount] = useState("现金 (CNY)");
  // const [dateLabel, setDateLabel] = useState(getTodayLabel());
  const [note, setNote] = useState("");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [recentItems, setRecentItems] = useState(["早午晚餐"]); // 最近使用展示用

  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  // dispatch(resetCategories());

  const signColor = useMemo(
    () => (type === "income" ? "#FF6B6B" : "#34C759"),
    [type]
  );

  const onKey = (k) => {
    inputLogic(amountOrigin.current, k);
    setAmount(() => processAmount(amountOrigin.current));
  };

  const onConfirmAdd = () => {
    if (Number(amount) === 0) {
      return;
    }
    const payload = {
      type,
      amount: Number(amount),
      categoryParent: category.parent,
      categoryChildId: category.childId,
      account,
      note,
      dateISO: new Date(date).toISOString(),
    };

    screenType === "edit"
      ? dispatch(updateTransaction({ id: transaction.id, ...payload }))
      : dispatch(addTransaction(payload));
    // navigation.navigate("Transactions");
    // navigation.dispatch(StackActions.replace("Transactions"));
    navigation.goBack();
  };
  // console.log(categories[0].items);

  const barHeight = 76 + insets.bottom;
  const dateLabel = getDateLabel(date);
  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialCommunityIcons name="chevron-left" size={26} />
        </Pressable>
        <Text style={styles.topTitle}>Home</Text>
        <Pressable onPress={onConfirmAdd} style={[styles.saveBtn]}>
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
            <Pressable onPress={() => setShowPad(true)}>
              <Text style={[styles.amountText, { color: signColor }]}>
                {amount}
              </Text>
            </Pressable>

            <View style={styles.divider} />
          </View>

          {/* 字段列表 */}
          <FieldRow
            icon="view-grid-outline"
            label="分类"
            value={`${category.parent}  >  ${childCategory.label}`}
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
            onPress={() => {
              setDatePickerModalVisible(true);
              setShowPad(false);
            }}
          />
          {/* <Pressable onPress={() => inputRef.current?.focus()}>
            <Text>Tap to open</Text>
          </Pressable>
          <TextInput ref={inputRef} /> */}
          <FieldRow
            icon="bookmark-outline"
            label="备注"
            value={note}
            inputRef={inputRef}
            onPress={() => {
              setShowPad(false);
              inputRef.current?.focus();
            }}
            setNote={setNote}
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
        <View style={styles.amountCard}></View>
        {showPad ? (
          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
            {/* 收起/展开按钮 */}
            <Pressable
              onPress={() => setShowPad((v) => !v)}
              style={styles.collapseBtn}
            >
              <MaterialCommunityIcons
                name="chevron-down"
                size={22}
                color="#6B7280"
              />
            </Pressable>
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
                <Pressable
                  style={[styles.confirmBtn]}
                  onPress={() => setShowPad(false)}
                >
                  <Text style={styles.confirmText}>确定</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
      {showPad ? null : (
        <View
          style={[
            styles.padWrap,
            {
              paddingBottom: insets.bottom,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            },
          ]}
        >
          {/* 两个主按钮 */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 15,
              paddingBottom: 30,
              // position: "absolute",
              // left: 0,
              // right: 0,
              // bottom: 0,
            }}
          >
            {screenType === "edit" ? (
              <Pressable
                style={[
                  styles.confirmBtnBottom,
                  { backgroundColor: "#f9d4cfff", flex: 1 },
                ]}
                onPress={() => {
                  //
                  dispatch(removeTransaction(transaction.id));
                  navigation.goBack();
                }}
              >
                <Text style={[styles.confirmText, { color: "#ef481eff" }]}>
                  删除
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={[
                  styles.confirmBtnBottom,
                  { backgroundColor: "#f9e9cfff", flex: 1 },
                ]}
                onPress={() => {
                  // 再记一条：重置金额、备注，保持分类与类型（你可以按需重置）
                  setAmount("0");
                  setNote("");
                  setShowPad(true); // 继续输入
                }}
              >
                <Text style={[styles.confirmText, { color: "#efa21eff" }]}>
                  再记一条
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.confirmBtnBottom, { flex: 1 }]}
              onPress={onConfirmAdd}
            >
              <Text style={styles.confirmText}>完成</Text>
            </Pressable>
          </View>
        </View>
      )}

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
              {categories.map((sec) => {
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

                            setCategory({ parent, childId: it.id });
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

      <DatePickerModal
        visible={datePickerModalVisible}
        value={date}
        onConfirm={(d) => {
          setDate(d);
          setDatePickerModalVisible(false);
        }}
        onCancel={() => setDatePickerModalVisible(false)}
        onBackdropPress={() => setDatePickerModalVisible(false)}
      />
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

function FieldRow({ icon, label, value, onPress, inputRef, setNote }) {
  return (
    <Pressable style={styles.fieldRow} onPress={onPress}>
      <View style={styles.fieldLeft}>
        <MaterialCommunityIcons name={icon} size={18} color="#6B7280" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      {label === "备注" ? (
        <TextInput
          style={styles.fieldValue}
          ref={inputRef}
          value={value}
          placeholder="..."
          placeholderTextColor="#111"
          onChangeText={setNote}
          caretHidden={true}
        />
      ) : (
        <Text style={styles.fieldValue} numberOfLines={1}>
          {value}
        </Text>
      )}

      <MaterialCommunityIcons name="chevron-right" size={20} color="#C7CBD1" />
    </Pressable>
  );
}

function getDateLabel(date) {
  const today = new Date();
  const m = date.getMonth() + 1;
  const day = date.getDate();
  const TodayStr =
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
      ? "今天"
      : "";
  return `${TodayStr} ${m.toString().padStart(2, "0")}月${day
    .toString()
    .padStart(2, "0")}日`;
}

function getTodayLabel() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `今天 ${m.toString().padStart(2, "0")}月${day
    .toString()
    .padStart(2, "0")}日`;
}

function processAmount(amountOrigin) {
  // let partInt=
  // if (amountOrigin.partInt === '') {
  //   amountOrigin.part
  // }
  const partInt = amountOrigin.partInt === "" ? "0" : amountOrigin.partInt;
  const partDec =
    amountOrigin.partDec === ""
      ? "00"
      : amountOrigin.partDec.length === 1
      ? amountOrigin.partDec + "0"
      : amountOrigin.partDec;
  return partInt + "." + partDec;
}

function inputLogic(amountOrigin, k) {
  if (/^\d$/.test(k)) {
    // 数字

    if (!amountOrigin.decimal) {
      amountOrigin.partInt = amountOrigin.partInt + k;
    } else if (amountOrigin.partDec.length < 2) {
      amountOrigin.partDec = amountOrigin.partDec + k;
    }
  }
  if (k === ".") {
    amountOrigin.decimal = true;
  }
  if (k === "back") {
    if (!amountOrigin.decimal) {
      amountOrigin.partInt = amountOrigin.partInt.slice(0, -1);
    } else {
      amountOrigin.partDec = amountOrigin.partDec.slice(0, -1);
    }
  }
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
    position: "relative",
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
  collapseBtn: {
    position: "absolute",
    top: -40, // ↑ 往上移一点（根据你的 padWrap 高度调整）
    right: 12, // 紧贴右边
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // Android 阴影
    shadowColor: "#000", // iOS 阴影
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  confirmBtnBottom: {
    flex: 1,
    backgroundColor: "#efa21eff",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
});
