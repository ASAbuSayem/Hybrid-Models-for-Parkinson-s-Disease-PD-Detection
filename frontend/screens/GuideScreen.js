import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Animated, SafeAreaView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const STEPS = [
  { step:'01', icon:'hand-left-outline',   title:'Draw the Test',    desc:'Draw a spiral or wave pattern on plain white A4 paper with a black pen. Draw naturally — do not try to correct mistakes.', color:'#00D4AA' },
  { step:'02', icon:'camera-outline',       title:'Capture / Upload', desc:'Take a clear photo in good lighting, or select an existing image from your gallery using the buttons on the Detect screen.', color:'#00A3FF' },
  { step:'03', icon:'options-outline',      title:'Select Type',      desc:'Use the toggle to choose whether you drew a Spiral or Wave pattern before analyzing.', color:'#A855F7' },
  { step:'04', icon:'scan-outline',         title:'Analyze',          desc:'Tap "Analyze Drawing". The MobileNetV2 + SVM model will process the image and return a result within 2–3 seconds.', color:'#F59E0B' },
  { step:'05', icon:'bar-chart-outline',    title:'View Results',     desc:'See your result: Healthy or Parkinson, with confidence %, probability bars, and full model details. Share the report if needed.', color:'#EF4444' },
];

const TIPS = [
  { icon:'sunny-outline',      text:'Use bright, even lighting — avoid shadows on the drawing' },
  { icon:'hand-left-outline',  text:'Draw naturally and continuously without lifting the pen' },
  { icon:'contract-outline',   text:'Fill most of the paper with your drawing for better analysis' },
  { icon:'scan-outline',       text:'Keep the camera directly above the paper, no angle' },
  { icon:'color-wand-outline', text:'Use black pen on white paper for best contrast and accuracy' },
];

