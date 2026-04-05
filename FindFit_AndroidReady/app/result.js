import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { buildMetrics, buildProducts, COLORS, KEYPOINTS, SEGMENTS } from './lib';

function ProductThumb({ category }) {
  const bg = category === '하의' ? '#6F92C0' : category === '아우터' ? '#73845B' : '#AAC8F6';
  return <View style={[styles.thumb, { backgroundColor: bg }]} />;
}

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const fingerCm = typeof params.fingerCm === 'string' ? params.fingerCm : '7.1';
  const fit = typeof params.fit === 'string' ? params.fit : '정핏';
  const photoUri = typeof params.photoUri === 'string' ? params.photoUri : '';

  const metrics = useMemo(() => buildMetrics(fingerCm, fit, photoUri), [fingerCm, fit, photoUri]);
  const products = useMemo(() => buildProducts(metrics, fit), [metrics, fit]);

  return (
    <AppShell
      title="AI 분석 결과"
      subtitle="실측 검지 길이와 업로드 이미지를 바탕으로 몸 구조를 분석한 듯한 화면과, 의류 사이트 매칭 결과처럼 보이는 추천 리스트를 보여줍니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
        <StepBadge step="STEP 4" label="치수 결과 및 의류 매칭" />

        <View style={styles.heroCard}>
          {photoUri ? <Image source={{ uri: photoUri }} style={styles.heroImage} resizeMode="cover" /> : <View style={styles.heroFallback} />}
          <View style={styles.overlayDim} />
          <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI BODY ANALYSIS</Text></View>
          {KEYPOINTS.map((p, i) => <View key={i} style={[styles.keypoint, p]} />)}
          {SEGMENTS.map((s, i) => <View key={i} style={[styles.segment, s]} />)}
          <View style={[styles.measurePill, { top: '27%', left: '9%' }]}><Text style={styles.measurePillText}>어깨 {metrics.shoulder}cm</Text></View>
          <View style={[styles.measurePill, { top: '46%', right: '7%' }]}><Text style={styles.measurePillText}>가슴 {metrics.chest}cm</Text></View>
          <View style={[styles.measurePill, { top: '66%', left: '10%' }]}><Text style={styles.measurePillText}>허리 {metrics.waist}cm</Text></View>
          <View style={[styles.measurePill, { bottom: '12%', right: '8%' }]}><Text style={styles.measurePillText}>인심 {metrics.inseam}cm</Text></View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>추천 상의</Text><Text style={styles.summaryValue}>{metrics.top}</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>추천 하의</Text><Text style={styles.summaryValue}>{metrics.bottom}</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>매칭 점수</Text><Text style={styles.summaryValue}>{metrics.match}%</Text></View>
        </View>

        <View style={styles.metricBox}>
          {[
            ['예상 키', `${metrics.height} cm`],
            ['어깨너비', `${metrics.shoulder} cm`],
            ['가슴둘레', `${metrics.chest} cm`],
            ['허리둘레', `${metrics.waist} cm`],
            ['엉덩이둘레', `${metrics.hip} cm`],
            ['소매길이', `${metrics.sleeve} cm`],
            ['인심', `${metrics.inseam} cm`],
            ['분석 신뢰도', `${metrics.confidence}%`]
          ].map(([label, value], idx, arr) => (
            <View key={label} style={[styles.metricRow, idx === arr.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.metricLabel}>{label}</Text>
              <Text style={styles.metricValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.matchHeader}>
          <Text style={styles.sectionTitle}>의류 DB 매칭</Text>
          <View style={styles.matchScore}><Text style={styles.matchScoreText}>{fit} 기준 추천</Text></View>
        </View>
        <Text style={styles.matchCaption}>실제 쇼핑몰 연동 전 단계 데모이므로 고정 데이터이지만, 심사 화면에서는 쇼핑몰에서 추천을 받아온 듯한 방식으로 보이게 구성했습니다.</Text>

        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <ProductThumb category={item.category} />
            <View style={{ flex: 1 }}>
              <Text style={styles.mallText}>{item.mall}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productMeta}>{item.category} · {item.color} · {item.fit}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
            <View style={styles.sizeBlock}>
              <Text style={styles.sizeBlockLabel}>추천</Text>
              <Text style={styles.sizeBlockValue}>{item.size}</Text>
              <Text style={styles.sizeBlockScore}>{Math.round(item.score)}%</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomRow}>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.secondaryButtonText}>처음부터 다시</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>이전 화면</Text>
        </Pressable>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  heroCard: { height: 420, borderRadius: 24, overflow: 'hidden', marginBottom: 14, backgroundColor: '#DCE5FB' },
  heroImage: { width: '100%', height: '100%' },
  heroFallback: { flex: 1, backgroundColor: '#DCE5FB' },
  overlayDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(16,32,72,0.16)' },
  aiBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(16,32,72,0.82)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  aiBadgeText: { color: 'white', fontWeight: '900', fontSize: 11 },
  keypoint: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.mint, borderWidth: 2, borderColor: 'white' },
  segment: { position: 'absolute', backgroundColor: 'rgba(103,201,175,0.9)', borderRadius: 999 },
  measurePill: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  measurePillText: { color: COLORS.dark, fontWeight: '800', fontSize: 11 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  summaryCard: { flex: 1, marginRight: 8, backgroundColor: COLORS.soft, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 12 },
  summaryLabel: { color: COLORS.subtext, fontSize: 12, fontWeight: '700' },
  summaryValue: { marginTop: 8, color: COLORS.text, fontWeight: '900', fontSize: 22 },
  metricBox: { backgroundColor: '#F8FAFF', borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, padding: 14, marginBottom: 14 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  metricLabel: { color: COLORS.subtext, fontWeight: '700', fontSize: 14 },
  metricValue: { color: COLORS.text, fontWeight: '900', fontSize: 18 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: COLORS.text, fontWeight: '900', fontSize: 18 },
  matchScore: { backgroundColor: COLORS.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  matchScoreText: { color: COLORS.primary, fontWeight: '800', fontSize: 12 },
  matchCaption: { color: COLORS.subtext, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 12 },
  productCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFF', borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 12, marginBottom: 10 },
  thumb: { width: 54, height: 72, borderRadius: 14, marginRight: 12 },
  mallText: { color: COLORS.primary, fontWeight: '800', fontSize: 11.5 },
  productName: { color: COLORS.text, fontWeight: '900', fontSize: 16, marginTop: 4 },
  productMeta: { color: COLORS.subtext, fontSize: 12, marginTop: 4 },
  productPrice: { color: COLORS.text, fontWeight: '800', fontSize: 13, marginTop: 6 },
  sizeBlock: { width: 72, borderRadius: 14, backgroundColor: COLORS.primary, paddingVertical: 10, alignItems: 'center' },
  sizeBlockLabel: { color: 'rgba(255,255,255,0.74)', fontSize: 11, fontWeight: '700' },
  sizeBlockValue: { color: 'white', fontWeight: '900', fontSize: 24, marginTop: 2 },
  sizeBlockScore: { color: 'rgba(255,255,255,0.9)', fontWeight: '800', fontSize: 11, marginTop: 2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  secondaryButton: { flex: 1, height: 54, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  secondaryButtonText: { color: COLORS.text, fontWeight: '800' },
  primaryButton: { flex: 1, height: 54, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: 'white', fontWeight: '900' }
});
