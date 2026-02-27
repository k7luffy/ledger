import { type ComponentProps, useMemo, useRef, useState } from "react";
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

type SummaryCard = {
  id: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  amount: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
};

type Transaction = {
  id: string;
  date: string;
  weekday: string;
  category: string;
  time: string;
  amount: string;
};

type TransactionSection = {
  sectionKey: string;
  date: string;
  weekday: string;
  totalExpense: number;
  data: Transaction[];
};

type AddCategory = {
  id: string;
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  active?: boolean;
};

type QuickAction = {
  id: string;
  label: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
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

const transactions: Transaction[] = [
  {
    id: "1",
    date: "2026-02-26",
    weekday: "星期四",
    category: "餐饮",
    time: "13:50",
    amount: "-¥6,634.00",
  },
  {
    id: "2",
    date: "2026-02-26",
    weekday: "星期四",
    category: "餐饮",
    time: "13:50",
    amount: "-¥647.00",
  },
  {
    id: "3",
    date: "2026-02-26",
    weekday: "星期四",
    category: "餐饮",
    time: "13:50",
    amount: "-¥85.00",
  },
  {
    id: "4",
    date: "2026-02-26",
    weekday: "星期四",
    category: "餐饮",
    time: "13:50",
    amount: "-¥3.00",
  },
  {
    id: "5",
    date: "2026-02-26",
    weekday: "星期四",
    category: "餐饮",
    time: "21:15",
    amount: "-¥5.00",
  },
  {
    id: "6",
    date: "2026-02-27",
    weekday: "星期五",
    category: "餐饮",
    time: "10:37",
    amount: "-¥5.00",
  },
  {
    id: "7",
    date: "2026-02-26",
    weekday: "星期四",
    category: "餐饮",
    time: "13:50",
    amount: "-¥58.00",
  },
];

const addCategories: AddCategory[] = [
  { id: "food", label: "餐饮", icon: "food-drumstick-outline", active: true },
  { id: "shopping", label: "购物", icon: "cart-outline" },
  { id: "cloth", label: "服饰", icon: "tshirt-crew-outline" },
  { id: "daily", label: "日用", icon: "bottle-tonic-outline" },
  { id: "digital", label: "数码", icon: "cellphone" },
  { id: "beauty", label: "美妆", icon: "lipstick" },
  { id: "skin", label: "护肤", icon: "bottle-tonic-plus-outline" },
  { id: "app", label: "应用软件", icon: "application-outline" },
  { id: "house", label: "住房", icon: "home-city-outline" },
  { id: "traffic", label: "交通", icon: "bus" },
  { id: "game", label: "娱乐", icon: "gamepad-variant-outline" },
  { id: "medical", label: "医疗", icon: "medical-bag" },
  { id: "phone", label: "通讯", icon: "phone-outline" },
  { id: "car", label: "汽车", icon: "car-outline" },
  { id: "study", label: "学习", icon: "book-open-page-variant-outline" },
  { id: "office", label: "办公", icon: "printer-outline" },
  { id: "sport", label: "运动", icon: "badminton" },
  { id: "social", label: "社交", icon: "account-group-outline" },
  { id: "favor", label: "人情", icon: "hand-heart-outline" },
  { id: "baby", label: "育儿", icon: "baby-face-outline" },
  { id: "pet", label: "宠物", icon: "paw-outline" },
  { id: "travel", label: "旅行", icon: "bag-suitcase-outline" },
  { id: "vacation", label: "度假", icon: "palm-tree" },
  { id: "smoke", label: "烟酒", icon: "glass-cocktail" },
  { id: "lottery", label: "彩票", icon: "ticket-outline" },
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

const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const parseAmount = (value: string) => {
  const amount = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isNaN(amount) ? 0 : amount;
};

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

const formatDateLabel = (date: string) => {
  const [, month, day] = date.split("-");
  return `${month}/${day}`;
};

const buildTransactionSections = (
  data: Transaction[],
): TransactionSection[] => {
  const sorted = [...data].sort((a, b) => {
    const dateOrder = b.date.localeCompare(a.date);
    if (dateOrder !== 0) {
      return dateOrder;
    }
    return b.time.localeCompare(a.time);
  });

  const sections = new Map<string, TransactionSection>();

  sorted.forEach((item) => {
    const sectionKey = `${item.date}-${item.weekday}`;
    const current = sections.get(sectionKey);
    const parsedAmount = parseAmount(item.amount);
    const expense = parsedAmount < 0 ? Math.abs(parsedAmount) : 0;

    if (!current) {
      sections.set(sectionKey, {
        sectionKey,
        date: item.date,
        weekday: item.weekday,
        totalExpense: expense,
        data: [item],
      });
      return;
    }

    current.totalExpense += expense;
    current.data.push(item);
  });

  return [...sections.values()];
};

export default function LedgerScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
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
  const transactionSections = useMemo(
    () => buildTransactionSections(transactions),
    [transactions],
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
  const rightAmountDisplay = useMemo(
    () => {
      if (rightInput === "") {
        return "";
      }
      if (rightInput === "0") {
        return "0";
      }
      return formatInputAmount(rightInput);
    },
    [rightInput],
  );
  const keypadPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-12, 12])
        .onUpdate(() => {
          "worklet";
        }),
    [],
  );

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
      }
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
    setLeftInput("0");
    setRightInput("");
    setPendingOperator(null);
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
                              color={"#F6BB00"}
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
                {formatDateLabel(section.date)} {section.weekday}
              </Text>
              <Pressable
                style={styles.transactionTotalWrap}
                onPress={() => toggleSection(section.sectionKey)}
              >
                <Text style={styles.transactionTotalText}>
                  支出: ¥{currencyFormatter.format(section.totalExpense)}
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
                <View style={styles.transactionIconBg}>
                  <MaterialCommunityIcons
                    name="food-drumstick-outline"
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
        onRequestClose={() => {
          setLeftInput("0");
          setRightInput("");
          setPendingOperator(null);
          setIsAddModalVisible(false);
        }}
      >
        <View style={[styles.modalContainer, { paddingBottom: insets.bottom }]}>
          <View style={styles.modalHeaderRow}>
            <Pressable onPress={() => setIsAddModalVisible(false)}>
              <Text style={styles.modalCancelText}>取消</Text>
            </Pressable>

            <View style={styles.billTypeSwitch}>
              <Pressable style={[styles.billTypeBtn, styles.billTypeBtnActive]}>
                <Text style={[styles.billTypeText, styles.billTypeTextActive]}>
                  支出
                </Text>
              </Pressable>
              <View style={styles.billTypeDivider} />
              <Pressable style={styles.billTypeBtn}>
                <Text style={styles.billTypeText}>收入</Text>
              </Pressable>
              <View style={styles.billTypeDivider} />
              <Pressable style={styles.billTypeBtn}>
                <Text style={styles.billTypeText}>转账</Text>
              </Pressable>
            </View>

            <Pressable>
              <Text style={styles.modalBookText}>默认账本</Text>
            </Pressable>
          </View>

          <View style={styles.modalBody}>
            <ScrollView
              style={styles.categoryScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <View style={styles.categoryGrid}>
                {addCategories.map((category) => (
                  <Pressable key={category.id} style={styles.categoryItem}>
                    <View
                      style={[
                        styles.categoryIconCircle,
                        category.active && styles.categoryIconCircleActive,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={category.icon}
                        size={25}
                        color={category.active ? "#FFFFFF" : "#5F626A"}
                      />
                    </View>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                  </Pressable>
                ))}
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
                    <Text style={styles.timeBadgeText}>11:28</Text>
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
    backgroundColor: "#E36F58",
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
