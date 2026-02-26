import { type ComponentProps, useState } from "react";
import {
  Entypo,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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

export default function LedgerScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardWidth = width - 30;
  const cardInnerWidth = cardWidth - 32;

  const handleCardScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / cardInnerWidth);
    setActiveCardIndex(nextIndex);
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
      <View style={styles.titleRow}>
        <Text style={styles.titleText}>默认账本</Text>
        <Pressable>
          <Ionicons name="person-circle-outline" size={38} color="#3E94FD" />
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
              <View style={[styles.summarySlide, { width: cardInnerWidth }]}>
                <View style={styles.summaryTagRow}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={19}
                    color="#F6BB00"
                  />
                  <Text style={styles.summaryTagText}>{item.title}</Text>
                  {item.id === "1" && (
                    <Pressable>
                      <Fontisto name="arrow-swap" size={13} color={"#F6BB00"} />
                    </Pressable>
                  )}
                </View>

                <Text style={styles.summaryAmount}>{item.amount}</Text>

                <View style={styles.summaryMetaRow}>
                  {[
                    { label: item.leftLabel, value: item.leftValue },
                    { label: item.rightLabel, value: item.rightValue },
                  ].map((metric) => (
                    <View key={`${item.id}-${metric.label}`} style={styles.metricItem}>
                      <Text style={styles.metricLabel}>{metric.label}</Text>
                      <Text style={styles.summaryMetaText}>{metric.value}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 15,
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
    fontWeight: "600",
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
});
