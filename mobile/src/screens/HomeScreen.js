import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import Svg, { Circle } from "react-native-svg";

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState("home");

  const renderTxn = ({ item }) => (
    <View style={styles.txnRow}>
      <View style={[styles.txnIconBox, { backgroundColor: "#FFF7E3" }]}>
        <MaterialCommunityIcons name={item.icon} size={22} color={item.tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txnCat}>{item.cat}</Text>
        <Text style={styles.txnTime}>04月19日 周六</Text>
      </View>
      <Text
        style={[
          styles.txnAmount,
          { color: item.amount >= 0 ? "#4CAF50" : "#E35B5B" },
        ]}
      >
        {item.amount >= 0 ? "+ " : "- "} {currency(Math.abs(item.amount))}
      </Text>
    </View>
  );

  return (
    // <View style={{ flex: 1 }}>
    //   <HomeTopBar navigation={navigation} />
    //   <HomeSummary />
    //   <HomeTransactions />
    //   <HomeBottomBar
    //     onTransactions={() => navigation.navigate("Transactions")}
    //     onAdd={() => navigation.navigate("Add")}
    //     onSettings={() => navigation.navigate("Settings")}
    //   />
    // </View>
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="#FF9F45" />
      <View style={styles.root}>
        <View style={styles.headerBg} />
        {/* 顶栏：头像 + VIP */}
        <View style={styles.topBar}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("./../assets/avatar.png")}
              style={styles.avatar}
            />
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.nick}>叶小宝</Text>
                <View style={styles.vipBadge}>
                  <Text style={styles.vipText}>VIP</Text>
                </View>
              </View>
              <Text style={styles.tip} numberOfLines={1}>
                2天 叶小宝打卡日记 领取呀呀币好礼～
              </Text>
            </View>
          </View>

          <Pressable style={styles.noticeBtn}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={18}
              color="#5B3A29"
            />
          </Pressable>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {/* 余额卡片 */}
          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.cardTitle}>账户结余</Text>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={20}
                color="#C49D74"
              />
            </View>
            <Text style={styles.cardMoney}>{currency(summary.balance)}</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardSub}>
                总收入：{currency(summary.totalIn)}
              </Text>
              <Text style={styles.cardSub}>
                总支出：{currency(summary.totalOut)}
              </Text>
            </View>
          </View>

          {/* 萌宠区域 */}
          {/* <View style={styles.petWrap}>
            <Image
              style={styles.pet}
              source={require("./../assets/bear.png")}
            />
          </View> */}

          {/* 分段按钮 */}
          <View style={styles.segmentRow}>
            <Chip label="我的小屋" active />
            <Chip label="熊熊社" />
          </View>

          {/* 月份选择 */}
          {/* <View style={styles.monthRow}>
            <Pressable style={styles.monthBtn}>
              <Text style={styles.monthText}>{monthLabel}</Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={18}
                color="#5B3A29"
              />
            </Pressable>
            <Text style={styles.monthSum}>
              本月：<Text style={{ fontWeight: "700" }}>{currency(856)}</Text>
            </Text>
          </View> */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.recentRow}>
              <Text style={styles.monthText}>近期流水</Text>
              <Text style={styles.monthSum}>查看全部</Text>
            </View>

            {/* 列表 */}
            <View style={styles.recentTxn}>
              <FlatList
                data={TXNS}
                keyExtractor={(it) => it.id}
                renderItem={renderTxn}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: "#f9f8f8ff" }} />
                )}
                contentContainerStyle={{ paddingHorizontal: 16, padding: 5 }}
                scrollEnabled={false}
              />
            </View>
            <ExpenseBreakdown data={EXPENSE_BREAKDOWN} />
          </ScrollView>
        </View>
      </View>
      {/* 底部导航 */}
      {/* <View
        style={[
          styles.tabBar,
          {
            bottom: Math.max(insets.bottom, 0),
          },
        ]}
      >
        <Pressable onPress={() => setTab("home")}>
          <BottomTabItem
            icon={require("../assets/bottomIcon/home.png")}
            label="首页"
            active={tab === "home"}
          />
        </Pressable>
        <Pressable onPress={() => setTab("bill")}>
          <BottomTabItem
            icon={require("../assets/bottomIcon/transactions2.png")}
            label="账单"
            active={tab === "bill"}
          />
        </Pressable> */}

      {/* 中间“记一笔”圆钮 */}
      {/* <Pressable
            style={styles.centerAdd}
            onPress={() => console.log("Add record")}
          >
            <MaterialCommunityIcons name="plus" size={26} color="#FFF" />
          </Pressable> */}

      {/* <Pressable onPress={() => setTab("assets")}>
          <BottomTabItem
            icon={require("../assets/bottomIcon/add.png")}
            label="记一笔"
            active={tab === "assets"}
          />
        </Pressable>
        <Pressable onPress={() => setTab("me")}>
          <BottomTabItem
            icon={require("../assets/bottomIcon/bear.png")}
            label="我的"
            active={tab === "me"}
          />
        </Pressable>
      </View> */}
    </View>
  );
}

