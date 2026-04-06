import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { PixelRatio } from 'react-native';

export const COLORS = {
  primary: '#4667E8',
  primarySoft: '#E8EEFF',
  mint: '#69CDB7',
  soft: '#F7FAFF',
  line: '#D9E2F2',
  text: '#1D2B64',
  subtext: '#6E7A9A',
  success: '#59C59A',
  danger: '#E85C5C',
};

export const FIT_OPTIONS = ['슬림핏', '정핏', '세미오버'];
export const BULK_OPTIONS = ['타이트', '보통', '루즈'];

export const ANALYSIS_LINES = [
  '전신 윤곽을 정렬하는 중',
  '관절 포인트를 인식하는 중',
  '검지 실측 기준으로 비율을 환산하는 중',
  '상의/하의 치수를 추정하는 중',
  '추천 의류 DB와 비교하는 중',
];

const STORAGE_KEYS = {
  user: '@findfit_user',
  records: '@findfit_records',
};

const DEFAULT_API_BASE = 'https://body-measure-rcky.onrender.com';

export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  Constants.expoConfig?.extra?.apiBaseUrl ||
  DEFAULT_API_BASE;

export function getPixelsPerCm() {
  const dpi = PixelRatio.get() * 160;
  return dpi / 2.54;
}
export function getDpPerCm() {
  return getPixelsPerCm();
}
export function getTodayLabel() {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function getSavedUser() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveUser(user) {
  await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

export async function clearSavedUser() {
  await AsyncStorage.removeItem(STORAGE_KEYS.user);
}

export async function getSavedMeasurements() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.records);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveMeasurementRecord(record) {
  const prev = await getSavedMeasurements();
  const next = [
    {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...record,
    },
    ...prev,
  ];
  await AsyncStorage.setItem(STORAGE_KEYS.records, JSON.stringify(next));
  return next;
}

export async function removeMeasurementRecord(id) {
  const prev = await getSavedMeasurements();
  const next = prev.filter((item) => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.records, JSON.stringify(next));
  return next;
}

function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}

function round1(v) {
  return Math.round(v * 10) / 10;
}

function getBulkOffset(bulk) {
  if (bulk === '타이트') return -1.2;
  if (bulk === '루즈') return 1.8;
  return 0;
}

export function buildMeasurements(fingerCm = 7.1, bulk = '보통') {
  const finger = Number(fingerCm) || 7.1;
  const bulkOffset = getBulkOffset(bulk);

  const height = round1(clamp(finger * 24.6 + bulkOffset * 1.4, 155, 191));
  const shoulder = round1(clamp(finger * 6.4 + bulkOffset * 0.4, 39, 52));
  const chest = round1(clamp(finger * 13.9 + bulkOffset * 1.1, 82, 120));
  const waist = round1(clamp(finger * 11.7 + bulkOffset * 1.0, 68, 108));
  const hip = round1(clamp(finger * 13.2 + bulkOffset * 1.1, 84, 122));
  const sleeve = round1(clamp(finger * 8.4 + bulkOffset * 0.2, 52, 68));
  const knee = round1(clamp(finger * 5.2 + bulkOffset * 0.2, 31, 47));
  const leg = round1(clamp(finger * 15.9 + bulkOffset * 0.6, 92, 122));
  const foot = round1(clamp(finger * 3.7 + bulkOffset * 0.1, 22, 31));
  const head = round1(clamp(finger * 7.8 + bulkOffset * 0.2, 52, 63));

  const top =
    chest < 92 ? 'S' : chest < 100 ? 'M' : chest < 108 ? 'L' : chest < 116 ? 'XL' : '2XL';

  const bottom =
    waist < 76 ? '28' : waist < 82 ? '30' : waist < 88 ? '32' : waist < 94 ? '34' : '36';

  return [
    { key: 'height', label: '키', value: height, display: `${height}cm` },
    { key: 'shoulder', label: '어깨', value: shoulder, display: `${shoulder}cm` },
    { key: 'chest', label: '가슴', value: chest, display: `${chest}cm` },
    { key: 'waist', label: '허리', value: waist, display: `${waist}cm` },
    { key: 'hip', label: '엉덩이둘레', value: hip, display: `${hip}cm` },
    { key: 'sleeve', label: '소매', value: sleeve, display: `${sleeve}cm` },
    { key: 'knee', label: '무릎', value: knee, display: `${knee}cm` },
    { key: 'leg', label: '다리', value: leg, display: `${leg}cm` },
    { key: 'foot', label: '발', value: `${foot}cm`, display: `${foot}cm` },
    { key: 'head', label: '머리', value: head, display: `${head}cm` },
    { key: 'top', label: '상의', value: top, display: top },
    { key: 'bottom', label: '하의', value: bottom, display: bottom },
  ];
}

export function buildRecommendations({ fit = '정핏', bulk = '보통', measurements = [] }) {
  const chest = Number(measurements.find((m) => m.key === 'chest')?.value || 98);
  const waist = Number(measurements.find((m) => m.key === 'waist')?.value || 82);

  const topSize =
    fit === '슬림핏'
      ? chest < 94 ? 'S' : chest < 102 ? 'M' : chest < 110 ? 'L' : 'XL'
      : fit === '세미오버'
      ? chest < 90 ? 'M' : chest < 100 ? 'L' : chest < 110 ? 'XL' : '2XL'
      : chest < 92 ? 'S' : chest < 100 ? 'M' : chest < 108 ? 'L' : 'XL';

  const bottomSize =
    waist < 76 ? '28' : waist < 82 ? '30' : waist < 88 ? '32' : waist < 94 ? '34' : '36';

  return [
    {
      id: 'rec_1',
      brand: 'StyleHub',
      name: '에센셜 옥스포드 셔츠',
      size: topSize,
      reason: `${fit} 기준으로 가슴둘레와 어깨 추정치에 가장 무난하게 맞는 상의입니다.`,
    },
    {
      id: 'rec_2',
      brand: 'Mono Select',
      name: '라이트 블루종 재킷',
      size: fit === '세미오버' ? topSize === 'S' ? 'M' : topSize : topSize,
      reason: `${bulk} 착장 상태를 감안했을 때 겉옷 레이어링에 적합한 추천입니다.`,
    },
    {
      id: 'rec_3',
      brand: 'Daily Pants',
      name: '테이퍼드 데님 팬츠',
      size: bottomSize,
      reason: `허리 추정치와 하의 기준 사이즈를 반영한 추천입니다.`,
    },
  ];
}

export function buildHistorySeries(records = [], metricKey = 'height') {
  return [...records]
    .slice()
    .reverse()
    .map((item) => {
      let value = null;

      if (Array.isArray(item.measurements)) {
        const found = item.measurements.find((m) => m.key === metricKey);
        value = found?.value;
      }

      if (
        value == null &&
        item.metrics &&
        Object.prototype.hasOwnProperty.call(item.metrics, metricKey)
      ) {
        value = item.metrics[metricKey];
      }

      value = Number(value);

      if (Number.isNaN(value)) return null;

      return {
        id: item.id,
        value,
        createdAt: item.createdAt,
      };
    })
    .filter(Boolean);
}