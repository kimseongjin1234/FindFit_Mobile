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

function seedFromString(input) {
  return Array.from(input || 'demo').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 31;
}

export function buildMetrics(fingerCm, fit, photoUri) {
  const finger = Math.min(Math.max(Number(fingerCm) || 7.0, 5.0), 9.5);
  const seed = seedFromString(photoUri);
  const fitAdjust = fit === '슬림핏' ? -1.2 : fit === '세미오버' ? 1.6 : 0;

  const shoulder = +(finger * 6.35 + seed * 0.06).toFixed(1);
  const chest = +(finger * 13.4 + 3 + fitAdjust + seed * 0.17).toFixed(1);
  const waist = +(finger * 11.5 + 1 + fitAdjust * 0.6 + seed * 0.14).toFixed(1);
  const hip = +(waist + 8.4 + seed * 0.12).toFixed(1);
  const sleeve = +(finger * 8.2 + 3.1 + seed * 0.08).toFixed(1);
  const inseam = +(finger * 10.0 + 2 + seed * 0.18).toFixed(1);
  const height = Math.round(finger * 22.6 + seed * 0.8 + 7);
  const confidence = Math.min(98, 89 + (seed % 9));
  const top = chest >= 104 ? 'XL' : chest >= 97 ? 'L' : chest >= 90 ? 'M' : 'S';
  const bottom = waist >= 92 ? '34' : waist >= 87 ? '32' : waist >= 82 ? '31' : '29';
  const match = Math.min(98, 91 + (seed % 7));

  return { shoulder, chest, waist, hip, sleeve, inseam, height, confidence, top, bottom, match };
}

export const ANALYSIS_LINES = [
  '인체 윤곽선 분리',
  '주요 관절 포인트 추정',
  '손가락 기준 비율 보정',
  '상의/하의 치수 환산',
  '의류 DB 매칭 점수 계산'
];

export function buildProducts(metrics, fit) {
  const fitText = fit === '슬림핏' ? '슬림' : fit === '세미오버' ? '세미오버' : '정핏';
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
      fit: fitText
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
      fit: '세미오버'
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
      fit: '레귤러'
    }
  ];
}

export const KEYPOINTS = [
  { top: '14%', left: '49%' },
  { top: '25%', left: '49%' },
  { top: '31%', left: '34%' },
  { top: '31%', left: '64%' },
  { top: '43%', left: '49%' },
  { top: '57%', left: '49%' },
  { top: '60%', left: '39%' },
  { top: '60%', left: '59%' },
  { top: '80%', left: '39%' },
  { top: '80%', left: '59%' }
];

export const SEGMENTS = [
  { top: '17%', left: '50%', width: 2, height: '12%' },
  { top: '31%', left: '37%', width: '26%', height: 2 },
  { top: '31%', left: '50%', width: 2, height: '27%' },
  { top: '60%', left: '42%', width: '16%', height: 2 },
  { top: '60%', left: '41%', width: 2, height: '20%' },
  { top: '60%', left: '57%', width: 2, height: '20%' }
];
