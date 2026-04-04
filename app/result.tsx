import { View, Text, StyleSheet } from 'react-native';

export default function Result() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>사이즈 분석 결과</Text>
      <Text>어깨너비 47cm</Text>
      <Text>팔길이 62cm</Text>
      <Text>가슴둘레 98cm</Text>
      <Text style={styles.result}>추천 사이즈 L / 32</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  result: { marginTop: 20, fontSize: 20, fontWeight: '800' }
});
