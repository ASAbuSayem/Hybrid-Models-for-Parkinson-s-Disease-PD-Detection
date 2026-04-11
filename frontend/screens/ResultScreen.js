import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Animated, SafeAreaView, ScrollView, Dimensions, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const RING = 170;

export default function ResultScreen({ route, navigation }) {
  const { result, imageUri, drawingType } = route.params;

  const isPD        = result.prediction === 'Parkinson';
  const confidence  = result.confidence;
  const pdProb      = result.probability_parkinson;
  const healthyProb = result.probability_healthy;
  const ACCENT      = isPD ? '#FF6B6B' : '#00D4AA';
  const ACCENT2     = isPD ? '#FF9B6B' : '#00A3FF';

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const barH      = useRef(new Animated.Value(0)).current;
  const barP      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(barH, { toValue: healthyProb / 100, duration: 1000, delay: 400, useNativeDriver: false }),
      Animated.timing(barP, { toValue: pdProb / 100,      duration: 1000, delay: 600, useNativeDriver: false }),
    ]).start();
  }, []);

  const handleShare = async () => {
    await Share.share({
      message:
        `🧠 PD Detection Result\n\n` +
        `Prediction: ${result.prediction}\n` +
        `Confidence: ${confidence.toFixed(1)}%\n` +
        `Healthy: ${healthyProb.toFixed(1)}%  |  Parkinson: ${pdProb.toFixed(1)}%\n\n` +
        `Model: ${result.model} | Accuracy: ${result.model_accuracy}% | AUC: ${result.model_auc}\n\n` +
        `⚠️ Research use only. Not a medical diagnosis.`,
    });
  };

  return (
    <LinearGradient
      colors={isPD ? ['#0F0A14','#1A0F20','#0F0A14'] : ['#060F14','#0A1A1A','#060F14']}
      style={s.root}
    >
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Top row ───────────────────────────────────────────── */}
          <View style={s.topRow}>
            <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
              <Text style={s.backTxt}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* ── Status badge ──────────────────────────────────────── */}
          <Animated.View style={[s.badgeWrap, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[`${ACCENT}22`, `${ACCENT2}22`]}
              style={[s.badge, { borderColor: `${ACCENT}55` }]}
            >
              <Ionicons
                name={isPD ? 'alert-circle' : 'checkmark-circle'}
                size={20} color={ACCENT}
              />
              <Text style={[s.badgeTxt, { color: ACCENT }]}>
                {isPD ? 'Parkinson Detected' : 'Healthy — No PD Signs'}
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* ── Confidence ring ───────────────────────────────────── */}
          <Animated.View style={[s.ringSection, { opacity: fadeAnim }]}>
            <Animated.View style={[
              s.ringOuter,
              { borderColor: ACCENT, shadowColor: ACCENT, transform: [{ scale: scaleAnim }] },
            ]}>
              <View style={[s.ringInner, { borderColor: `${ACCENT}22` }]}>
                <Text style={[s.ringPct, { color: ACCENT }]}>{confidence.toFixed(1)}%</Text>
                <Text style={s.ringLbl}>Confidence</Text>
              </View>
            </Animated.View>
            <Text style={s.predLabel}>{result.prediction}</Text>
            <Text style={s.predSub}>
              {drawingType === 'spiral' ? '🌀 Spiral' : '〰️ Wave'} Drawing Analysis
            </Text>
          </Animated.View>

          {/* ── Probability bars ──────────────────────────────────── */}
          <Animated.View style={[s.card, { opacity: fadeAnim }]}>
            <LinearGradient colors={['#1A2230','#141C28']} style={s.cardInner}>
              <Text style={s.cardLabel}>CLASS PROBABILITIES</Text>

              {[
                { label: 'Healthy',   prob: healthyProb, anim: barH, color: '#00D4AA' },
                { label: 'Parkinson', prob: pdProb,      anim: barP, color: '#FF6B6B' },
              ].map(item => (
                <View key={item.label} style={s.barWrap}>
                  <View style={s.barLabelRow}>
                    <View style={[s.dot, { backgroundColor: item.color }]} />
                    <Text style={s.barName}>{item.label}</Text>
                    <Text style={[s.barPct, { color: item.color }]}>
                      {item.prob.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={s.barTrack}>
                    <Animated.View style={[
                      s.barFill,
                      {
                        width: item.anim.interpolate({ inputRange: [0,1], outputRange: ['0%','100%'] }),
                        backgroundColor: item.color,
                      },
                    ]} />
                  </View>
                </View>
              ))}
            </LinearGradient>
          </Animated.View>

          {/* ── Uploaded image ────────────────────────────────────── */}
          <Animated.View style={[s.card, { opacity: fadeAnim }]}>
            <LinearGradient colors={['#1A2230','#141C28']} style={s.cardInner}>
              <Text style={s.cardLabel}>UPLOADED DRAWING</Text>
              <Image source={{ uri: imageUri }} style={s.thumb} />
            </LinearGradient>
          </Animated.View>

          {/* ── Analysis details ──────────────────────────────────── */}
          <Animated.View style={[s.card, { opacity: fadeAnim }]}>
            <LinearGradient colors={['#1A2230','#141C28']} style={s.cardInner}>
              <Text style={s.cardLabel}>ANALYSIS DETAILS</Text>
              {[
                { k: 'Model',          v: result.model },
                { k: 'Model Accuracy', v: `${result.model_accuracy}%` },
                { k: 'AUC Score',      v: String(result.model_auc) },
              ].map(item => (
                <View key={item.k} style={s.detailRow}>
                  <Text style={s.detailKey}>{item.k}</Text>
                  <Text style={s.detailVal}>{item.v}</Text>
                </View>
              ))}
            </LinearGradient>
          </Animated.View>

          {/* ── Warning (PD only) ─────────────────────────────────── */}
          {isPD && (
            <Animated.View style={[s.warnCard, { opacity: fadeAnim }]}>
              <LinearGradient colors={['#2A1020','#1F0C18']} style={s.warnInner}>
                <Ionicons name="warning" size={20} color="#FF6B6B" />
                <Text style={s.warnTxt}>
                  This result suggests possible Parkinson's disease indicators.
                  Please consult a qualified neurologist for proper medical evaluation.
                </Text>
              </LinearGradient>
            </Animated.View>
          )}

          {/* ── Scan again ────────────────────────────────────────── */}
          <TouchableOpacity style={s.scanAgainBtn} onPress={() => navigation.goBack()} activeOpacity={0.9}>
            <LinearGradient colors={['#1C2A40','#253248']} style={s.scanAgainInner}>
              <Ionicons name="refresh" size={18} color="#00D4AA" />
              <Text style={s.scanAgainTxt}>Scan Another Drawing</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={s.disclaimer}>⚠️  For research purposes only. Not a medical diagnosis.</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root:  { flex: 1 },
  safe:  { flex: 1 },
  scroll:{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },

  topRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backTxt: { color: '#9CA3AF', fontSize: 15 },

  badgeWrap: { alignItems: 'center', marginBottom: 24 },
  badge:     { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  badgeTxt:  { fontSize: 14, fontWeight: '700' },

  ringSection: { alignItems: 'center', marginBottom: 32 },
  ringOuter:   { width: RING, height: RING, borderRadius: RING/2, borderWidth: 5, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, marginBottom: 20 },
  ringInner:   { width: RING - 22, height: RING - 22, borderRadius: (RING-22)/2, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  ringPct:     { fontSize: 36, fontWeight: '900' },
  ringLbl:     { color: '#6B7280', fontSize: 12, fontWeight: '600', marginTop: 2 },
  predLabel:   { fontSize: 28, fontWeight: '800', color: '#F0F4FF', textAlign: 'center' },
  predSub:     { color: '#6B7280', fontSize: 13, textAlign: 'center', marginTop: 6 },

  card:      { borderRadius: 18, overflow: 'hidden', marginBottom: 14 },
  cardInner: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#253248' },
  cardLabel: { color: '#6B7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 16 },

  barWrap:     { marginBottom: 14 },
  barLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  dot:         { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  barName:     { color: '#D1D5DB', fontSize: 14, fontWeight: '600', flex: 1 },
  barPct:      { fontSize: 15, fontWeight: '800' },
  barTrack:    { height: 8, backgroundColor: '#253248', borderRadius: 4, overflow: 'hidden' },
  barFill:     { height: '100%', borderRadius: 4 },

  thumb: { width: width - 76, height: width - 76, borderRadius: 12, marginTop: 8, alignSelf: 'center' },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1C2A40' },
  detailKey: { color: '#6B7280', fontSize: 13 },
  detailVal: { color: '#D1D5DB', fontSize: 13, fontWeight: '600' },

  warnCard:  { borderRadius: 16, overflow: 'hidden', marginBottom: 14 },
  warnInner: { flexDirection: 'row', gap: 10, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#FF6B6B33', alignItems: 'flex-start' },
  warnTxt:   { color: '#FCA5A5', fontSize: 13, flex: 1, lineHeight: 20 },

  scanAgainBtn:   { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  scanAgainInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14, borderWidth: 1, borderColor: '#253248' },
  scanAgainTxt:   { color: '#00D4AA', fontSize: 15, fontWeight: '700' },

  disclaimer: { color: '#374151', fontSize: 11, textAlign: 'center' },
});
