import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 用于返回箭头图标

export default function TransactionsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 👇 自定义 Header */}
      <ImageBackground
        style={styles.header}
        source={require("../assets/card.png")}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#333" />
            <Text style={styles.backText}>Home</Text>
          </TouchableOpacity>

          {/* 右侧按钮或图标（可选） */}
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={{ fontSize: 30, fontWeight: "600", lineHeight: 30 }}>
                43.74{" "}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <Text style={{ lineHeight: 26, fontWeight: "700" }}> 结余</Text>
            </View>
          </View>
          <Text style={{ marginTop: 10, fontWeight: "700" }}>
            收入209.74 | 支出166.00
          </Text>
        </View>
        {/* 左侧返回 */}
      </ImageBackground>

      {/* 👇 页面内容 */}
      <View style={{ flex: 1, padding: 16 }}>
        <Text>Your transactions go here...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 200, // 👈 自定义高度
    paddingTop: 65,
    paddingBottom: 20,
    paddingHorizontal: 16,
    // alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF5EC",
    // position: "relative",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  backButton: {
    flexDirection: "row",
    // alignItems: "center",
  },
  backText: {
    marginLeft: 4,
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
});
