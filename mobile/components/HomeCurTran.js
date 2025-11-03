import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

function getDateRangeLabel(type) {
  const now = new Date();

  // 获取开始和结束日期
  let start, end;

  switch (type) {
    case "today": {
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
      break;
    }

    case "week": {
      const day = now.getDay(); // 星期几（0是周日）
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      start = new Date(now);
      start.setDate(now.getDate() + diffToMonday);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case "month": {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }

    case "year": {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    }

    default:
      throw new Error("Unknown type");
  }

  // 转换为 "M月D日" 格式
  const formatDate = (date) => {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${m.toString().padStart(2, "0")}月${d
      .toString()
      .padStart(2, "0")}日`;
  };

  switch (type) {
    case "today":
      return `${start.getFullYear()}年${formatDate(start)}`;
    case "year":
      return `${start.getFullYear()}年`;
    default:
      return `${formatDate(start)} - ${formatDate(end)}`;
  }
}

function getTime(type) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  switch (type) {
    case "today":
      return year + "年" + month + "月" + day + "日";
    case "week":
      return month + "月01日-" + month + "月30日";
    case "month":
      return month + "月01日-" + month + "月30日";
    case "year":
      return year + "年";
  }
}

function HomeCurTran({ type }) {
  return (
    <View style={styles.containerBase}>
      <MaterialCommunityIcons
        name={
          (type === "today" && "calendar-today") ||
          (type === "week" && "calendar-week") ||
          (type === "month" && "calendar-month") ||
          (type === "year" && "cash")
        }
        size={26}
        // color="#000000"
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: "700", fontSize: 16 }}>
          {(type === "today" && "今天") ||
            (type === "week" && "本周") ||
            (type === "month" && "本月") ||
            (type === "year" && "今年")}
        </Text>
        <Text style={{ marginTop: 5 }}>{getDateRangeLabel(type)}</Text>
      </View>
      <View style={{ marginLeft: "auto" }}>
        <Text>总收入 0.00</Text>
        <Text>总支出 0.00</Text>
      </View>
    </View>
  );
}

export default HomeCurTran;

const styles = StyleSheet.create({
  containerBase: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#EEF5EC",
    alignItems: "center",
    padding: 15,
  },
  containerToday: {
    backgroundColor: "#CCADDD",
  },
  containerWeek: {
    backgroundColor: "#ABCDEF",
  },
  containerMonth: {
    backgroundColor: "#BBAD",
  },
  containerYear: {
    backgroundColor: "#5eca93ff",
  },
});
