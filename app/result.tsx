import React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const COLORS = {
  bg: '#E8EEFF',
  card: '#FFFFFF',
  primary: '#4264D0',
  mint: '#7DC8B1',
  text: '#22325E',
  line: '#E5EAF6',
  green: '#6CB89F',
  greenDark: '#468B74',
  jacket: '#6E7D52',
  jean: '#6E8BB5',
  shirt: '#A9C7F3',
  chip: '#5068C5',
};

function Logo() {
  return (
    <Text style={styles.logo}>
      <Text style={{ color: COLORS.primary }}>Find</Text>
      <Text style={{ color: COLORS.mint }}>Fit</Text>
    </Text>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.phoneShadow}>
      <View style={styles.phoneOuter}>
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

function ProductCard({ top = false, title, chipText, variant }: { top?: boolean; title: string; chipText: string; variant: 'jacket' | 'shirt' }) {
  return (
    <View style={[styles.productCard, top && { marginTop: 10 }]}> 
      <View style={styles.productThumbRow}>
        <View style={[styles.thumbItem, variant === 'jacket' ? styles.jacket : styles.shirt]} />
        {variant === 'jacket' && <View style={[styles.thumbItem, styles.jeans]} />}
      </View>
      <View style={styles.productTextWrap}>
        <Text style={styles.productTitle}>{title}</Text>
      </View>
      <View style={styles.sizeChip}><Text style={styles.sizeChipText}>{chipText}</Text></View>
    </View>
  );
}

export default function ResultScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <PhoneFrame>
        <View style={styles.topRow}>
          <Text style={styles.backArrow} onPress={() => router.back()}>‹</Text>
          <View style={styles.logoWrap}><Logo /></View>
          <View style={styles.infoCircle}><Text style={styles.infoText}>i</Text></View>
        </View>

        <View style={styles.content}>
          <Text style={styles.resultTitle}>사이즈 분석 결과</Text>

          <View style={styles.infoRow}><Text style={styles.label}>어깨너비</Text><Text style={styles.value}>47 cm</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>팔길이</Text><Text style={styles.value}>62 cm</Text></View>
          <View style={styles.infoRow}><Text style={styles.label}>가슴둘레</Text><Text style={styles.value}>98 cm</Text></View>

          <ProductCard top title="추천 사이즈 L" chipText="32" variant="jacket" />
          <ProductCard title="추천 사이즈 32" chipText="32" variant="shirt" />

          <Pressable style={styles.buyButton}>
            <Text style={styles.buyButtonText}>온라인 몰에서 바로 구매하기</Text>
          </Pressable>
        </View>
      </PhoneFrame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneShadow: {
    shadowColor: '#6E84C7',
    shadowOpacity: 0.26,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  phoneOuter: {
    width: 332,
    height: 676,
    borderRadius: 36,
    backgroundColor: '#111419',
    padding: 6,
  },
  screen: {
    flex: 1,
    borderRadius: 31,
    backgroundColor: '#F8FAFF',
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -58,
    width: 116,
    height: 22,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: '#111419',
    zIndex: 5,
  },
  topRow: {
    paddingTop: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    color: '#8D97B5',
    fontSize: 34,
    lineHeight: 34,
    width: 28,
  },
  logoWrap: { flex: 1, alignItems: 'center' },
  logo: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  infoCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: { color: 'white', fontWeight: '800' },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingBottom: 16,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  productCard: {
    marginTop: 12,
    backgroundColor: '#F4F6FB',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productThumbRow: {
    flexDirection: 'row',
    gap: 8,
    width: 104,
  },
  thumbItem: {
    width: 44,
    height: 64,
    borderRadius: 10,
  },
  jacket: {
    backgroundColor: COLORS.jacket,
  },
  jeans: {
    backgroundColor: COLORS.jean,
  },
  shirt: {
    backgroundColor: COLORS.shirt,
  },
  productTextWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  sizeChip: {
    minWidth: 72,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.chip,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeChipText: {
    color: 'white',
    fontSize: 19,
    fontWeight: '900',
  },
  buyButton: {
    marginTop: 14,
    backgroundColor: COLORS.green,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
});
