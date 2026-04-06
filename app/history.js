import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell } from '../components/AppShell';
import {
  buildHistorySeries,
  COLORS,
  getSavedMeasurements,
  getSavedUser,
  removeMeasurementRecord,
} from './lib';

function formatDay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildPoints(series, width, height, pad) {
  const values = series.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const points = series.map((item, index) => {
    const x =
      series.length === 1
        ? width / 2
        : pad + (index * (width - pad * 2)) / Math.max(series.length - 1, 1);

    const y =
      series.length === 1
        ? height / 2
        : height - pad - ((item.value - min) / range) * (height - pad * 2);

    return { ...item, x, y };
  });

  return { points, min, max };
}

function LineChart({ title, series, unit = 'cm' }) {
  const width = 292;
  const height = 170;
  const pad = 20;
  const thickness = 4;

  if (!series.length) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>저장된 기록이 아직 없어요.</Text>
      </View>
    );
  }

  const { points, min, max } = buildPoints(series, width, height, pad);

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartHead}>
        <Text style={styles.chartTitle}>{title}</Text>
        <Text style={styles.chartRange}>
          {min.toFixed(1)}~{max.toFixed(1)}
          {unit}
        </Text>
      </View>

      <View style={[styles.chartBox, { width, height }]}>
        <View style={styles.gridVerticalLeft} />
        <View style={styles.gridVerticalRight} />

        {points.map((point, index) => {
          const prev = points[index - 1];
          if (!prev) return null;

          const dx = point.x - prev.x;
          const dy = point.y - prev.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = `${Math.atan2(dy, dx)}rad`;

          const midX = (prev.x + point.x) / 2;
          const midY = (prev.y + point.y) / 2;

          return (
            <View
              key={`line-${point.id}`}
              style={[
                styles.chartLine,
                {
                  width: length,
                  height: thickness,
                  left: midX - length / 2,
                  top: midY - thickness / 2,
                  transform: [{ rotate: angle }],
                },
              ]}
            />
          );
        })}

        {points.map((point, index) => {
          const showLabelAbove = index === points.length - 1;
          return (
            <View
              key={point.id}
              style={[
                styles.chartPointWrap,
                {
                  left: point.x - 13,
                  top: point.y - (showLabelAbove ? 28 : 6),
                },
              ]}
            >
              {showLabelAbove ? (
                <Text style={styles.chartValueTop}>{point.value.toFixed(1)}</Text>
              ) : null}
              <View style={styles.chartPoint} />
              {!showLabelAbove ? (
                <Text style={styles.chartValueBottom}>{point.value.toFixed(1)}</Text>
              ) : null}
            </View>
          );
        })}
      </View>

      <View style={styles.chartDateRow}>
        {points.length === 1 ? (
          <Text style={styles.chartDate}>{formatDay(points[0].createdAt)}</Text>
        ) : (
          <>
            <Text style={styles.chartDate}>{formatDay(points[0].createdAt)}</Text>
            <Text style={styles.chartDate}>{formatDay(points[points.length - 1].createdAt)}</Text>
          </>
        )}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('전체');

  const load = async () => {
    const [savedUser, savedRecords] = await Promise.all([
      getSavedUser(),
      getSavedMeasurements(),
    ]);
    setUser(savedUser);
    setRecords(savedRecords);
  };

  useEffect(() => {
    load();
  }, []);

  const uniqueDays = useMemo(
    () => ['전체', ...Array.from(new Set(records.map((item) => formatDay(item.createdAt))))],
    [records]
  );

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const byDay = selectedDay === '전체' || formatDay(item.createdAt) === selectedDay;
      const hay =
        `${item.metrics?.top || ''} ${item.metrics?.bottom || ''} ${item.fit || ''} ${item.bulk || ''} ` +
        `${item.metrics?.height || ''} ${item.metrics?.shoulder || ''} ${item.metrics?.chest || ''} ${formatDay(item.createdAt)}`
          .toLowerCase();
      const byQuery = !query.trim() || hay.includes(query.trim().toLowerCase());
      return byDay && byQuery;
    });
  }, [records, selectedDay, query]);

  const grouped = useMemo(() => {
    const map = new Map();
    filteredRecords.forEach((item) => {
      const key = formatDay(item.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return Array.from(map.entries());
  }, [filteredRecords]);

  const heightSeries = useMemo(
    () => buildHistorySeries(filteredRecords, 'height'),
    [filteredRecords]
  );
  const shoulderSeries = useMemo(
    () => buildHistorySeries(filteredRecords, 'shoulder'),
    [filteredRecords]
  );
  const chestSeries = useMemo(
    () => buildHistorySeries(filteredRecords, 'chest'),
    [filteredRecords]
  );

  return (
    <AppShell
      title="기록 관리"
      subtitle="날짜별 기록 확인, 검색, 그래프를 한 화면에 정리했습니다. 아래 날짜 바를 눌러 특정 날짜만 빠르게 볼 수 있습니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 14 }}>
        <View style={styles.topRow}>
          <View style={styles.profileCard}>
            <Text style={styles.profileTitle}>
              {user ? `${user.name}님의 치수 히스토리` : '로그인 후 기록 확인'}
            </Text>
            <Text style={styles.profileSub}>
              {user
                ? user.email
                : '로그인 후 측정 결과를 저장하면 날짜별 기록이 자동 정리됩니다.'}
            </Text>
          </View>

          <View style={styles.miniStat}>
            <Text style={styles.miniLabel}>저장</Text>
            <Text style={styles.miniValue}>{records.length}</Text>
          </View>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="날짜, 사이즈, 핏, 착장 부피감 검색"
          placeholderTextColor="#99A5C7"
          style={styles.searchInput}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 4, marginBottom: 12 }}
        >
          {uniqueDays.map((day) => {
            const active = selectedDay === day;
            return (
              <Pressable
                key={day}
                style={[styles.dayChip, active && styles.dayChipActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <LineChart title="예상 키 변화" series={heightSeries} />
        <LineChart title="어깨너비 변화" series={shoulderSeries} />
        <LineChart title="가슴둘레 변화" series={chestSeries} />

        <Text style={styles.sectionTitle}>날짜별 상세 기록</Text>

        {!filteredRecords.length ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>조건에 맞는 기록이 없습니다.</Text>
          </View>
        ) : (
          grouped.map(([day, items]) => (
            <View key={day} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day}</Text>
                <Text style={styles.dayCount}>{items.length}건</Text>
              </View>

              {items.map((item) => (
                <View key={item.id} style={styles.recordCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recordTitle}>{formatTime(item.createdAt)}</Text>
                    <Text style={styles.recordMeta}>
                      키 {item.metrics.height}cm · 어깨 {item.metrics.shoulder}cm · 가슴 {item.metrics.chest}cm
                    </Text>
                    <Text style={styles.recordMeta}>
                      상의 {item.metrics.top} · 하의 {item.metrics.bottom} · {item.fit} · {item.bulk}
                    </Text>
                  </View>

                  <Pressable style={styles.smallButton} onPress={() => router.push('/result')}>
                    <Text style={styles.smallButtonText}>보기</Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteChip}
                    onPress={async () => {
                      await removeMeasurementRecord(item.id);
                      load();
                    }}
                  >
                    <Text style={styles.deleteChipText}>삭제</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  profileCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 16,
    marginRight: 10,
  },
  profileTitle: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 17,
  },
  profileSub: {
    color: COLORS.subtext,
    marginTop: 6,
    lineHeight: 19,
    fontWeight: '700',
  },
  miniStat: {
    width: 86,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  miniLabel: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: '800',
  },
  miniValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  searchInput: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#F7FAFF',
    paddingHorizontal: 16,
    color: COLORS.text,
    fontWeight: '700',
    marginBottom: 12,
  },
  dayChip: {
    marginRight: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  dayChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayChipText: {
    color: COLORS.text,
    fontWeight: '800',
  },
  dayChipTextActive: {
    color: 'white',
  },
  chartWrap: {
    borderRadius: 20,
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 14,
    marginBottom: 14,
  },
  chartHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 16,
  },
  chartRange: {
    color: COLORS.subtext,
    fontWeight: '800',
    fontSize: 12,
  },
  chartBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignSelf: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  gridVerticalLeft: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#E8EDF8',
  },
  gridVerticalRight: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#E8EDF8',
  },
  chartLine: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    borderRadius: 999,
  },
  chartPointWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartPoint: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.mint,
    borderWidth: 2,
    borderColor: 'white',
  },
  chartValueTop: {
    marginBottom: 4,
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },
  chartValueBottom: {
    marginTop: 2,
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
  },
  chartDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartDate: {
    color: COLORS.subtext,
    fontSize: 10.5,
    fontWeight: '700',
  },
  sectionTitle: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 10,
  },
  daySection: {
    marginBottom: 14,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 16,
  },
  dayCount: {
    color: COLORS.subtext,
    fontWeight: '800',
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#F8FAFF',
    padding: 14,
    marginBottom: 10,
  },
  recordTitle: {
    color: COLORS.text,
    fontWeight: '900',
  },
  recordMeta: {
    color: COLORS.subtext,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '700',
  },
  smallButton: {
    marginLeft: 10,
    backgroundColor: '#E8EEFF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallButtonText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 12,
  },
  deleteChip: {
    marginLeft: 8,
    backgroundColor: '#FFEAEA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteChipText: {
    color: COLORS.danger,
    fontWeight: '900',
    fontSize: 12,
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: '#F8FAFF',
    padding: 20,
    marginBottom: 14,
  },
  emptyText: {
    color: COLORS.subtext,
    textAlign: 'center',
    fontWeight: '700',
  },
});