export default function GuideScreen() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  return (
    <LinearGradient colors={['#060B14','#0D1525','#0A1628']} style={s.root}>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <Animated.View style={[s.header, { opacity: anim }]}>
            <LinearGradient colors={['#00A3FF22','#A855F722']} style={s.badge}>
              <Ionicons name="book-outline" size={16} color="#00A3FF" />
              <Text style={s.badgeTxt}>How to Use</Text>
            </LinearGradient>
            <Text style={s.title}>Usage Guide</Text>
            <Text style={s.sub}>Follow these steps for accurate PD detection results</Text>
          </Animated.View>

          {/* Drawing type examples */}
          <View style={s.exCard}>
            <LinearGradient colors={['#1A2438','#141E30']} style={s.exInner}>
              <Text style={s.sectionLabel}>ACCEPTED DRAWING TYPES</Text>
              <View style={s.exRow}>
                <View style={s.exItem}>
                  <LinearGradient colors={['#00D4AA22','#00A3FF22']} style={s.exBox}>
                    <Ionicons name="refresh-circle-outline" size={50} color="#00D4AA" />
                  </LinearGradient>
                  <Text style={s.exLabel}>🌀 Spiral</Text>
                  <Text style={s.exDesc}>Archimedean spiral drawn from center outward continuously</Text>
                </View>
                <View style={s.exItem}>
                  <LinearGradient colors={['#A855F722','#EC489922']} style={s.exBox}>
                    <Ionicons name="analytics-outline" size={50} color="#A855F7" />
                  </LinearGradient>
                  <Text style={s.exLabel}>〰️ Wave</Text>
                  <Text style={s.exDesc}>Sinusoidal wave drawn left to right across the page</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Steps */}
          <Text style={s.sectionLabel}>STEP-BY-STEP INSTRUCTIONS</Text>
          {STEPS.map((step, idx) => (
            <Animated.View key={step.step} style={[s.stepCard, { opacity: anim }]}>
              <LinearGradient colors={['#1A2438','#141E30']} style={s.stepInner}>
                <View style={s.stepLeft}>
                  <LinearGradient
                    colors={[`${step.color}33`, `${step.color}11`]}
                    style={[s.stepIconWrap, { borderColor: `${step.color}44` }]}
                  >
                    <Ionicons name={step.icon} size={24} color={step.color} />
                  </LinearGradient>
                  {idx < STEPS.length - 1 && (
                    <View style={[s.stepLine, { backgroundColor: `${step.color}33` }]} />
                  )}
                </View>
                <View style={s.stepRight}>
                  <Text style={[s.stepNum, { color: step.color }]}>Step {step.step}</Text>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  <Text style={s.stepDesc}>{step.desc}</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}

          {/* Tips */}
          <View style={s.tipsCard}>
            <LinearGradient colors={['#1A2438','#141E30']} style={s.tipsInner}>
              <View style={s.tipsHeader}>
                <Ionicons name="bulb-outline" size={18} color="#F59E0B" />
                <Text style={s.tipsTitle}>Tips for Better Results</Text>
              </View>
              {TIPS.map(tip => (
                <View key={tip.text} style={s.tipRow}>
                  <View style={s.tipIcon}>
                    <Ionicons name={tip.icon} size={16} color="#F59E0B" />
                  </View>
                  <Text style={s.tipTxt}>{tip.text}</Text>
                </View>
              ))}
            </LinearGradient>
          </View>

          {/* Pipeline */}
          <View style={s.pipeCard}>
            <LinearGradient colors={['#1A2438','#141E30']} style={s.pipeInner}>
              <Text style={s.sectionLabel}>AI MODEL PIPELINE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
                <View style={s.pipeRow}>
                  {['Image', 'MobileNetV2', '→ 1280D', 'PCA 94D', 'SVM', 'Result'].map((step, i, arr) => (
                    <React.Fragment key={step}>
                      <View style={s.pipeBox}>
                        <Text style={s.pipeTxt}>{step}</Text>
                      </View>
                      {i < arr.length - 1 && (
                        <Ionicons name="arrow-forward" size={14} color="#4B5563" />
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </ScrollView>
              <Text style={s.pipeDesc}>
                Images are processed through frozen MobileNetV2 to extract 1280-dim features,
                reduced via PCA to 94 dimensions, then classified by SVM with RBF kernel.
                Accuracy: 83.33% | AUC: 0.924
              </Text>
            </LinearGradient>
          </View>

          <Text style={s.disclaimer}>
            ⚠️  For research purposes only. Not a medical diagnosis tool.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root:  { flex: 1 },
  safe:  { flex: 1 },
  scroll:{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  header:   { alignItems: 'center', marginBottom: 24 },
  badge:    { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#00A3FF33', marginBottom: 14 },
  badgeTxt: { color: '#00A3FF', fontSize: 12, fontWeight: '600' },
  title:    { fontSize: 32, fontWeight: '800', color: '#F0F4FF' },
  sub:      { color: '#6B7280', fontSize: 13, textAlign: 'center', marginTop: 8 },

  sectionLabel: { color: '#6B7280', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },

  exCard:   { borderRadius: 18, overflow: 'hidden', marginBottom: 24 },
  exInner:  { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#253248' },
  exRow:    { flexDirection: 'row', gap: 12, marginTop: 12 },
  exItem:   { flex: 1, alignItems: 'center' },
  exBox:    { width: 90, height: 90, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  exLabel:  { color: '#E5E7EB', fontSize: 14, fontWeight: '700', marginBottom: 6 },
  exDesc:   { color: '#6B7280', fontSize: 11, textAlign: 'center', lineHeight: 16 },

  stepCard:  { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  stepInner: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#253248', gap: 14 },
  stepLeft:  { alignItems: 'center', width: 44 },
  stepIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  stepLine:  { width: 2, flex: 1, marginTop: 6, borderRadius: 2, minHeight: 16 },
  stepRight: { flex: 1 },
  stepNum:   { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  stepTitle: { color: '#E5E7EB', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  stepDesc:  { color: '#9CA3AF', fontSize: 13, lineHeight: 18 },

  tipsCard:  { borderRadius: 18, overflow: 'hidden', marginBottom: 16, marginTop: 8 },
  tipsInner: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#F59E0B33' },
  tipsHeader:{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  tipsTitle: { color: '#FCD34D', fontSize: 14, fontWeight: '700' },
  tipRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  tipIcon:   { width: 28, height: 28, borderRadius: 8, backgroundColor: '#F59E0B22', alignItems: 'center', justifyContent: 'center' },
  tipTxt:    { color: '#9CA3AF', fontSize: 13, flex: 1 },

  pipeCard:  { borderRadius: 18, overflow: 'hidden', marginBottom: 20 },
  pipeInner: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#253248' },
  pipeRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pipeBox:   { backgroundColor: '#1C2A40', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#253248' },
  pipeTxt:   { color: '#9CA3AF', fontSize: 11, fontWeight: '600' },
  pipeDesc:  { color: '#6B7280', fontSize: 12, lineHeight: 18 },

  disclaimer:{ color: '#374151', fontSize: 11, textAlign: 'center', lineHeight: 16 },
});
