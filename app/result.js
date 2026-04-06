import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { buildAnalysisMap, buildMetrics, buildProducts, BULK_OPTIONS, COLORS, FIT_OPTIONS } from './lib';

function ProductThumb({ category }) {
  const bg = category === '하의' ? '#6F92C0' : category === '아우터' ? '#73845B' : '#AAC8F6';
  return <View style={[styles.thumb, { backgroundColor: bg }]} />;
}

function AnalysisFigure({ photoUri, activeMetric, analysisMap }) {
  const current = analysisMap[activeMetric];
  return (
    <View style={styles.heroCard}>
      {photoUri ? <Image source={{ uri: photoUri }} style={styles.heroImage} resizeMode="cover" /> : <View style={styles.heroFallback} />}
      <View style={styles.overlayDim} />
      <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>LIVE BODY MAPPING</Text></View>
      <View style={styles.silhouetteHead} />
      <View style={styles.silhouetteTorso} />
      <View style={[styles.silhouetteArm, { left: '25%', transform: [{ rotate: '8deg' }] }]} />
      <View style={[styles.silhouetteArm, { right: '25%', transform: [{ rotate: '-8deg' }] }]} />
      <View style={[styles.silhouetteLeg, { left: '39%' }]} />
      <View style={[styles.silhouetteLeg, { left: '52%' }]} />

      {Object.values(analysisMap).flatMap((item) => item.points).map((point, idx) => (
        <View key={idx} style={[styles.keypoint, point]} />
      ))}

      <View style={[styles.segment, current.line]} />
      {current.points.map((point, idx) => <View key={idx} style={[styles.activePoint, point]} />)}
      <View style={[styles.measurePill, current.pill]}><Text style={styles.measurePillText}>{current.label}</Text></View>
    </View>
  );
}

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const fingerCm = typeof params.fingerCm === 'string' ? params.fingerCm : '7.1';
  const initialBulk = typeof params.bulk === 'string' ? params.bulk : '보통';
  const photoUri = typeof params.photoUri === 'string' ? params.photoUri : '';

  const [fit, setFit] = useState('정핏');
  const [bulk, setBulk] = useState(initialBulk);
  const [activeMetric, setActiveMetric] = useState('shoulder');

  const metrics = useMemo(() => buildMetrics(fingerCm, fit, bulk, photoUri), [fingerCm, fit, bulk, photoUri]);
  const products = useMemo(() => buildProducts(metrics, fit, bulk), [metrics, fit, bulk]);
  const analysisMap = useMemo(() => buildAnalysisMap(metrics), [metrics]);

  const metricCards = [
    { key: 'shoulder', label: '어깨너비', value: `${metrics.shoulder} cm` },
    { key: 'chest', label: '가슴둘레', value: `${metrics.chest} cm` },
    { key: 'waist', label: '허리둘레', value: `${metrics.waist} cm` },
    { key: 'inseam', label: '인심', value: `${metrics.inseam} cm` }
  ];

  return (
    <AppShell
      title="AI 분석 결과"
      subtitle="선택한 핏과 현재 착장 부피감을 함께 반영해 치수 결과와 의류 DB 매칭을 보여줍니다. 부위를 누르면 분석 도식의 강조 영역도 바뀝니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
        <StepBadge step="STEP 4" label="치수 결과 및 의류 매칭" />

        <AnalysisFigure photoUri={photoUri} activeMetric={activeMetric} analysisMap={analysisMap} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>추천 상의</Text><Text style={styles.summaryValue}>{metrics.top}</Text></View>
          <View style={styles.summaryCard}><Text style={styles.summaryLabel}>추천 하의</Text><Text style={styles.summaryValue}>{metrics.bottom}</Text></View>
          <View style={[styles.summaryCard, { marginRight: 0 }]}><Text style={styles.summaryLabel}>매칭 점수</Text><Text style={styles.summaryValue}>{metrics.match}%</Text></View>
        </View>

        <View style={styles.metricGrid}>
          {metricCards.map((item) => {
            const selected = activeMetric === item.key;
            return (
              <Pressable key={item.key} style={[styles.metricCard, selected && styles.metricCardSelected]} onPress={() => setActiveMetric(item.key)}>
                <Text style={[styles.metricCardLabel, selected && styles.metricCardLabelSelected]}>{item.label}</Text>
                <Text style={[styles.metricCardValue, selected && styles.metricCardValueSelected]}>{item.value}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.metricBox}>
          {[
            ['예상 키', `${metrics.height} cm`],
            ['엉덩이둘레', `${metrics.hip} cm`],
            ['소매길이', `${metrics.sleeve} cm`],
            ['밑위', `${metrics.rise} cm`],
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
          <View style={styles.matchScore}><Text style={styles.matchScoreText}>{fit} · {bulk}</Text></View>
        </View>
        <Text style={styles.matchCaption}>핏과 현재 착장 부피감을 바꿔보면 추천 상품의 설명과 권장 사이즈 흐름이 함께 바뀌도록 구성했습니다.</Text>

        <Text style={styles.filterLabel}>선호 핏</Text>
        <View style={styles.filterRow}>
          {FIT_OPTIONS.map((item) => {
            const selected = fit === item;
            return (
              <Pressable key={item} style={[styles.filterChip, selected && styles.filterChipSelected]} onPress={() => setFit(item)}>
                <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.filterLabel}>현재 착장 부피감</Text>
        <View style={styles.filterRow}>
          {BULK_OPTIONS.map((item) => {
            const selected = bulk === item;
            return (
              <Pressable key={item} style={[styles.filterChip, selected && styles.filterChipSelected]} onPress={() => setBulk(item)}>
                <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        {products.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <ProductThumb category={item.category} />
            <View style={{ flex: 1 }}>
              <Text style={styles.mallText}>{item.mall}</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productMeta}>{item.category} · {item.color} · {item.fit}</Text>
              <Text style={styles.productBulk}>{item.bulk}</Text>
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
  heroCard: { height: 450, borderRadius: 24, overflow: 'hidden', marginBottom: 14, backgroundColor: '#DCE5FB', borderWidth: 1, borderColor: COLORS.line },
  heroImage: { width: '100%', height: '100%' },
  heroFallback: { flex: 1, backgroundColor: '#DCE5FB' },
  overlayDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(16,32,72,0.18)' },
  aiBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(16,32,72,0.82)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  aiBadgeText: { color: 'white', fontWeight: '900', fontSize: 11 },
  silhouetteHead: { position: 'absolute', top: '9%', left: '43%', width: '14%', height: '11%', borderRadius: 999, backgroundColor: 'rgba(62,92,150,0.78)' },
  silhouetteTorso: { position: 'absolute', top: '19%', left: '34%', width: '32%', height: '39%', borderRadius: 40, backgroundColor: 'rgba(62,92,150,0.72)' },
  silhouetteArm: { position: 'absolute', top: '23%', width: '10%', height: '34%', borderRadius: 30, backgroundColor: 'rgba(62,92,150,0.65)' },
  silhouetteLeg: { position: 'absolute', top: '57%', width: '10%', height: '29%', borderRadius: 30, backgroundColor: 'rgba(62,92,150,0.65)' },
  keypoint: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.mint, borderWidth: 2, borderColor: 'white' },
  activePoint: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.mint, borderWidth: 3, borderColor: 'white' },
  segment: { position: 'absolute', backgroundColor: 'rgba(103,201,175,0.95)', borderRadius: 999 },
  measurePill: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  measurePillText: { color: COLORS.dark, fontWeight: '800', fontSize: 12 },
  summaryRow: { flexDirection: 'row', marginBottom: 14 },
  summaryCard: { flex: 1, marginRight: 8, backgroundColor: COLORS.soft, borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 12 },
  summaryLabel: { color: COLORS.subtext, fontSize: 12, fontWeight: '700' },
  summaryValue: { marginTop: 8, color: COLORS.text, fontWeight: '900', fontSize: 22 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  metricCard: { width: '48.5%', borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', padding: 14, marginBottom: 10 },
  metricCardSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  metricCardLabel: { color: COLORS.subtext, fontWeight: '700', fontSize: 12 },
  metricCardLabelSelected: { color: 'rgba(255,255,255,0.82)' },
  metricCardValue: { color: COLORS.text, fontWeight: '900', fontSize: 20, marginTop: 8 },
  metricCardValueSelected: { color: 'white' },
  metricBox: { backgroundColor: '#F8FAFF', borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, padding: 14, marginBottom: 18 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  metricLabel: { color: COLORS.subtext, fontWeight: '700', fontSize: 14 },
  metricValue: { color: COLORS.text, fontWeight: '900', fontSize: 18 },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: COLORS.text, fontWeight: '900', fontSize: 18 },
  matchScore: { backgroundColor: COLORS.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  matchScoreText: { color: COLORS.primary, fontWeight: '800', fontSize: 12 },
  matchCaption: { color: COLORS.subtext, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 12 },
  filterLabel: { color: COLORS.text, fontWeight: '800', fontSize: 15, marginBottom: 8 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterChip: { flex: 1, height: 44, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  filterChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { color: COLORS.text, fontWeight: '800' },
  filterChipTextSelected: { color: 'white' },
  productCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFF', borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, padding: 12, marginBottom: 10 },
  thumb: { width: 54, height: 72, borderRadius: 14, marginRight: 12 },
  mallText: { color: COLORS.primary, fontWeight: '800', fontSize: 11.5 },
  productName: { color: COLORS.text, fontWeight: '900', fontSize: 16, marginTop: 4 },
  productMeta: { color: COLORS.subtext, fontSize: 12, marginTop: 4 },
  productBulk: { color: COLORS.primary, fontSize: 12, fontWeight: '700', marginTop: 4 },
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
