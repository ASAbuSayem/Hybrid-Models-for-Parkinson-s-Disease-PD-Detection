import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Animated, SafeAreaView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TEAM = [
  {
    order: '01',
    name:        'Md. Abu Sayem',
    title:       'AI Lead Researcher & Developer',
    role:        'M.Tech. CSE | AI/ML',
    affiliation: 'Manav Rachna International Institute Of Research And Studies, Haryana, India',
    expertise:   ['ML/DL Systems', 'Mobile AI', 'GeoAI'],
    color1: '#00D4AA',
    color2: '#00A3FF',
    initial: 'AS',
  },
  {
    order: '02',
    name:        'Prof (Dr.) Mamta Dahiya ',
    title:       'Professor & Associate Dean',
    role:        'Research Supervisor',
    affiliation: 'Computer Science & Engineering',
    expertise:   ['GiScience', 'GeoAI', 'GeoML/DL'],
    color1: '#A855F7',
    color2: '#EC4899',
    initial: 'DM',
  },
  {
    order: '03',
    name:        'Reduwan Sharafat Kabir',
    title:       'Co-Author & Researcher',
    role:        'Software Developer, CloudCoder Limited',
    affiliation: 'AI Automation & Technology',
    expertise:   ['AI Automation', 'Business Strategy', 'Product Dev.'],
    color1: '#F59E0B',
    color2: '#EF4444',
    initial: 'RK',
  },
];

function TeamCard({ member, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 600, delay: index * 150, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[
      s.card,
      {
        opacity:   anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [30,0] }) }],
      },
    ]}>
      <LinearGradient colors={['#1A2438','#141E30']} style={s.cardInner}>
        <Text style={s.orderNum}>{member.order}</Text>

        <LinearGradient colors={[member.color1, member.color2]} style={s.avatar} start={{x:0,y:0}} end={{x:1,y:1}}>
          <Text style={s.avatarInitial}>{member.initial}</Text>
        </LinearGradient>

        <Text style={s.cardName}>{member.name}</Text>
        <View style={[s.titleBadge, { borderColor: `${member.color1}55` }]}>
          <Text style={[s.cardTitle, { color: member.color1 }]}>{member.title}</Text>
        </View>
        <Text style={s.cardRole}>{member.role}</Text>
        <View style={s.affiliRow}>
          <Ionicons name="business-outline" size={12} color="#6B7280" />
          <Text style={s.affiliation}>{member.affiliation}</Text>
        </View>

        <View style={s.tags}>
          {member.expertise.map(tag => (
            <View key={tag} style={[s.tag, { backgroundColor: `${member.color1}18`, borderColor: `${member.color1}44` }]}>
              <Text style={[s.tagTxt, { color: member.color1 }]}>{tag}</Text>
            </View>
          ))}
        </View>

        <LinearGradient
          colors={[`${member.color1}00`, member.color1, `${member.color1}00`]}
          style={s.divider}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        />
      </LinearGradient>
    </Animated.View>
  );
}

