import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Measure() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>전신촬영 가이드</Text>

      <Pressable style={styles.button} onPress={() => router.push('/result')}>
        <Text style={styles.buttonText}>촬영 후 결과 보기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  button: { backgroundColor: '#4A73DA', padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '800' }
});
