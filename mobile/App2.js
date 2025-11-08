// App.js
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
      <Text style={[styles.chipText, active && { color: "#5B3A29" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function BottomTabItem({ icon, label, active }) {
  return (
    <View style={styles.tabItem}>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={active ? "#5B3A29" : "#B9A88F"}
      />
      <Text style={[styles.tabText, active && { color: "#5B3A29" }]}>
        {label}
      </Text>
    </View>
  );
}

/* -------------------- 主页面 -------------------- */
export default function App() {
  const [tab, setTab] = React.useState("home");

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
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#FF9F45" />
      <View style={styles.root}>
        {/* 顶部橙色背景 */}
        <View style={styles.headerBg} />

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* 顶栏：头像 + VIP */}
          <View style={styles.topBar}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: "https://i.pravatar.cc/100?img=12" }}
                style={styles.avatar}
              />
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.nick}>谭谭</Text>
                  <View style={styles.vipBadge}>
                    <Text style={styles.vipText}>VIP</Text>
                  </View>
                </View>
                <Text style={styles.tip} numberOfLines={1}>
                  2天 谭谭打卡日记 领取呀呀币好礼～
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

          {/* 余额卡片 */}
          <View style={styles.card}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
          <View style={styles.petWrap}>
            <Image
              style={styles.pet}
              // 占位小熊图片（可换成本地资源）
              source={require("./src/assets/bear.png")}
            />
          </View>

          {/* 分段按钮 */}
          <View style={styles.segmentRow}>
            <Chip label="我的小屋" active />
            <Chip label="谭谭社" />
          </View>

          {/* 月份选择 */}
          <View style={styles.monthRow}>
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
          </View>

          {/* 列表 */}
          <FlatList
            data={TXNS}
            keyExtractor={(it) => it.id}
            renderItem={renderTxn}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
            scrollEnabled={false}
          />
        </ScrollView>

        {/* 底部导航 */}
        <View style={styles.tabBar}>
          <Pressable onPress={() => setTab("home")}>
            <BottomTabItem
              icon="home-variant"
              label="首页"
              active={tab === "home"}
            />
          </Pressable>
          <Pressable onPress={() => setTab("bill")}>
            <BottomTabItem
              icon="notebook-outline"
              label="账单"
              active={tab === "bill"}
            />
          </Pressable>

          {/* 中间“记一笔”圆钮 */}
          <Pressable
            style={styles.centerAdd}
            onPress={() => console.log("Add record")}
          >
            <MaterialCommunityIcons name="plus" size={26} color="#FFF" />
          </Pressable>

          <Pressable onPress={() => setTab("assets")}>
            <BottomTabItem
              icon="wallet-outline"
              label="借贷"
              active={tab === "assets"}
            />
          </Pressable>
          <Pressable onPress={() => setTab("me")}>
            <BottomTabItem
              icon="paw-outline"
              label="我的"
              active={tab === "me"}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* -------------------- 样式 -------------------- */
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
  safe: { flex: 1, backgroundColor: COLORS.bgOrange },
  root: { flex: 1, backgroundColor: COLORS.cream },
  headerBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: COLORS.bgOrange,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
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
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: { color: COLORS.softBrown, fontSize: 13 },
  cardMoney: {
    color: COLORS.brown,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
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
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 10,
  },
  chipActive: { backgroundColor: "#FFD891", borderColor: COLORS.border },
  chipIdle: { backgroundColor: COLORS.cream, borderColor: COLORS.border },
  chipText: { color: COLORS.softBrown, fontWeight: "700" },

  /* 月份条 */
  monthRow: {
    marginTop: 10,
    paddingHorizontal: 16,
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
  monthSum: { color: COLORS.softBrown, fontSize: 12 },

  /* 列表 */
  txnRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F3E4CC",
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
    bottom: 16,
    backgroundColor: COLORS.tabBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#F3D9AE",
    height: 66,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabItem: { width: 54, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 11, marginTop: 2, color: "#B9A88F", fontWeight: "700" },

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