export default function AboutScreen() {
  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <LinearGradient colors={['#060B14','#0D1525','#0A1628']} style={s.root}>
      <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <Animated.View style={[s.header, { opacity: headerAnim }]}>
            <LinearGradient colors={['#A855F722','#EC489922']} style={s.badge}>
              <Ionicons name="people" size={16} color="#A855F7" />
              <Text style={[s.badgeTxt, { color: '#A855F7' }]}>Research Team</Text>
            </LinearGradient>
            <Text style={s.headerTitle}>Meet the{'\n'}Researchers</Text>
            <Text style={s.headerSub}>
              Chapter 14 — Healthcare & Biomedical Applications{'\n'}
              Scrivener Publishing × WILEY | 2026
            </Text>
          </Animated.View>

          {/* Project card */}
          <Animated.View style={[s.projectCard, { opacity: headerAnim }]}>
            <LinearGradient colors={['#1A2438','#141E30']} style={s.projectInner}>
              <View style={s.projectHeaderRow}>
                <Ionicons name="book-outline" size={20} color="#00D4AA" />
                <Text style={s.projectTitle}>About This Project</Text>
              </View>
              <Text style={s.projectText}>
                This application contributes to{' '}
                <Text style={s.highlight}>"Help the real world Application of Artificial Intelligence Hybrid Neural Networks"</Text>
                {' '}(by Array Team, 2026). It implements a hybrid ML+DL approach for
                early Parkinson's Disease detection through hand-drawing analysis using
                spiral and wave patterns.
              </Text>
              <View style={s.statsRow}>
                {[
                  { val: '83.33%', lbl: 'Accuracy' },
                  { val: '0.924',  lbl: 'AUC Score' },
                  { val: '204',    lbl: 'Images' },
                ].map((st, i, arr) => (
                  <React.Fragment key={st.lbl}>
                    <View style={s.stat}>
                      <Text style={s.statVal}>{st.val}</Text>
                      <Text style={s.statLbl}>{st.lbl}</Text>
                    </View>
                    {i < arr.length - 1 && <View style={s.statDiv} />}
                  </React.Fragment>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Team */}
          <Text style={s.sectionLabel}>CORE TEAM</Text>
          {TEAM.map((member, idx) => (
            <TeamCard key={member.name} member={member} index={idx} />
          ))}

          {/* Tech stack */}
          <View style={s.techCard}>
            <LinearGradient colors={['#1A2438','#141E30']} style={s.techInner}>
              <Text style={s.sectionLabel}>TECHNOLOGY STACK</Text>
              <View style={s.techGrid}>
                {[
                  { label: 'MobileNetV2', sub: 'Feature Extractor', color: '#FF9500' },
                  { label: 'SVM (RBF)',   sub: 'Classifier',        color: '#00D4AA' },
                  { label: 'FastAPI',     sub: 'Backend API',       color: '#009688' },
                  { label: 'React Native',sub: 'Mobile App',        color: '#61DAFB' },
                  { label: 'Expo SDK 53', sub: 'Framework',         color: '#A855F7' },
                  { label: 'TensorFlow',  sub: 'Deep Learning',     color: '#FF6F00' },
                ].map(tech => (
                  <View key={tech.label} style={[s.techChip, { borderColor: `${tech.color}44` }]}>
                    <View style={[s.techDot, { backgroundColor: tech.color }]} />
                    <View>
                      <Text style={s.techName}>{tech.label}</Text>
                      <Text style={s.techSub}>{tech.sub}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Disclaimer */}
          <View style={s.disCard}>
            <LinearGradient colors={['#1A1510','#141008']} style={s.disInner}>
              <Ionicons name="warning" size={16} color="#F59E0B" />
              <Text style={s.disTxt}>
                This application is developed solely for research and academic purposes.
                It is NOT a medical diagnosis tool. Always consult a qualified
                healthcare professional for medical advice.
              </Text>
            </LinearGradient>
          </View>

          <Text style={s.copyright}>© 2026 PD Detection Team · All rights reserved</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  root:  { flex: 1 },
  safe:  { flex: 1 },
  scroll:{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  header:     { alignItems: 'center', marginBottom: 28 },
  badge:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#A855F733', marginBottom: 16 },
  badgeTxt:   { fontSize: 12, fontWeight: '600' },
  headerTitle:{ fontSize: 34, fontWeight: '800', color: '#F0F4FF', textAlign: 'center', lineHeight: 40 },
  headerSub:  { color: '#6B7280', fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 20 },

  projectCard:      { borderRadius: 18, overflow: 'hidden', marginBottom: 24 },
  projectInner:     { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#253248' },
  projectHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  projectTitle:     { color: '#E5E7EB', fontSize: 15, fontWeight: '700' },
  projectText:      { color: '#9CA3AF', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  highlight:        { color: '#00D4AA', fontWeight: '600' },
  statsRow:         { flexDirection: 'row', justifyContent: 'space-around' },
  stat:             { alignItems: 'center' },
  statVal:          { color: '#00D4AA', fontSize: 20, fontWeight: '800' },
  statLbl:          { color: '#6B7280', fontSize: 11, marginTop: 2 },
  statDiv:          { width: 1, height: 30, backgroundColor: '#253248' },

  sectionLabel: { color: '#6B7280', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },

  card:      { borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
  cardInner: { padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#253248', alignItems: 'center' },
  orderNum:  { position: 'absolute', top: 14, left: 14, color: '#253248', fontSize: 40, fontWeight: '900' },
  avatar:    { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12 },
  avatarInitial: { color: '#fff', fontSize: 28, fontWeight: '900' },
  cardName:  { color: '#F0F4FF', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  titleBadge:{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, borderWidth: 1, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.03)' },
  cardTitle: { fontSize: 12, fontWeight: '700' },
  cardRole:  { color: '#9CA3AF', fontSize: 13, marginBottom: 6, textAlign: 'center' },
  affiliRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  affiliation:{ color: '#6B7280', fontSize: 12 },
  tags:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 16 },
  tag:       { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  tagTxt:    { fontSize: 11, fontWeight: '600' },
  divider:   { height: 1, width: '60%' },

  techCard:  { borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  techInner: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: '#253248' },
  techGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  techChip:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.03)', width: (width - 68) / 2 },
  techDot:   { width: 8, height: 8, borderRadius: 4 },
  techName:  { color: '#D1D5DB', fontSize: 12, fontWeight: '600' },
  techSub:   { color: '#6B7280', fontSize: 10 },

  disCard:   { borderRadius: 14, overflow: 'hidden', marginBottom: 20 },
  disInner:  { flexDirection: 'row', gap: 10, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#F59E0B33', alignItems: 'flex-start' },
  disTxt:    { color: '#92400E', fontSize: 12, flex: 1, lineHeight: 18 },

  copyright: { color: '#374151', fontSize: 11, textAlign: 'center' },
});
