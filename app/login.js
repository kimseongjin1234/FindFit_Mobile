import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell } from '../components/AppShell';
import { clearUser, COLORS, getSavedUser, loginProfile } from './lib';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getSavedUser().then((user) => {
      setCurrentUser(user);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
      }
    });
  }, []);

  const submit = async () => {
    if (!email.trim()) {
      Alert.alert('입력 확인', '이메일을 입력해 주세요.');
      return;
    }
    const user = await loginProfile({ name, email, password });
    setCurrentUser(user);
    Alert.alert('저장 완료', '로그인 정보가 이 기기에 저장되었습니다.');
    router.replace('/history');
  };

  const logout = async () => {
    await clearUser();
    setCurrentUser(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <AppShell
      title="로그인 / 프로필"
      subtitle="개인용 서비스 흐름에 맞춰 이름, 이메일, 저장 기록 연동만 남기고 단순화했습니다."
    >
      <View style={styles.box}>
        <Text style={styles.label}>이름</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="예: 홍길동" placeholderTextColor="#95A0C4" />

        <Text style={styles.label}>이메일</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="findfit@example.com" placeholderTextColor="#95A0C4" />

        <Text style={styles.label}>비밀번호</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="간편 로그인용" placeholderTextColor="#95A0C4" />

        <Pressable style={styles.primaryButton} onPress={submit}>
          <Text style={styles.primaryText}>{currentUser ? '프로필 업데이트' : '로그인하고 저장 연결'}</Text>
        </Pressable>

        {currentUser ? (
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>현재 저장된 계정</Text>
            <Text style={styles.profileLine}>{currentUser.name}</Text>
            <Text style={styles.profileLine}>{currentUser.email}</Text>
            <Text style={styles.profileHint}>이 계정으로 저장한 치수 결과가 내 기록 그래프에 누적됩니다.</Text>
            <Pressable style={styles.secondaryButton} onPress={logout}>
              <Text style={styles.secondaryText}>로그아웃</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.guestCard}>
            <Text style={styles.guestTitle}>아직 로그인되지 않았습니다</Text>
            <Text style={styles.guestHint}>게스트로 측정은 가능하지만 결과 저장과 그래프 히스토리는 로그인 후 더 편하게 관리할 수 있습니다.</Text>
          </View>
        )}
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1 },
  label: { color: COLORS.text, fontWeight: '800', fontSize: 15, marginBottom: 8, marginTop: 12 },
  input: { height: 52, borderRadius: 16, backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: COLORS.line, paddingHorizontal: 16, color: COLORS.text, fontWeight: '700' },
  primaryButton: { height: 54, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  primaryText: { color: 'white', fontWeight: '900', fontSize: 16 },
  profileCard: { marginTop: 18, borderRadius: 20, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line, padding: 16 },
  profileTitle: { color: COLORS.text, fontWeight: '900', fontSize: 16, marginBottom: 8 },
  profileLine: { color: COLORS.text, fontWeight: '700', marginBottom: 4 },
  profileHint: { color: COLORS.subtext, lineHeight: 19, marginTop: 8, marginBottom: 14 },
  secondaryButton: { height: 48, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  secondaryText: { color: COLORS.text, fontWeight: '800' },
  guestCard: { marginTop: 18, borderRadius: 20, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line, padding: 16 },
  guestTitle: { color: COLORS.text, fontWeight: '900', fontSize: 16, marginBottom: 6 },
  guestHint: { color: COLORS.subtext, lineHeight: 19 },
});
