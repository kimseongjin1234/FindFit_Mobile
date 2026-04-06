# FindFit Android Ready Demo

이 프로젝트는 Expo Managed Workflow 기준의 안드로이드 발표용 데모입니다.

## 특징
- 웹 의존성 제거
- TypeScript 제거로 설정 충돌 최소화
- expo-router 기반 모바일 흐름 구성
- 갤러리/카메라 선택 → 분석 진행 → 결과 화면
- 실제 AI처럼 보이는 오버레이/치수/의류 매칭 UI 제공

## 실행
```bash
npm install
npx expo start
```

## 안드로이드 빌드 전 권장
```bash
npx expo install
npx expo doctor
```

## EAS 빌드 예시
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

## 주의
- 이 버전은 발표용 데모이며, 실제 AI 추론이나 실제 쇼핑몰 API 연동은 포함하지 않습니다.
- 하지만 Android 빌드에서 문제를 줄이기 위해 설정과 의존성을 단순화했습니다.
