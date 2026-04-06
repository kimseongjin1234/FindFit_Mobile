import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import {
  COLORS,
  FIT_OPTIONS,
  buildMeasurements,
  buildRecommendations,
  getTodayLabel,
  saveMeasurementRecord,
} from './lib';

const BODY_POINTS = {
  머리: { top: 34, left: 144 },
  어깨: { top: 124, left: 95 },
  '오른어깨': { top: 124, left: 194 },
  가슴: { top: 176, left: 144 },
  허리: { top: 238, left: 144 },
  엉덩이둘레: { top: 278, left: 144 },
  소매: { top: 168, left: 212 },
  무릎: { top: 360, left: 176 },
  다리: { top: 416, left: 176 },
  발: { top: 448, left: 180 },
};

const BODY_LINES = {
  머리: [{ top: 48, left: 148, width: 2, height: 45 }],
  어깨: [{ top: 126, left: 108, width: 80, height: 2 }],
  가슴: [{ top: 176, left: 112, width: 72, height: 2 }],
  허리: [{ top: 238, left: 120, width: 56, height: 2 }],
  엉덩이둘레: [{ top: 278, left: 114, width: 66, height: 2 }],
  소매: [
    { top: 128, left: 186, width: 2, height: 24 },
    { top: 150, left: 186, width: 34, height: 2 },
    { top: 150, left: 218, width: 2, height: 38 },
  ],
  무릎: [{ top: 360, left: 156, width: 44, height: 2 }],
  다리: [{ top: 278, left: 170, width: 2, height: 140 }],
  발: [{ top: 448, left: 156, width: 48, height: 2 }],
};

function BodyPreview({ activeKey }) {
  const points = useMemo(() => {
    return Object.entries(BODY_POINTS).map(([key, pos]) => {
      const active =
        key === activeKey ||
        (activeKey === '어깨' && key === '오른어깨');

      return (
        <View
          key={key}
          style={[
            styles.point,
            pos,
            active && styles.pointActive,
          ]}
        />
      );
    });
  }, [activeKey]);

  const lines = useMemo(() => {
    const rows = BODY_LINES[activeKey] || [];
    return rows.map((line, idx) => (
      <View key={`${activeKey}-${idx}`} style={[styles.measureLine, line]} />
    ));
  }, [activeKey]);

  return (
    <View style={styles.figureCard}>
      <View style={styles.figureWrap}>
        <Image
          source={require('../assets/body_guide.png')}
          style={styles.bodyGuideImage}
          resizeMode="contain"
        />
        {points}
        {lines}
      </View>
    </View>
  );
}

