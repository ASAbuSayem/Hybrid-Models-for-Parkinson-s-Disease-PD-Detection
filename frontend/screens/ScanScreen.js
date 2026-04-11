import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  ScrollView, ActivityIndicator, Alert, Animated,
  Dimensions, SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────
//  ⚠️  CHANGE THIS to your PC's local IP address!
//  Run  ipconfig  in Windows CMD → look for IPv4 Address under your WiFi
//  Example: http://192.168.1.4:8000
// ─────────────────────────────────────────────────────────────────────────────
const API_URL = 'http://192.168.1.4:8000';

export default function ScanScreen({ navigation }) {
  const [image,       setImage]       = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [drawingType, setDrawingType] = useState('spiral');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  const fadeIn = () =>
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

  // ── Gallery picker ────────────────────────────────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow gallery access to upload drawings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled) { setImage(result.assets[0]); fadeIn(); }
  };

  // ── Camera ────────────────────────────────────────────────────────────────
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled) { setImage(result.assets[0]); fadeIn(); }
  };

  // ── Analyze ───────────────────────────────────────────────────────────────
  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('No image', 'Please select or capture a drawing first.');
      return;
    }
    setLoading(true);
    startPulse();
    try {
      const formData = new FormData();
      formData.append('file', {
        uri:  image.uri,
        type: 'image/jpeg',
        name: 'drawing.jpg',
      });

      const res = await fetch(`${API_URL}/predict`, {
        method:  'POST',
        body:    formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Server error');
      }

      const result = await res.json();
      setLoading(false);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      navigation.navigate('Result', { result, imageUri: image.uri, drawingType });
    } catch (error) {
      setLoading(false);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      Alert.alert(
        'Connection Error',
        `Cannot reach the server.\n\nCheck:\n• Backend uvicorn is running\n• API_URL in ScanScreen.js = your PC IP\n• Phone & PC on same WiFi\n\nError: ${error.message}`
      );
    }
  };

  return (
    <LinearGradient colors={['#060B14', '#0D1525', '#0A1628']} style={s.root}>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Header ─────────────────────────────────────────────── */}
          <View style={s.header}>
            <LinearGradient colors={['#00D4AA22','#00A3FF22']} style={s.badge}>
              <Ionicons name="medical" size={16} color="#00D4AA" />
              <Text style={s.badgeText}>AI-Powered PD Detection</Text>
            </LinearGradient>
            <Text style={s.title}>Parkinson's{'\n'}Detector</Text>
            <Text style={s.subtitle}>Upload a spiral or wave drawing for instant AI analysis</Text>
          </View>

          {/* ── Drawing Type Toggle ─────────────────────────────────── */}
          <View style={s.toggleWrap}>
            <Text style={s.toggleLabel}>DRAWING TYPE</Text>
            <View style={s.toggle}>
              {['spiral', 'wave'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.toggleBtn, drawingType === t && s.toggleActive]}
                  onPress={() => setDrawingType(t)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={t === 'spiral' ? 'refresh-circle-outline' : 'analytics-outline'}
                    size={16}
                    color={drawingType === t ? '#0D1525' : '#6B7280'}
                  />
                  <Text style={[s.toggleText, drawingType === t && s.toggleTextActive]}>
                    {t === 'spiral' ? '🌀 Spiral' : '〰️ Wave'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Preview ─────────────────────────────────────────────── */}
          {image ? (
            <Animated.View style={[s.previewBox, { opacity: fadeAnim }]}>
              <Image source={{ uri: image.uri }} style={s.previewImg} />
              <LinearGradient
                colors={['transparent','rgba(6,11,20,0.85)']}
                style={s.previewGrad}
              />
              <View style={s.previewTag}>
                <Text style={s.previewTagTxt}>
                  {drawingType === 'spiral' ? '🌀 Spiral' : '〰️ Wave'} Drawing
                </Text>
              </View>
              <TouchableOpacity
                style={s.removeBtn}
                onPress={() => { setImage(null); fadeAnim.setValue(0); }}
              >
                <Ionicons name="close-circle" size={30} color="#FF6B6B" />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={s.emptyBox}>
              <LinearGradient colors={['#00D4AA18','#00A3FF18']} style={s.emptyGrad}>
                <Ionicons name="image-outline" size={56} color="#00D4AA55" />
                <Text style={s.emptyTitle}>No Drawing Selected</Text>
                <Text style={s.emptySub}>Use the buttons below to upload or photograph a drawing</Text>
              </LinearGradient>
            </View>
          )}

          {/* ── Upload Buttons ──────────────────────────────────────── */}
          <View style={s.btnRow}>
            <TouchableOpacity style={s.uploadBtn} onPress={pickImage} activeOpacity={0.85}>
              <LinearGradient colors={['#1C2A40','#253248']} style={s.uploadBtnInner}>
                <Ionicons name="images-outline" size={26} color="#00D4AA" />
                <Text style={s.uploadBtnTxt}>Gallery</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={s.uploadBtn} onPress={takePhoto} activeOpacity={0.85}>
              <LinearGradient colors={['#1C2A40','#253248']} style={s.uploadBtnInner}>
                <Ionicons name="camera-outline" size={26} color="#00A3FF" />
                <Text style={s.uploadBtnTxt}>Camera</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* ── Analyze Button ──────────────────────────────────────── */}
          <Animated.View style={{ transform: [{ scale: loading ? pulseAnim : 1 }] }}>
            <TouchableOpacity
              style={[s.analyzeBtn, (!image || loading) && s.analyzeBtnDisabled]}
              onPress={analyzeImage}
              disabled={!image || loading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={image && !loading ? ['#00D4AA','#00A3FF'] : ['#253248','#1C2A40']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.analyzeBtnGrad}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={s.analyzeTxt}>Analyzing...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="scan" size={22} color={image ? '#fff' : '#4B5563'} />
                    <Text style={[s.analyzeTxt, !image && { color: '#4B5563' }]}>
                      Analyze Drawing
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color={image ? '#fff' : '#4B5563'} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Model Info ──────────────────────────────────────────── */}
          <View style={s.modelCard}>
            <LinearGradient colors={['#1A2438','#141E30']} style={s.modelCardInner}>
              <Text style={s.modelCardLabel}>MODEL PERFORMANCE</Text>
              <View style={s.metrics}>
                {[
                  { val: '83.33%', key: 'Accuracy' },
                  { val: '0.924',  key: 'AUC Score' },
                  { val: 'M2',     key: 'Architecture' },
                ].map((m, i, arr) => (
                  <React.Fragment key={m.key}>
                    <View style={s.metric}>
                      <Text style={s.metricVal}>{m.val}</Text>
                      <Text style={s.metricKey}>{m.key}</Text>
                    </View>
                    {i < arr.length - 1 && <View style={s.divider} />}
                  </React.Fragment>
                ))}
              </View>
              <Text style={s.modelArch}>MobileNetV2 + SVM (RBF)</Text>
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
  root:     { flex: 1 },
  safe:     { flex: 1 },
  scroll:   { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },

  header:     { alignItems: 'center', marginBottom: 28 },
  badge:      {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: '#00D4AA33', marginBottom: 16,
  },
  badgeText:  { color: '#00D4AA', fontSize: 12, fontWeight: '600' },
  title:      { fontSize: 36, fontWeight: '800', color: '#F0F4FF', textAlign: 'center', lineHeight: 42 },
  subtitle:   { color: '#6B7280', fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 },

  toggleWrap:        { marginBottom: 20 },
  toggleLabel:       { color: '#6B7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  toggle:            { flexDirection: 'row', backgroundColor: '#1C2333', borderRadius: 14, padding: 4 },
  toggleBtn:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  toggleActive:      { backgroundColor: '#00D4AA' },
  toggleText:        { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  toggleTextActive:  { color: '#0D1525' },

  previewBox:  { height: 280, borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative' },
  previewImg:  { width: '100%', height: '100%' },
  previewGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 },
  previewTag:  { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,212,170,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: '#00D4AA44' },
  previewTagTxt: { color: '#00D4AA', fontSize: 12, fontWeight: '600' },
  removeBtn:   { position: 'absolute', top: 10, right: 10 },

  emptyBox:   { height: 240, borderRadius: 20, overflow: 'hidden', borderWidth: 1.5, borderColor: '#1C2A40', marginBottom: 20 },
  emptyGrad:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyTitle: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  emptySub:   { color: '#374151', fontSize: 13, textAlign: 'center', paddingHorizontal: 24 },

  btnRow:         { flexDirection: 'row', gap: 12, marginBottom: 16 },
  uploadBtn:      { flex: 1, borderRadius: 14, overflow: 'hidden' },
  uploadBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 14, borderWidth: 1, borderColor: '#253248' },
  uploadBtnTxt:   { color: '#E5E7EB', fontSize: 15, fontWeight: '600' },

  analyzeBtn:         { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  analyzeBtnDisabled: {},
  analyzeBtnGrad:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
  analyzeTxt:         { color: '#fff', fontSize: 17, fontWeight: '700' },

  modelCard:      { borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  modelCardInner: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#253248' },
  modelCardLabel: { color: '#6B7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 14 },
  metrics:        { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  metric:         { flex: 1, alignItems: 'center' },
  metricVal:      { color: '#00D4AA', fontSize: 20, fontWeight: '800' },
  metricKey:      { color: '#6B7280', fontSize: 11, marginTop: 2 },
  divider:        { width: 1, height: 30, backgroundColor: '#253248' },
  modelArch:      { color: '#4B5563', fontSize: 12, textAlign: 'center' },

  disclaimer: { color: '#374151', fontSize: 11, textAlign: 'center' },
});
