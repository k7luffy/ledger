import { ImageBackground, StyleSheet, Text, View } from "react-native";

function HomeSummary() {
  return (
    <View style={styles.summary}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>本月收支统计</Text>
        <Text style={{ marginTop: 25 }}>总支出</Text>
        <Text style={{ fontSize: 30, fontWeight: "800" }}>0.00</Text>
        <Text style={{ marginTop: 5, fontSize: 15, fontWeight: "500" }}>
          总收入 0.00 & 结余 0.00
        </Text>
      </View>
    </View>
  );
}

export default HomeSummary;

const styles = StyleSheet.create({
  summary: {
    height: 150,
    width: "100%",
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    opacity: 0.9,
    padding: 15,
  },
});
