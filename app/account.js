import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell } from '../components/AppShell';
import { clearUser, COLORS, getSavedMeasurements, getSavedUser } from './lib';

export default function AccountScreen() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    Promise.all([getSavedUser(), getSavedMeasurements()]).then(([savedUser, rows]) => {
      setUser(savedUser);
      setRecords(rows);
    });
  }, []);

  const logout = async () => {
    await clearUser();
    setUser(null);
    Alert.alert('로그아웃 완료', '이 기기에 저장된 프로필 정보가 정리되었습니다.');
    router.replace('/login');
  };

  return (
    <AppShell
      title="내 계정"
      subtitle="프로필, 저장 횟수, 최근 치수 요약을 한 화면에서 볼 수 있게 정리했습니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 14 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0] || 'F'}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name || '로그인이 필요합니다'}</Text>
            <Text style={styles.email}>{user?.email || '로그인 후 프로필 정보가 표시됩니다.'}</Text>
          </View>
          <Pressable style={styles.editBtn} onPress={() => router.push('/login')}>
            <Text style={styles.editBtnText}>{user ? '수정' : '로그인'}</Text>
          </Pressable>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCard}><Text style={styles.statLabel}>저장 기록</Text><Text style={styles.statValue}>{records.length}</Text></View>
          <View style={styles.statCard}><Text style={styles.statLabel}>최근 상의</Text><Text style={styles.statValue}>{records[0]?.metrics?.top || '-'}</Text></View>
          <View style={[styles.statCard, { marginRight: 0 }]}><Text style={styles.statLabel}>최근 하의</Text><Text style={styles.statValue}>{records[0]?.metrics?.bottom || '-'}</Text></View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>빠른 이동</Text>
          <View style={styles.quickRow}>
            <Pressable style={styles.quickButton} onPress={() => router.push('/history')}><Text style={styles.quickButtonText}>날짜별 기록</Text></Pressable>
            <Pressable style={styles.quickButton} onPress={() => router.push('/search')}><Text style={styles.quickButtonText}>검색</Text></Pressable>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>최근 치수 요약</Text>
          <Text style={styles.meta}>키 {records[0]?.metrics?.height || '-'}cm · 어깨 {records[0]?.metrics?.shoulder || '-'}cm · 가슴 {records[0]?.metrics?.chest || '-'}cm · 허리 {records[0]?.metrics?.waist || '-'}cm</Text>
          <Text style={styles.meta}>핏 {records[0]?.fit || '-'} · 착장 부피감 {records[0]?.bulk || '-'}</Text>
        </View>

        {user ? (
          <Pressable style={styles.logoutBtn} onPress={logout}><Text style={styles.logoutText}>로그아웃</Text></Pressable>
        ) : null}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 22, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, padding: 16, marginBottom: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: COLORS.primary, fontWeight: '900', fontSize: 22 },
  name: { color: COLORS.text, fontWeight: '900', fontSize: 18 },
  email: { color: COLORS.subtext, fontWeight: '700', marginTop: 5 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#FFFFFF' },
  editBtnText: { color: COLORS.text, fontWeight: '800' },
  statRow: { flexDirection: 'row', marginBottom: 14 },
  statCard: { flex: 1, marginRight: 8, borderRadius: 18, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, padding: 12 },
  statLabel: { color: COLORS.subtext, fontWeight: '700', fontSize: 12 },
  statValue: { color: COLORS.text, fontWeight: '900', fontSize: 22, marginTop: 8 },
  sectionCard: { borderRadius: 20, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, padding: 16, marginBottom: 14 },
  sectionTitle: { color: COLORS.text, fontWeight: '900', fontSize: 16, marginBottom: 10 },
  quickRow: { flexDirection: 'row' },
  quickButton: { flex: 1, marginRight: 8, height: 46, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  quickButtonText: { color: 'white', fontWeight: '900' },
  meta: { color: COLORS.subtext, lineHeight: 20, fontWeight: '700', marginBottom: 4 },
  logoutBtn: { height: 52, borderRadius: 16, borderWidth: 1, borderColor: '#F4C8C8', backgroundColor: '#FFF3F3', alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: COLORS.danger, fontWeight: '900' },
});
