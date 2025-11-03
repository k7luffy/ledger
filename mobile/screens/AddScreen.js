import { Text, View, StyleSheet } from "react-native";

export default function AddScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Add</Text>
      <Text style={styles.subtitle}>This page has only the back button.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#666" },
});
