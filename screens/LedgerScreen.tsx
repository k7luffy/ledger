import {
  type ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import type { Category } from "../features/categories/categoriesSlice";
import {
  addTransaction,
  type Transaction,
} from "../features/transactions/transactionsSlice";
import type { AppDispatch, RootState } from "../store";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type SummaryCard = {
  id: string;
  icon: IconName;
  title: string;
  amount: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
};

type TransactionRowItem = {
  id: string;
  category: string;
  icon: IconName;
  iconColor: string;
  time: string;
  amount: string;
};

type TransactionSection = {
  sectionKey: string;
  dateLabel: string;
  weekday: string;
  totalExpense: number;
  data: TransactionRowItem[];
};

type QuickAction = {
  id: string;
  label: string;
  icon: IconName;
  iconBg: string;
};

type KeypadKey = {
  id: string;
  label: string;
  variant?: "default" | "secondary" | "primary";
};

type MathOperator = "+" | "-" | "×" | "÷";

const keypadDigitMap: Record<string, string> = {
  k0: "0",
  k1: "1",
  k2: "2",
  k3: "3",
  k4: "4",
  k5: "5",
  k6: "6",
  k7: "7",
  k8: "8",
  k9: "9",
};

const maxIntegerDigits = 9;

const summaryCards: SummaryCard[] = [
  {
    id: "1",
    icon: "link-circle",
    title: "月结余",
    amount: "-¥7,433.00",
    leftLabel: "总支出",
    leftValue: "¥7,433.00",
    rightLabel: "总收入",
    rightValue: "¥0.00",
  },
  {
    id: "2",
    icon: "fire-circle",
    title: "剩余月预算",
    amount: "-¥1,028.75",
    leftLabel: "总预算",
    leftValue: "¥0.00",
    rightLabel: "剩余日均",
    rightValue: "¥0.00",
  },
  {
    id: "3",
    icon: "send-circle",
    title: "账户净值",
    amount: "¥26,480.00",
    leftLabel: "总资产",
    leftValue: "¥30,000.00",
    rightLabel: "总负债",
    rightValue: "¥3,520.00",
  },
];

const quickActions: QuickAction[] = [
  {
    id: "account",
    label: "选择账户",
    icon: "wallet-outline",
    iconBg: "#F5C322",
  },
  {
    id: "reimburse",
    label: "报销",
    icon: "checkbox-blank-circle-outline",
    iconBg: "#D3D7DD",
  },
  {
    id: "coupon",
    label: "优惠",
    icon: "ticket-percent-outline",
    iconBg: "#4ECD67",
  },
  { id: "image", label: "图片", icon: "image-outline", iconBg: "#F8A310" },
  { id: "tag", label: "标签", icon: "tag-outline", iconBg: "#2A9EBA" },
  { id: "setting", label: "设置", icon: "cog-outline", iconBg: "#8D93A0" },
];

const keypadRows: KeypadKey[][] = [
  [
    { id: "k1", label: "1" },
    { id: "k2", label: "2" },
    { id: "k3", label: "3" },
    { id: "kop1", label: "+ ×" },
  ],
  [
    { id: "k4", label: "4" },
    { id: "k5", label: "5" },
    { id: "k6", label: "6" },
    { id: "kop2", label: "- ÷" },
  ],
  [
    { id: "k7", label: "7" },
    { id: "k8", label: "8" },
    { id: "k9", label: "9" },
    { id: "ksave", label: "保存再记", variant: "secondary" },
  ],
  [
    { id: "kdot", label: "." },
    { id: "k0", label: "0" },
    { id: "kdel", label: "⌫" },
    { id: "kdone", label: "完成", variant: "primary" },
  ],
];

const billTypeOptions: Array<{ id: Transaction["type"]; label: string }> = [
  { id: "EXPENSE", label: "支出" },
  { id: "INCOME", label: "收入" },
  { id: "TRANSFER", label: "转账" },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const weekdayFormatter = new Intl.DateTimeFormat("zh-CN", {
  weekday: "long",
});

const pad2 = (value: number) => String(value).padStart(2, "0");

const formatInputAmount = (value: string) => {
  if (value === "" || value === "0") {
    return "0.00";
  }

  const hasDot = value.includes(".");
  const [rawIntegerPart, decimalPart = ""] = value.split(".");
  const integerPart = rawIntegerPart.replace(/^0+(?=\d)/, "") || "0";
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!hasDot) {
    return groupedInteger;
  }

  return `${groupedInteger}.${decimalPart}`;
};

const appendDigitToInput = (value: string, digit: string) => {
  const [rawIntegerPart, decimalPart] = value.split(".");
  const integerPart = rawIntegerPart.replace(/^0+(?=\d)/, "") || "0";

  if (decimalPart !== undefined) {
    if (decimalPart.length >= 2) {
      return value;
    }
    return `${integerPart}.${decimalPart}${digit}`;
  }

  const nextInteger = integerPart === "0" ? digit : `${integerPart}${digit}`;
  if (nextInteger.length > maxIntegerDigits) {
    return value;
  }

  return nextInteger.replace(/^0+(?=\d)/, "") || "0";
};

const appendDotToInput = (value: string) =>
  value.includes(".") ? value : `${value}.`;

const deleteInputChar = (value: string, canBeEmpty: boolean) => {
  if (value.length <= 1) {
    return canBeEmpty ? "" : "0";
  }

  const next = value.slice(0, -1);
  if (next === "") {
    return canBeEmpty ? "" : "0";
  }

  if (next.endsWith(".")) {
    const trimmed = next.slice(0, -1);
    if (trimmed === "") {
      return canBeEmpty ? "" : "0";
    }
    return trimmed;
  }

  return next.replace(/^0+(?=\d)/, "") || "0";
};

const evaluateExpression = (
  leftInput: string,
  operator: MathOperator,
  rightInput: string,
) => {
  const leftNumber = Number.parseFloat(leftInput);
  const rightNumber = Number.parseFloat(rightInput);

  if (Number.isNaN(leftNumber) || Number.isNaN(rightNumber)) {
    return leftInput;
  }

  let result = leftNumber;
  if (operator === "+") {
    result = leftNumber + rightNumber;
  } else if (operator === "-") {
    result = leftNumber - rightNumber;
  } else if (operator === "×") {
    result = leftNumber * rightNumber;
  } else if (rightNumber === 0) {
    return "0";
  } else {
    result = leftNumber / rightNumber;
  }

  if (!Number.isFinite(result)) {
    return "0";
  }

  const rounded = Math.round(result * 100) / 100;
  if (Object.is(rounded, -0)) {
    return "0";
  }

  const normalized = rounded.toFixed(2).replace(/\.?0+$/, "");
  return normalized === "-0" ? "0" : normalized;
};

const formatTimeLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

const formatDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${pad2(date.getMonth() + 1)}/${pad2(date.getDate())}`;
};

const formatAmountText = (item: Transaction) => {
  const amountText = `¥${currencyFormatter.format(Math.abs(item.amount) / 100)}`;

  if (item.type === "EXPENSE") {
    return `-${amountText}`;
  }

  if (item.type === "INCOME") {
    return `+${amountText}`;
  }

  return amountText;
};

const createTransactionId = () =>
  `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const buildTransactionSections = (
  data: Transaction[],
  categoriesById: Map<string, Category>,
): TransactionSection[] => {
  const sorted = [...data].sort((a, b) => b.date - a.date);
  const sections = new Map<string, TransactionSection>();

  sorted.forEach((item) => {
    const date = new Date(item.date);
    const dayKey = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
    const current = sections.get(dayKey);
    const category = categoriesById.get(item.categoryId);
    const expense = item.type === "EXPENSE" ? item.amount : 0;

    const rowItem: TransactionRowItem = {
      id: item.id,
      category: category?.name ?? "未分类",
      icon: (category?.icon as IconName) ?? "shape-outline",
      iconColor: category?.color ?? "#E36F58",
      time: formatTimeLabel(item.date),
      amount: formatAmountText(item),
    };

    if (!current) {
      sections.set(dayKey, {
        sectionKey: dayKey,
        dateLabel: formatDateLabel(item.date),
        weekday: weekdayFormatter.format(date),
        totalExpense: expense,
        data: [rowItem],
      });
      return;
    }

    current.totalExpense += expense;
    current.data.push(rowItem);
  });

  return [...sections.values()];
};

export default function LedgerScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const transactions = useSelector(
    (state: RootState) => state.transactions.items,
  );
  const categories = useSelector((state: RootState) => state.categories.items);
  const accounts = useSelector((state: RootState) => state.accounts.items);

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [billType, setBillType] = useState<Transaction["type"]>("EXPENSE");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [leftInput, setLeftInput] = useState("0");
  const [pendingOperator, setPendingOperator] = useState<MathOperator | null>(
    null,
  );
  const [rightInput, setRightInput] = useState("");
  const deleteLongPressRef = useRef(false);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const cardWidth = width - 30;
  const cardInnerWidth = cardWidth - 32;

  const activeAccount = useMemo(
    () => accounts.find((item) => item.isActive) ?? accounts[0],
    [accounts],
  );

  const categoryMap = useMemo(
    () => new Map(categories.map((item) => [item.id, item])),
    [categories],
  );

  const selectableCategories = useMemo(() => {
    const activeCategories = categories.filter((item) => item.isActive);

    if (billType === "TRANSFER") {
      return activeCategories.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return activeCategories
      .filter((item) => item.type === billType)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [billType, categories]);

  useEffect(() => {
    if (selectableCategories.length === 0) {
      setSelectedCategoryId("");
      return;
    }

    if (!selectableCategories.some((item) => item.id === selectedCategoryId)) {
      setSelectedCategoryId(selectableCategories[0].id);
    }
  }, [selectableCategories, selectedCategoryId]);

  const transactionSections = useMemo(
    () => buildTransactionSections(transactions, categoryMap),
    [transactions, categoryMap],
  );

  const displayedSections = useMemo(
    () =>
      transactionSections.map((section) => ({
        ...section,
        data: collapsedSections[section.sectionKey] ? [] : section.data,
      })),
    [collapsedSections, transactionSections],
  );

  const leftAmountDisplay = useMemo(
    () => formatInputAmount(leftInput),
    [leftInput],
  );

  const rightAmountDisplay = useMemo(() => {
    if (rightInput === "") {
      return "";
    }
    if (rightInput === "0") {
      return "0";
    }
    return formatInputAmount(rightInput);
  }, [rightInput]);

  const keypadPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-5, 5])
        .onUpdate(() => {
          "worklet";
        }),
    [],
  );

  const timeLabel = useMemo(() => {
    const now = new Date();
    return `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  }, [isAddModalVisible]);

  const handleCardScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / cardInnerWidth);
    setActiveCardIndex(nextIndex);
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const resetAmountInput = () => {
    setLeftInput("0");
    setRightInput("");
    setPendingOperator(null);
  };

  const closeAddModal = () => {
    resetAmountInput();
    setBillType("EXPENSE");
    setIsAddModalVisible(false);
  };

  const applyOperatorFromKey = (keyId: string) => {
    const primaryOperator: MathOperator = keyId === "kop1" ? "+" : "-";
    const secondaryOperator: MathOperator = keyId === "kop1" ? "×" : "÷";
    const leftNumber = Number.parseFloat(leftInput);

    if (!pendingOperator) {
      if (Number.isNaN(leftNumber) || leftNumber === 0) {
        return;
      }
      setPendingOperator(primaryOperator);
      return;
    }

    if (rightInput === "") {
      if (pendingOperator === primaryOperator) {
        setPendingOperator(secondaryOperator);
        return;
      }
      if (pendingOperator === secondaryOperator) {
        setPendingOperator(primaryOperator);
        return;
      }
      setPendingOperator(primaryOperator);
      return;
    }

    const result = evaluateExpression(leftInput, pendingOperator, rightInput);
    setLeftInput(result);
    setRightInput("");
    setPendingOperator(primaryOperator);
  };

  const saveTransaction = (closeAfterSave: boolean) => {
    const selectedCategory =
      selectableCategories.find((item) => item.id === selectedCategoryId) ??
      selectableCategories[0];

    if (!selectedCategory) {
      return;
    }

    const inputValue =
      pendingOperator && rightInput !== ""
        ? evaluateExpression(leftInput, pendingOperator, rightInput)
        : leftInput;

    const amountValue = Number.parseFloat(inputValue);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }

    const now = Date.now();
    const amountInCents = Math.round(Math.abs(amountValue) * 100);
    const primaryAccountId = activeAccount?.id ?? "acc_default_cny";
    const secondaryAccountId = accounts.find(
      (item) => item.id !== primaryAccountId,
    )?.id;

    dispatch(
      addTransaction({
        id: createTransactionId(),
        userId: activeAccount?.userId ?? "demo-user",
        amount: amountInCents,
        type: billType,
        currency: activeAccount?.currency ?? "CNY",
        categoryId: selectedCategory.id,
        rootCategoryId: selectedCategory.parentId ?? selectedCategory.id,
        accountId: primaryAccountId,
        toAccountId: billType === "TRANSFER" ? secondaryAccountId : undefined,
        isExcludeFromStats: false,
        isExcludeFromBudget: false,
        status: "COMPLETED",
        refundStatus: "NONE",
        date: now,
        createdAt: now,
        updatedAt: now,
        note: "",
        tags: [],
        images: [],
      }),
    );

    resetAmountInput();

    if (closeAfterSave) {
      setIsAddModalVisible(false);
    }
  };

  const handleAmountKeyPress = (key: KeypadKey) => {
    if (key.id === "kdel") {
      if (pendingOperator) {
        if (rightInput !== "") {
          setRightInput((prev) => deleteInputChar(prev, true));
          return;
        }
        setPendingOperator(null);
        return;
      }

      setLeftInput((prev) => deleteInputChar(prev, false));
      return;
    }

    if (key.id === "kdot") {
      if (pendingOperator) {
        setRightInput((prev) => (prev === "" ? "0." : appendDotToInput(prev)));
        return;
      }

      setLeftInput((prev) => appendDotToInput(prev));
      return;
    }

    if (key.id === "kop1" || key.id === "kop2") {
      applyOperatorFromKey(key.id);
      return;
    }

    if (key.id === "ksave") {
      saveTransaction(false);
      return;
    }

    if (key.id === "kdone") {
      if (pendingOperator && rightInput !== "") {
        const result = evaluateExpression(
          leftInput,
          pendingOperator,
          rightInput,
        );
        setLeftInput(result);
        setRightInput("");
        setPendingOperator(null);
        return;
      }

      saveTransaction(true);
      return;
    }

    const digit = keypadDigitMap[key.id];
    if (!digit) {
      return;
    }

    if (pendingOperator) {
      setRightInput((prev) =>
        appendDigitToInput(prev === "" ? "0" : prev, digit),
      );
      return;
    }

    setLeftInput((prev) => appendDigitToInput(prev, digit));
  };

  const handleDeleteLongPress = () => {
    deleteLongPressRef.current = true;
    resetAmountInput();
  };

  const getKeyLabel = (key: KeypadKey) => {
    if (key.id === "kdone") {
      return pendingOperator && rightInput !== "" ? "=" : "完成";
    }

    return key.label;
  };

  const triggerKeyHaptic = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: insets.top + 9 }]}>
      <View style={styles.topRow}>
        <Pressable>
          <Fontisto name="arrow-swap" size={18} color="#3E94FD" />
        </Pressable>
        <Pressable>
          <MaterialCommunityIcons
            name="dots-horizontal-circle"
            size={25}
            color="#3E94FD"
          />
        </Pressable>
      </View>

      <SectionList
        sections={displayedSections}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>默认账本</Text>
              <Pressable>
                <Ionicons
                  name="person-circle-outline"
                  size={38}
                  color="#3E94FD"
                />
              </Pressable>
            </View>
            <View style={styles.monthRow}>
              <View style={styles.monthLeft}>
                <Text style={styles.monthText}>2026年2月</Text>
                <TouchableOpacity style={styles.navBtn}>
                  <Entypo name="chevron-left" size={17} color="#A9A9B0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBtn}>
                  <Entypo name="chevron-right" size={17} color="#A9A9B0" />
                </TouchableOpacity>
              </View>
              <Pressable style={styles.calendarBtn}>
                <Text style={styles.calendarText}>收支日历</Text>
              </Pressable>
            </View>

            <View style={styles.cardSection}>
              <View style={[styles.summaryCard, { width: cardWidth }]}>
                <FlatList
                  data={summaryCards}
                  horizontal
                  pagingEnabled
                  bounces
                  alwaysBounceHorizontal
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  onMomentumScrollEnd={handleCardScrollEnd}
                  renderItem={({ item }) => (
                    <View
                      style={[styles.summarySlide, { width: cardInnerWidth }]}
                    >
                      <View style={styles.summaryTagRow}>
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={19}
                          color="#F6BB00"
                        />
                        <Text style={styles.summaryTagText}>{item.title}</Text>
                        {item.id === "1" && (
                          <Pressable>
                            <Fontisto
                              name="arrow-swap"
                              size={13}
                              color="#F6BB00"
                            />
                          </Pressable>
                        )}
                      </View>

                      <Text style={styles.summaryAmount}>{item.amount}</Text>

                      <View style={styles.summaryMetaRow}>
                        {[
                          { label: item.leftLabel, value: item.leftValue },
                          { label: item.rightLabel, value: item.rightValue },
                        ].map((metric) => (
                          <View
                            key={`${item.id}-${metric.label}`}
                            style={styles.metricItem}
                          >
                            <Text style={styles.metricLabel}>
                              {metric.label}
                            </Text>
                            <Text style={styles.summaryMetaText}>
                              {metric.value}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                />

                <View style={styles.dotRow}>
                  {summaryCards.map((item, index) => (
                    <View
                      key={item.id}
                      style={[
                        styles.dot,
                        index === activeCardIndex && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </>
        }
        renderSectionHeader={({ section }) => {
          const isCollapsed = Boolean(collapsedSections[section.sectionKey]);
          return (
            <View style={styles.transactionHeaderRow}>
              <Text style={styles.transactionDateText}>
                {section.dateLabel} {section.weekday}
              </Text>
              <Pressable
                style={styles.transactionTotalWrap}
                onPress={() => toggleSection(section.sectionKey)}
              >
                <Text style={styles.transactionTotalText}>
                  支出: ¥{currencyFormatter.format(section.totalExpense / 100)}
                </Text>
                <Entypo
                  name={isCollapsed ? "chevron-right" : "chevron-down"}
                  size={16}
                  color="#97979F"
                />
              </Pressable>
            </View>
          );
        }}
        renderItem={({ item, index, section }) => {
          const isFirst = index === 0;
          const isLast = index === section.data.length - 1;

          return (
            <View
              style={[
                styles.transactionRow,
                isFirst && styles.transactionRowFirst,
                !isLast && styles.transactionRowBorder,
                isLast && styles.transactionRowLast,
              ]}
            >
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIconBg,
                    { backgroundColor: item.iconColor },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color="#FFFFFF"
                  />
                </View>

                <View>
                  <Text style={styles.transactionCategory}>
                    {item.category}
                  </Text>
                  <Text style={styles.transactionTime}>{item.time}</Text>
                </View>
              </View>

              <Text style={styles.transactionAmount}>{item.amount}</Text>
            </View>
          );
        }}
      />

      <Pressable
        style={[styles.fabButton, { bottom: 20 }]}
        onPress={() => setIsAddModalVisible(true)}
      >
        <FontAwesome name="plus" size={28} color="#FFFFFF" />
      </Pressable>

      <Modal
        visible={isAddModalVisible}
        presentationStyle="pageSheet"
        animationType="slide"
        allowSwipeDismissal
        onRequestClose={closeAddModal}
      >
        <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeaderRow}>
            <Pressable onPress={closeAddModal}>
              <Text style={styles.modalCancelText}>取消</Text>
            </Pressable>

            <View style={styles.billTypeSwitch}>
              {billTypeOptions.map((item, index) => {
                const isActive = billType === item.id;
                return (
                  <View key={item.id} style={styles.billTypeOptionWrap}>
                    <Pressable
                      style={[
                        styles.billTypeBtn,
                        isActive && styles.billTypeBtnActive,
                      ]}
                      onPress={() => setBillType(item.id)}
                    >
                      <Text
                        style={[
                          styles.billTypeText,
                          isActive && styles.billTypeTextActive,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                    {index < billTypeOptions.length - 1 && (
                      <View style={styles.billTypeDivider} />
                    )}
                  </View>
                );
              })}
            </View>

            <Pressable>
              <Text style={styles.modalBookText}>
                {activeAccount?.name ?? "默认账本"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.modalBody}>
            <ScrollView
              style={styles.categoryScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.categoryGrid}>
                {selectableCategories.map((category) => {
                  const isSelected = selectedCategoryId === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      style={styles.categoryItem}
                      onPress={() => setSelectedCategoryId(category.id)}
                    >
                      <View
                        style={[
                          styles.categoryIconCircle,
                          isSelected && styles.categoryIconCircleActive,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={(category.icon as IconName) ?? "shape-outline"}
                          size={25}
                          color={isSelected ? "#FFFFFF" : "#5F626A"}
                        />
                      </View>
                      <Text style={styles.categoryLabel}>{category.name}</Text>
                    </Pressable>
                  );
                })}

                {selectableCategories.length === 0 && (
                  <Text style={styles.emptyCategoryText}>
                    当前类型暂无可选分类
                  </Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalBottomSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickActionRow}
              >
                {quickActions.map((item) => (
                  <Pressable key={item.id} style={styles.quickActionChip}>
                    <View
                      style={[
                        styles.quickActionIconBg,
                        { backgroundColor: item.iconBg },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={13}
                        color="#FFFFFF"
                      />
                    </View>
                    <Text style={styles.quickActionText}>{item.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.amountCard}>
                <View style={styles.amountDisplayRow}>
                  <Text style={styles.amountDisplay}>
                    ¥ {leftAmountDisplay}
                  </Text>
                  {pendingOperator && (
                    <Text style={styles.amountOperator}>{pendingOperator}</Text>
                  )}
                  {pendingOperator && rightInput !== "" && (
                    <Text style={styles.amountDisplay}>
                      {rightAmountDisplay}
                    </Text>
                  )}
                </View>

                <View style={styles.amountDivider} />

                <View style={styles.amountFooterRow}>
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={19} color="#5F6878" />
                    <Text style={styles.timeBadgeText}>{timeLabel}</Text>
                  </View>

                  <Text style={styles.notePlaceholder}>点击填写备注</Text>

                  <Pressable style={styles.foldBtn}>
                    <MaterialCommunityIcons
                      name="chevron-up"
                      size={20}
                      color="#6C717D"
                    />
                  </Pressable>
                </View>
              </View>

              <GestureDetector gesture={keypadPanGesture}>
                <View style={styles.keypadContainer}>
                  {keypadRows.map((row) => (
                    <View key={row[0].id} style={styles.keypadRow}>
                      {row.map((key) => (
                        <Pressable
                          key={key.id}
                          onPressIn={() => {
                            if (!keypadDigitMap[key.id]) {
                              return;
                            }
                            triggerKeyHaptic();
                            handleAmountKeyPress(key);
                          }}
                          onPress={() => {
                            if (keypadDigitMap[key.id]) {
                              return;
                            }
                            if (
                              key.id === "kdel" &&
                              deleteLongPressRef.current
                            ) {
                              deleteLongPressRef.current = false;
                              return;
                            }
                            triggerKeyHaptic();
                            handleAmountKeyPress(key);
                          }}
                          onLongPress={() => {
                            if (key.id === "kdel") {
                              void Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Medium,
                              );
                              handleDeleteLongPress();
                            }
                          }}
                          onPressOut={() => {
                            if (key.id === "kdel") {
                              deleteLongPressRef.current = false;
                            }
                          }}
                          style={({ pressed }) => [
                            styles.keypadKey,
                            key.variant === "secondary" &&
                              styles.keypadKeySecondary,
                            key.variant === "primary" &&
                              styles.keypadKeyPrimary,
                            pressed && styles.keypadKeyPressed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.keypadKeyText,
                              key.variant === "secondary" &&
                                styles.keypadKeyTextSecondary,
                              key.variant === "primary" &&
                                styles.keypadKeyTextPrimary,
                            ]}
                          >
                            {getKeyLabel(key)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ))}
                </View>
              </GestureDetector>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 13,
  },
  monthLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 7,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  cardSection: {
    paddingTop: 14,
  },
  navBtn: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarBtn: {
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 14,
    backgroundColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarText: {
    fontSize: 13,
    color: "#7C7C7C",
    fontWeight: "700",
  },
  summaryCard: {
    backgroundColor: "#F6F6F7",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  summarySlide: {
    minHeight: 100,
  },
  summaryTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  summaryTagText: {
    color: "#F6BB00",
    fontSize: 16,
    fontWeight: "700",
  },
  summaryAmount: {
    marginTop: 10,
    color: "#12131A",
    fontSize: 38,
    fontFamily: "DINCondensed-Bold",
    letterSpacing: 0.2,
  },
  summaryMetaRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 16,
  },
  metricItem: {
    flexDirection: "row",
    gap: 5,
  },
  metricLabel: {
    color: "#9C9C9C",
    fontSize: 15,
    fontWeight: "500",
  },
  summaryMetaText: {
    color: "#656565",
    fontSize: 15,
    fontWeight: "500",
  },
  dotRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#E2E2E4",
  },
  dotActive: {
    backgroundColor: "#F2B112",
  },
  transactionHeaderRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionDateText: {
    color: "#8F8F97",
    fontSize: 13,
    fontWeight: "700",
  },
  transactionTotalWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  transactionTotalText: {
    color: "#8F8F97",
    fontSize: 13,
    fontWeight: "700",
  },
  transactionRowFirst: {
    marginTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  transactionRowLast: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  transactionRow: {
    backgroundColor: "#F7F7F8",
    paddingHorizontal: 14,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E8",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionIconBg: {
    width: 35,
    height: 35,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionCategory: {
    color: "#101218",
    fontSize: 15,
    fontWeight: "700",
  },
  transactionTime: {
    marginTop: 2,
    color: "#8F8F97",
    fontSize: 12,
    fontWeight: "500",
  },
  transactionAmount: {
    color: "#12131A",
    fontSize: 15,
    fontWeight: "400",
  },
  fabButton: {
    position: "absolute",
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 45,
    backgroundColor: "#F8BF16",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
    zIndex: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#EFEFF1",
  },
  modalHeaderRow: {
    height: 60,
    paddingTop: 10,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalCancelText: {
    color: "#777B84",
    fontSize: 17,
    fontWeight: "500",
  },
  billTypeSwitch: {
    height: 32,
    borderRadius: 9,
    backgroundColor: "#E4E4E4",
    padding: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  billTypeOptionWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  billTypeBtn: {
    minWidth: 38,
    height: "100%",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  billTypeBtnActive: {
    backgroundColor: "#F4F4F6",
    shadowColor: "#787777",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  billTypeText: {
    color: "#2F3138",
    fontSize: 13,
    fontWeight: "500",
  },
  billTypeTextActive: {
    color: "#14161D",
    fontWeight: "700",
  },
  billTypeDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#BEBFC6",
    marginHorizontal: 2,
  },
  modalBookText: {
    color: "#2787F8",
    fontSize: 17,
    fontWeight: "400",
  },
  modalBody: {
    flex: 1,
    minHeight: 0,
  },
  categoryScroll: {
    flex: 1,
    minHeight: 0,
  },
  modalScrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  modalBottomSection: {
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 14,
  },
  categoryItem: {
    width: "20%",
    alignItems: "center",
    gap: 3,
  },
  categoryIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 31,
    backgroundColor: "#E6E6E9",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconCircleActive: {
    backgroundColor: "#F36855",
  },
  categoryLabel: {
    color: "#737373",
    fontSize: 13,
    fontWeight: "500",
  },
  emptyCategoryText: {
    color: "#8A8C92",
    fontSize: 14,
    paddingTop: 12,
  },
  quickActionRow: {
    paddingVertical: 5,
    paddingRight: 10,
    gap: 10,
  },
  quickActionChip: {
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F6F6F7",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  quickActionIconBg: {
    width: 20,
    height: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    color: "#22242B",
    fontSize: 14,
    fontWeight: "400",
  },
  amountCard: {
    backgroundColor: "#F6F6F7",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  amountDisplayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountDisplay: {
    color: "#EC6252",
    fontSize: 40,
    lineHeight: 40,
    fontFamily: "DINCondensed-Bold",
  },
  amountOperator: {
    color: "#EC6252",
    fontSize: 30,
    lineHeight: 40,
    fontWeight: "700",
    marginHorizontal: 2,
    includeFontPadding: false,
    transform: [{ translateY: -4 }],
    fontFamily: "DINCondensed-Bold",
  },
  amountDivider: {
    marginTop: 8,
    height: 1,
    backgroundColor: "#E3E3E6",
  },
  amountFooterRow: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  timeBadge: {
    height: 28,
    borderRadius: 22,
    backgroundColor: "#ECECEE",
    paddingHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  timeBadgeText: {
    color: "#4F5869",
    fontSize: 15,
  },
  notePlaceholder: {
    marginLeft: 12,
    flex: 1,
    color: "#c8c9cd",
    fontSize: 15,
    fontWeight: "400",
  },
  foldBtn: {
    width: 20,
    height: 20,
    borderRadius: 22,
    backgroundColor: "#ECECEE",
    alignItems: "center",
    justifyContent: "center",
  },
  keypadContainer: {
    paddingTop: 8,
    paddingBottom: 4,
    gap: 5,
  },
  keypadRow: {
    flexDirection: "row",
    gap: 5,
  },
  keypadKey: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F6F6F7",
    alignItems: "center",
    justifyContent: "center",
  },
  keypadKeySecondary: {
    backgroundColor: "#EAEBEE",
  },
  keypadKeyPrimary: {
    backgroundColor: "#EF6453",
  },
  keypadKeyPressed: {
    backgroundColor: "#ACAFBC",
  },
  keypadKeyText: {
    color: "#4C5565",
    fontSize: 22,
    fontWeight: "500",
  },
  keypadKeyTextSecondary: {
    color: "#4D5566",
    fontSize: 18,
    fontWeight: "700",
  },
  keypadKeyTextPrimary: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
});
