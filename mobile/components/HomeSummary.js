import { ImageBackground, StyleSheet, Text, View } from "react-native";

function HomeSummary() {
  return (
    <View style={styles.summary}>
      <ImageBackground
        source={require("../assets/card.png")}
        style={styles.card}
        imageStyle={{
          borderRadius: 16, // 👈 给“图片”也设置圆角
          opacity: 0.5,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>本月收支统计</Text>
        <Text style={{ marginTop: 25 }}>总支出</Text>
        <Text style={{ fontSize: 30, fontWeight: "800" }}>0.00</Text>
        <Text style={{ marginTop: 5, fontSize: 15, fontWeight: "500" }}>
          总收入 0.00 & 结余 0.00
        </Text>
      </ImageBackground>
    </View>
  );
}

export default HomeSummary;

const styles = StyleSheet.create({
  summary: {
    height: 200,
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
  },
  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#E8F3F1",
    borderRadius: 16,
    opacity: 0.9,
    padding: 15,
  },
});
