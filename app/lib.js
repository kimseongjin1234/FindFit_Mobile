import Constants from 'expo-constants';
import { PixelRatio } from 'react-native';

export const COLORS = {
  bg: '#EEF3FF',
  card: '#FFFFFF',
  primary: '#3B64E6',
  primarySoft: '#E5ECFF',
  mint: '#67C9AF',
  text: '#1F2D59',
  subtext: '#6B779B',
  line: '#DFE6FA',
  success: '#2FA27D',
  danger: '#D55B5B',
  dark: '#102048',
  soft: '#F7F9FF'
};

export const FIT_OPTIONS = ['슬림핏', '정핏', '세미오버'];
export const BULK_OPTIONS = ['타이트', '보통', '볼륨감'];

function seedFromString(input) {
  return Array.from(input || 'demo').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 31;
}

export function getPixelsPerCm() {
  const scale = PixelRatio.get();
  const densityDpi = 160 * scale;
  return densityDpi / 2.54;
}

export function getDpPerCm() {
  return getPixelsPerCm() / PixelRatio.get();
}

export function formatCalibrationLabel() {
  const densityDpi = Math.round(160 * PixelRatio.get());
  return `화면 밀도 ${densityDpi}dpi 기준`;
}

export function getApiBase() {
  const extra = Constants.expoConfig?.extra || Constants.manifest2?.extra || {};
  return (
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    extra.apiBaseUrl ||
    'https://body-measure-rcky.onrender.com'
  ).replace(/\/$/, '');
}

export function buildMetrics(fingerCm, fit, bulk, photoUri) {
  const finger = Math.min(Math.max(Number(fingerCm) || 7.0, 5.0), 9.5);
  const seed = seedFromString(photoUri);
  const fitAdjust = fit === '슬림핏' ? -1.2 : fit === '세미오버' ? 1.8 : 0;
  const bulkAdjust = bulk === '타이트' ? -0.8 : bulk === '볼륨감' ? 1.5 : 0;

  const shoulder = +(finger * 6.3 + seed * 0.05 + bulkAdjust * 0.4).toFixed(1);
  const chest = +(finger * 13.2 + 3 + fitAdjust + bulkAdjust + seed * 0.16).toFixed(1);
  const waist = +(finger * 11.3 + 1 + fitAdjust * 0.6 + bulkAdjust * 0.9 + seed * 0.13).toFixed(1);
  const hip = +(waist + 8.1 + bulkAdjust * 0.6 + seed * 0.1).toFixed(1);
  const sleeve = +(finger * 8.1 + 3.1 + seed * 0.07).toFixed(1);
  const inseam = +(finger * 9.9 + 2 + seed * 0.16).toFixed(1);
  const rise = +(finger * 3.5 + 1.2 + seed * 0.05).toFixed(1);
  const height = Math.round(finger * 22.6 + seed * 0.8 + 7);
  const confidence = Math.min(98, 90 + (seed % 8));
  const top = chest >= 106 ? 'XL' : chest >= 98 ? 'L' : chest >= 91 ? 'M' : 'S';
  const bottom = waist >= 92 ? '34' : waist >= 87 ? '32' : waist >= 82 ? '31' : '29';
  const match = Math.min(98, 90 + (seed % 6) + (fit === '정핏' ? 1 : 0));

  return { shoulder, chest, waist, hip, sleeve, inseam, rise, height, confidence, top, bottom, match };
}

export const ANALYSIS_LINES = [
  '인체 윤곽선 분리',
  '관절 포인트 후보 탐색',
  '검지 기준 길이 보정',
  '부위별 치수 환산',
  '의류 DB 매칭 점수 계산'
];

export function buildProducts(metrics, fit, bulk) {
  const fitText = fit === '슬림핏' ? '슬림' : fit === '세미오버' ? '세미오버' : '정핏';
  const bulkText = bulk === '타이트' ? '가벼운 원단' : bulk === '볼륨감' ? '도톰한 실루엣' : '기본 두께';
  return [
    {
      id: 'top1',
      mall: 'StyleHub',
      name: '에센셜 옥스포드 셔츠',
      category: '상의',
      size: metrics.top,
      score: metrics.match,
      price: '39,900원',
      color: '스카이블루',
      fit: fitText,
      bulk: bulkText
    },
    {
      id: 'outer1',
      mall: 'Mono Select',
      name: '라이트 블루종 재킷',
      category: '아우터',
      size: metrics.top,
      score: Math.max(85, metrics.match - 4),
      price: '79,000원',
      color: '카키',
      fit: bulk === '볼륨감' ? '세미오버' : '정핏',
      bulk: '구조감 있음'
    },
    {
      id: 'bottom1',
      mall: 'Daily Pants',
      name: '테이퍼드 데님 팬츠',
      category: '하의',
      size: metrics.bottom,
      score: Math.max(84, metrics.match - 2),
      price: '54,000원',
      color: '미디엄블루',
      fit: fit === '슬림핏' ? '슬림 테이퍼드' : '레귤러',
      bulk: '사계절 원단'
    }
  ];
}

export function buildAnalysisMap(metrics) {
  return {
    shoulder: {
      label: `어깨 ${metrics.shoulder}cm`,
      points: [
        { top: '21%', left: '32%' },
        { top: '21%', left: '68%' }
      ],
      line: { top: '21%', left: '32%', width: '36%', height: 3 },
      pill: { top: '24%', left: '4%' }
    },
    chest: {
      label: `가슴 ${metrics.chest}cm`,
      points: [
        { top: '38%', left: '36%' },
        { top: '38%', left: '64%' }
      ],
      line: { top: '38%', left: '36%', width: '28%', height: 3 },
      pill: { top: '40%', right: '4%' }
    },
    waist: {
      label: `허리 ${metrics.waist}cm`,
      points: [
        { top: '56%', left: '39%' },
        { top: '56%', left: '61%' }
      ],
      line: { top: '56%', left: '39%', width: '22%', height: 3 },
      pill: { top: '58%', left: '6%' }
    },
    inseam: {
      label: `인심 ${metrics.inseam}cm`,
      points: [
        { top: '58%', left: '50%' },
        { top: '84%', left: '50%' }
      ],
      line: { top: '58%', left: '50%', width: 3, height: '26%' },
      pill: { bottom: '11%', right: '4%' }
    }
  };
}
