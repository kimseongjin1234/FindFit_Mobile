import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../app/lib';

export function AppShell({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}><Text style={{ color: COLORS.primary }}>Find</Text><Text style={{ color: COLORS.mint }}>Fit</Text></Text>
        <View style={styles.badge}><Text style={styles.badgeText}>ANDROID READY DEMO</Text></View>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </View>
    </SafeAreaView>
  );
}

export function StepBadge({ step, label }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepPill}><Text style={styles.stepText}>{step}</Text></View>
      <Text style={styles.stepLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  logo: { fontSize: 30, fontWeight: '900', letterSpacing: -1 },
  badge: { backgroundColor: COLORS.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  badgeText: { color: COLORS.primary, fontWeight: '800', fontSize: 11 },
  card: { flex: 1, backgroundColor: COLORS.card, borderRadius: 28, padding: 18, borderWidth: 1, borderColor: COLORS.line },
  title: { color: COLORS.text, fontSize: 25, fontWeight: '900' },
  subtitle: { color: COLORS.subtext, fontSize: 13.5, lineHeight: 20, marginTop: 6, marginBottom: 14 },
  stepRow: { marginBottom: 14 },
  stepPill: { alignSelf: 'flex-start', backgroundColor: COLORS.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, marginBottom: 8 },
  stepText: { color: COLORS.primary, fontWeight: '800', fontSize: 12 },
  stepLabel: { color: COLORS.text, fontWeight: '800', fontSize: 16 }
});
