import {
  Entypo,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LedgerScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top + 9,
        paddingHorizontal: 15,
        // backgroundColor: "red",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable>
          <View>
            <Fontisto name="arrow-swap" size={18} color={"#3E94FD"} />
          </View>
        </Pressable>
        <Pressable>
          <MaterialCommunityIcons
            name="dots-horizontal-circle"
            size={25}
            color={"#3E94FD"}
          />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 15,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#111827" }}>
          默认账本
        </Text>
        <Pressable>
          <Ionicons name="person-circle-outline" size={38} color="#1981F7" />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 13,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 7,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
            2026年2月
          </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
});
