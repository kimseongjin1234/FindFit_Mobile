import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FindFit 측정 방법</Text>

      <Pressable style={styles.button} onPress={() => router.push('/measure')}>
        <Text style={styles.buttonText}>시작하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  button: { backgroundColor: '#4A73DA', padding: 16, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '800' }
});
