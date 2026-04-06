import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { ANALYSIS_LINES, COLORS } from './lib';

export default function AnalyzingScreen() {
  const params = useLocalSearchParams();
  const fingerCm = typeof params.fingerCm === 'string' ? params.fingerCm : '7.1';
  const bulk = typeof params.bulk === 'string' ? params.bulk : '보통';
  const photoUri = typeof params.photoUri === 'string' ? params.photoUri : '';
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(id);
          return 100;
        }
        return Math.min(100, prev + 7);
      });
    }, 220);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        router.replace({ pathname: '/result', params: { fingerCm, bulk, photoUri } });
      }, 450);
      return () => clearTimeout(t);
    }
  }, [progress, fingerCm, bulk, photoUri]);

  const active = useMemo(
    () => Math.min(ANALYSIS_LINES.length - 1, Math.floor(progress / 22)),
    [progress]
  );

  return (
    <AppShell
      title="AI 분석 진행 중"
      subtitle="전신 윤곽과 관절 포인트를 추정한 뒤 검지 실측값으로 치수를 환산하는 흐름을 보여주는 발표용 프로토타입입니다."
    >
      <StepBadge step="STEP 3" label="관절 인식 및 치수 환산" />

      <View style={styles.viewer}>
        <View style={styles.bodyWrap}>
          <Image
            source={require('../assets/body_guide.png')}
            style={styles.bodyGuideImage}
            resizeMode="contain"
          />

          {POINTS.map((style, idx) => (
            <View key={idx} style={[styles.point, style]} />
          ))}

          {LINES.map((style, idx) => (
            <View key={idx} style={[styles.line, style]} />
          ))}

          <View style={[styles.scanBar, { top: `${Math.max(8, progress * 0.74)}%` }]} />
        </View>
      </View>

      <View style={styles.progressBox}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>분석 진행률</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.progressCaption}>현재 착장 부피감: {bulk}</Text>
      </View>

      <View style={styles.lineList}>
        {ANALYSIS_LINES.map((line, idx) => {
          const done = idx < active;
          const current = idx === active;

          return (
            <View key={line} style={styles.lineRow}>
              <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]} />
              <Text style={[styles.lineText, current && styles.lineTextCurrent]}>{line}</Text>
            </View>
          );
        })}
      </View>

      <Pressable
        style={styles.skipButton}
        onPress={() =>
          router.replace({ pathname: '/result', params: { fingerCm, bulk, photoUri } })
        }
      >
        <Text style={styles.skipText}>바로 결과 보기</Text>
      </Pressable>
    </AppShell>
  );
}

const POINTS = [
  { top: 34, left: 144 },  // 머리
  { top: 94, left: 144 },  // 목/상체
  { top: 126, left: 95 },  // 왼어깨
  { top: 126, left: 194 }, // 오른어깨
  { top: 185, left: 144 }, // 가슴/상체 중심
  { top: 246, left: 144 }, // 허리
  { top: 278, left: 112 }, // 왼엉덩이
  { top: 278, left: 176 }, // 오른엉덩이
  { top: 360, left: 112 }, // 왼무릎
  { top: 360, left: 176 }, // 오른무릎
  { top: 444, left: 108 }, // 왼발
  { top: 444, left: 180 }, // 오른발
];

const LINES = [
  { top: 48, left: 149, width: 2, height: 52 },
  { top: 128, left: 108, width: 78, height: 2 },
  { top: 102, left: 149, width: 2, height: 146 },
  { top: 278, left: 118, width: 52, height: 2 },
  { top: 278, left: 118, width: 2, height: 84 },
  { top: 278, left: 170, width: 2, height: 84 },
  { top: 444, left: 116, width: 58, height: 2 },
];

const styles = StyleSheet.create({
  viewer: {
    height: 360,
    borderRadius: 24,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bodyWrap: {
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
  },
  line: {
    position: 'absolute',
    backgroundColor: 'rgba(59,100,230,0.45)',
    borderRadius: 999,
  },
  scanBar: {
    position: 'absolute',
    left: 26,
    right: 26,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  progressBox: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: COLORS.soft,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    color: COLORS.text,
    fontWeight: '800',
  },
  progressValue: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#DCE4FA',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  progressCaption: {
    marginTop: 8,
    color: COLORS.subtext,
    fontWeight: '700',
  },
  lineList: {
    marginTop: 16,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5F3',
    marginRight: 10,
  },
  dotDone: {
    backgroundColor: COLORS.success,
  },
  dotCurrent: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  lineText: {
    color: COLORS.subtext,
    fontWeight: '700',
  },
  lineTextCurrent: {
    color: COLORS.text,
  },
  skipButton: {
    marginTop: 'auto',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: COLORS.text,
    fontWeight: '800',
  },
});