function MiniChart({ rows }) {
  const values = rows.map((r) => r.value);
  const max = Math.max(...values, 1);

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>내 치수 요약 그래프</Text>
      {rows.slice(0, 4).map((row) => {
        const width = `${Math.max(18, (row.value / max) * 100)}%`;
        return (
          <View key={row.key} style={styles.chartRow}>
            <Text style={styles.chartLabel}>{row.label}</Text>
            <View style={styles.chartTrack}>
              <View style={[styles.chartFill, { width }]} />
            </View>
            <Text style={styles.chartValue}>{row.display}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const fingerCm = typeof params.fingerCm === 'string' ? Number(params.fingerCm) : 7.1;
  const bulk = typeof params.bulk === 'string' ? params.bulk : '보통';
  const photoUri = typeof params.photoUri === 'string' ? params.photoUri : '';

  const [fit, setFit] = useState('정핏');
  const [activeKey, setActiveKey] = useState('어깨');
  const [saving, setSaving] = useState(false);

  const measurements = useMemo(() => buildMeasurements(fingerCm, bulk), [fingerCm, bulk]);
  const recommendations = useMemo(
    () => buildRecommendations({ fit, bulk, measurements }),
    [fit, bulk, measurements]
  );

  const saveResult = async () => {
    try {
      setSaving(true);
      await saveMeasurementRecord({
        date: getTodayLabel(),
        fit,
        bulk,
        photoUri,
        measurements,
      });
      Alert.alert('저장 완료', '측정 결과가 내 기록에 저장되었습니다.');
    } catch (e) {
      Alert.alert('저장 실패', '결과 저장 중 문제가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const footer = (
    <Pressable style={styles.footerButton} onPress={() => router.replace('/history')}>
      <Text style={styles.footerButtonText}>내 기록 보러 가기</Text>
    </Pressable>
  );

  return (
    <AppShell
      title="치수 결과 및 의류 매칭"
      subtitle="손가락 실측값과 전신 윤곽 분석을 바탕으로 주요 치수를 환산하고 선호 핏에 맞는 의류 매칭 예시를 보여줍니다."
      footer={footer}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <StepBadge step="STEP 4" label="치수 결과 및 추천 의류 확인" />

        <BodyPreview activeKey={activeKey} />

        <View style={styles.cardGrid}>
          {measurements.map((item) => (
            <Pressable
              key={item.key}
              style={[styles.metricCard, activeKey === item.label && styles.metricCardActive]}
              onPress={() => setActiveKey(item.label)}
            >
              <Text style={styles.metricLabel}>{item.label}</Text>
              <Text style={styles.metricValue}>{item.display}</Text>
            </Pressable>
          ))}
        </View>

        <MiniChart rows={measurements} />

        <View style={styles.filterCard}>
          <Text style={styles.sectionTitle}>선호 핏 선택</Text>
          <View style={styles.fitRow}>
            {FIT_OPTIONS.map((item) => {
              const selected = fit === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.fitChip, selected && styles.fitChipSelected]}
                  onPress={() => setFit(item)}
                >
                  <Text style={[styles.fitChipText, selected && styles.fitChipTextSelected]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>현재 착장 부피감</Text>
            <Text style={styles.infoValue}>{bulk}</Text>
          </View>
        </View>

        <View style={styles.recCard}>
          <Text style={styles.sectionTitle}>의류 DB 매칭 추천</Text>
          {recommendations.map((item) => (
            <View key={item.id} style={styles.recItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.recBrand}>{item.brand}</Text>
                <Text style={styles.recName}>{item.name}</Text>
                <Text style={styles.recMeta}>
                  추천 사이즈 {item.size} · {fit} 기준
                </Text>
                <Text style={styles.recDesc}>{item.reason}</Text>
              </View>
              <View style={styles.sizeBadge}>
                <Text style={styles.sizeBadgeText}>{item.size}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.saveButton} onPress={saveResult} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? '저장 중...' : '결과 저장하기'}</Text>
        </Pressable>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  figureCard: {
    borderRadius: 24,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 14,
    overflow: 'hidden',
  },
  figureWrap: {
    width: 300,
    height: 500,
    position: 'relative',
    alignItems: 'center',
  },
  bodyGuideImage: {
    width: 240,
    height: 470,
    marginTop: 8,
  },
  point: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.mint,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    opacity: 0.9,
  },
  pointActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  measureLine: {
    position: 'absolute',
    backgroundColor: 'rgba(59,100,230,0.45)',
    borderRadius: 999,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricCard: {
    width: '48.5%',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  metricCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  metricLabel: {
    color: COLORS.subtext,
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 4,
  },
  metricValue: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 18,
  },
  chartCard: {
    borderRadius: 20,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 14,
  },
  chartTitle: {
    color: COLORS.text,
    fontWeight: '900',
    marginBottom: 10,
    fontSize: 15,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartLabel: {
    width: 44,
    color: COLORS.subtext,
    fontWeight: '700',
    fontSize: 12.5,
  },
  chartTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#DCE4FA',
    borderRadius: 999,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  chartFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  chartValue: {
    width: 58,
    textAlign: 'right',
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 12.5,
  },
  filterCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 10,
  },
  fitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fitChip: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  fitChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  fitChipText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 13.5,
  },
  fitChipTextSelected: {
    color: '#FFFFFF',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: COLORS.subtext,
    fontWeight: '700',
  },
  infoValue: {
    color: COLORS.text,
    fontWeight: '900',
  },
  recCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 14,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    backgroundColor: '#F8FAFF',
    padding: 12,
    marginBottom: 10,
  },
  recBrand: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 12.5,
    marginBottom: 3,
  },
  recName: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 15.5,
    marginBottom: 4,
  },
  recMeta: {
    color: COLORS.subtext,
    fontWeight: '700',
    fontSize: 12.5,
    marginBottom: 6,
  },
  recDesc: {
    color: COLORS.subtext,
    fontWeight: '700',
    lineHeight: 18,
    fontSize: 12.5,
  },
  sizeBadge: {
    marginLeft: 10,
    minWidth: 54,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  sizeBadgeText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 15,
  },
  saveButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  footerButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonText: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 15,
  },
});