import { StyleSheet, Text, View } from 'react-native';

export default function SavingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Savings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#111',
  },
});
