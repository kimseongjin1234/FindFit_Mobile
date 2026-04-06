import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell } from '../components/AppShell';
import { buildMetrics, buildProducts, COLORS, getSavedMeasurements } from './lib';

export default function SearchScreen() {
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('상품');

  useEffect(() => {
    getSavedMeasurements().then(setRecords);
  }, []);

  const latest = records[0];
  const products = useMemo(() => {
    const metrics = latest?.metrics || buildMetrics('7.1', '정핏', '보통', '');
    return buildProducts(metrics, latest?.fit || '정핏', latest?.bulk || '보통');
  }, [latest]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => (`${item.mall} ${item.name} ${item.category} ${item.color} ${item.fit}`).toLowerCase().includes(query.trim().toLowerCase()));
  }, [products, query]);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => (`${item.fit} ${item.bulk} ${item.metrics?.top} ${item.metrics?.bottom} ${item.metrics?.height}`).toLowerCase().includes(query.trim().toLowerCase()));
  }, [records, query]);

  return (
    <AppShell
      title="검색"
      subtitle="저장된 결과와 추천 의류를 한곳에서 검색할 수 있게 추가했습니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 14 }}>
        <TextInput value={query} onChangeText={setQuery} placeholder="상품명, 사이즈, 핏으로 검색" placeholderTextColor="#99A5C7" style={styles.searchInput} />

        <View style={styles.tabRow}>
          {['상품', '기록'].map((item) => {
            const active = tab === item;
            return <Pressable key={item} style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={() => setTab(item)}><Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{item}</Text></Pressable>;
          })}
        </View>

        {tab === '상품' ? filteredProducts.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={[styles.thumb, { backgroundColor: item.category === '하의' ? '#7A96C0' : item.category === '아우터' ? '#7D8E62' : '#A5C4F6' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.mall}>{item.mall}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category} · {item.color} · {item.fit}</Text>
            </View>
            <View style={styles.sizePill}><Text style={styles.sizeLabel}>추천</Text><Text style={styles.sizeValue}>{item.size}</Text></View>
          </View>
        )) : filteredRecords.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.recordBadge}><Text style={styles.recordBadgeText}>{new Date(item.createdAt).getDate()}일</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>키 {item.metrics.height}cm · 어깨 {item.metrics.shoulder}cm</Text>
              <Text style={styles.meta}>{item.fit} · {item.bulk} · 상의 {item.metrics.top} / 하의 {item.metrics.bottom}</Text>
            </View>
            <Pressable style={styles.moveBtn} onPress={() => router.push('/history')}><Text style={styles.moveBtnText}>이동</Text></Pressable>
          </View>
        ))}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  searchInput: { height: 50, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F7FAFF', paddingHorizontal: 16, color: COLORS.text, fontWeight: '700', marginBottom: 12 },
  tabRow: { flexDirection: 'row', marginBottom: 14 },
  tabBtn: { flex: 1, height: 46, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', marginRight: 8, backgroundColor: '#F7FAFF' },
  tabBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabBtnText: { color: COLORS.text, fontWeight: '900' },
  tabBtnTextActive: { color: 'white' },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', padding: 14, marginBottom: 10 },
  thumb: { width: 58, height: 58, borderRadius: 16, marginRight: 12 },
  mall: { color: COLORS.primary, fontWeight: '800', marginBottom: 4 },
  name: { color: COLORS.text, fontWeight: '900' },
  meta: { color: COLORS.subtext, fontWeight: '700', marginTop: 4 },
  sizePill: { width: 62, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', paddingVertical: 10 },
  sizeLabel: { color: 'rgba(255,255,255,0.78)', fontWeight: '800', fontSize: 11 },
  sizeValue: { color: 'white', fontWeight: '900', fontSize: 26, marginTop: 4 },
  recordBadge: { width: 58, height: 58, borderRadius: 16, backgroundColor: COLORS.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  recordBadgeText: { color: COLORS.primary, fontWeight: '900' },
  moveBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: '#E8EEFF' },
  moveBtnText: { color: COLORS.primary, fontWeight: '900' },
});