/* -------------------- 假数据 -------------------- */
const monthLabel = "2025.4";
const summary = { balance: 3289, totalIn: 4000, totalOut: 711 };

const TXNS = [
  {
    id: "1",
    cat: "购物·衣服",
    icon: "shopping-outline",
    tint: "#61A5FF",
    amount: -228.0,
  },
  {
    id: "2",
    cat: "餐饮·聚餐",
    icon: "food-outline",
    tint: "#FF9B73",
    amount: -125.0,
  },
  {
    id: "3",
    cat: "家居·杂项",
    icon: "sofa-single-outline",
    tint: "#FF6B7A",
    amount: -450.0,
  },
  {
    id: "4",
    cat: "日常·地铁",
    icon: "train-variant",
    tint: "#7BD389",
    amount: -12.0,
  },
];

const EXPENSE_BREAKDOWN = [
  { id: "food", label: "餐饮·美食", amount: 386, color: "#FF9B73" },
  { id: "shopping", label: "购物·日用", amount: 310, color: "#61A5FF" },
  { id: "home", label: "居家·水电", amount: 192, color: "#7BD389" },
  { id: "trip", label: "出行·交通", amount: 128, color: "#F7C948" },
];

function currency(n) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* -------------------- 组件 -------------------- */
function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}
    >
      <Text style={[styles.chipText, active && { color: COLORS.brown }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ExpenseBreakdown({ data }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = radius * 2 + 20;
  const center = viewBoxSize / 2;
  let start = 0;

  return (
    <View style={styles.expenseCard}>
      <View style={styles.sectionTop}>
        <Text style={styles.sectionTitle}>支出构成</Text>
        <Text style={styles.sectionHint}>本月合计 {currency(total)}</Text>
      </View>
      <View style={styles.expenseBody}>
        <View style={styles.donutWrap}>
          <Svg width={viewBoxSize} height={viewBoxSize}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#F6E7CB"
              strokeWidth={14}
              fill="transparent"
            />
            {data.map((item) => {
              const percent = total ? item.amount / total : 0;
              if (percent <= 0) {
                return null;
              }
              const segment = (
                <Circle
                  key={item.id}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={14}
                  fill="transparent"
                  strokeDasharray={`${percent * circumference} ${
                    (1 - percent) * circumference
                  }`}
                  strokeDashoffset={circumference * (1 - start)}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${center} ${center})`}
                />
              );
              start += percent;
              return segment;
            })}
          </Svg>
          <View style={styles.donutCenter}>
            <Text style={styles.centerLabel}>支出</Text>
            <Text style={styles.centerValue}>{currency(total)}</Text>
          </View>
        </View>
        <View style={styles.legendWrap}>
          {data.map((item) => {
            const percent = total ? Math.round((item.amount / total) * 100) : 0;
            return (
              <View key={item.id} style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.legendLabel}>{item.label}</Text>
                  <Text style={styles.legendValue}>
                    {currency(item.amount)} · {percent}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// function BottomTabItem({ icon, label, active }) {
//   return (
//     <View style={styles.tabItem}>
//       <MaterialCommunityIcons
//         name={icon}
//         size={22}
//         color={active ? "#5B3A29" : "#B9A88F"}
//       />
//       <Text style={[styles.tabText, active && { color: "#5B3A29" }]}>
//         {label}
//       </Text>
//     </View>
//   );
// }
function BottomTabItem({ icon, label, active }) {
  return (
    <View style={styles.tabItem}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={[styles.tabText, active && { color: "#5B3A29" }]}>
        {label}
      </Text>
    </View>
  );
}

const COLORS = {
  bgOrange: "#FF9F45", // 顶部橙
  cream: "#FFF5E6", // 页面奶油底
  card: "#FFE7BD", // 卡片黄
  border: "#F1D9B2",
  brown: "#5B3A29", // 文字棕
  softBrown: "#B38A6A",
  tabBg: "#FFEDC9",
  chip: "#F8D9A6",
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.bgOrange },
  root: { flex: 1, backgroundColor: COLORS.cream },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: COLORS.bgOrange,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
  },

  /* 顶栏 */
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  nick: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.brown,
    marginRight: 8,
  },
  vipBadge: {
    backgroundColor: "#FFF1C4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginLeft: -2,
  },
  vipText: { fontSize: 10, color: COLORS.brown, fontWeight: "700" },
  tip: { color: COLORS.softBrown, fontSize: 12, marginTop: 2, width: 210 },
  noticeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE9C2",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  /* 卡片 */
  card: {
    backgroundColor: COLORS.card,
    marginTop: 20,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    height: 130,
  },
  cardTitle: { color: COLORS.softBrown, fontSize: 15, fontWeight: "600" },
  cardMoney: {
    color: COLORS.brown,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 20,
  },
  cardRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardSub: { color: COLORS.brown, opacity: 0.8, fontSize: 12 },

  /* 萌宠 */
  petWrap: { alignItems: "center", marginTop: 12 },
  pet: { width: 150, height: 150, resizeMode: "contain" },

  /* 分段按钮 */
  segmentRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  chipActive: { backgroundColor: "#FFD891", borderColor: COLORS.border },
  chipIdle: { backgroundColor: COLORS.cream, borderColor: COLORS.border },
  chipText: { color: COLORS.softBrown, fontWeight: "700" },

  /* 支出构成 */
  expenseCard: {
    marginTop: 18,
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3E4CC",
    padding: 16,
  },
  sectionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.brown },
  sectionHint: { color: COLORS.softBrown, fontSize: 12 },
  expenseBody: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  donutWrap: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: { fontSize: 12, color: COLORS.softBrown },
  centerValue: { fontSize: 18, fontWeight: "800", color: COLORS.brown },
  legendWrap: { flex: 1 },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#F7EBD6",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendLabel: { color: COLORS.brown, fontWeight: "600" },
  legendValue: { color: COLORS.softBrown, fontSize: 12, marginTop: 2 },

  /* 近期流水 */
  recentRow: {
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1DA",
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  monthText: { color: COLORS.brown, fontWeight: "700", marginRight: 4 },
  monthSum: { color: COLORS.softBrown },

  /* 列表 */
  recentTxn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3E4CC",
  },
  txnRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 10,
  },
  txnIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  txnCat: { fontSize: 15, color: COLORS.brown, fontWeight: "600" },
  txnTime: { fontSize: 12, color: COLORS.softBrown, marginTop: 2 },
  txnAmount: { fontSize: 16, fontWeight: "700" },

  /* 底部导航 */
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    backgroundColor: COLORS.tabBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F3D9AE",
    height: 90,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabItem: { width: 54, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 11, marginTop: 2, color: "#B9A88F", fontWeight: "700" },

  icon: {
    width: 50,
    height: 50,
    // tintColor: "#B9A88F", // 未激活颜色
  },

  centerAdd: {
    position: "absolute",
    alignSelf: "center",
    bottom: 18,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFC155",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: COLORS.cream,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
