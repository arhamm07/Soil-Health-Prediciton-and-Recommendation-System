import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Sprout, ChevronRight, Zap, ShieldCheck, Microscope, Beaker, BarChart2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const whyFeatures = [
    { icon: <Zap color="#2e7d32" size={24} />, title: 'Real-time Predictions', desc: 'Get results instantly with our optimized engine.' },
    { icon: <ShieldCheck color="#2e7d32" size={24} />, title: 'Expert Advice', desc: 'Recommendations from USDA/FAO standards.' },
    { icon: <Microscope color="#2e7d32" size={24} />, title: 'ML Precision', desc: 'Powered by Random Forest Classifier.' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80' }}
          style={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.heroOverlay}
          >
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>AI-Powered Agriculture</Text>
            </View>
            <Text style={styles.heroTitle}>Intelligent {"\n"}<Text style={styles.heroTitleHighlight}>Soil Analysis</Text></Text>
            <Text style={styles.heroSubtitle}>Unlock your soil's potential with machine learning predictions and expert preservation plans.</Text>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Prediction')}
            >
              <Text style={styles.primaryButtonText}>Start Analysis</Text>
              <ChevronRight color="#fff" size={20} />
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Why SOIL.AI Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why SOIL.AI?</Text>
        <Text style={styles.sectionDesc}>Our proprietary analysis engine utilizes advanced AI to deliver accuracy beyond traditional methods.</Text>
        
        {whyFeatures.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.featureIcon}>{f.icon}</View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureSubtitle}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Stats/Quick Actions */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Beaker color="#2e7d32" size={28} />
          <Text style={styles.statValue}>12+</Text>
          <Text style={styles.statLabel}>Parameters</Text>
        </View>
        <View style={styles.statBox}>
          <BarChart2 color="#2e7d32" size={28} />
          <Text style={styles.statValue}>95%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      <View style={styles.footerSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  heroContainer: { height: 450, width: '100%' },
  heroImage: { flex: 1, justifyContent: 'flex-end' },
  heroOverlay: { flex: 1, padding: 25, justifyContent: 'flex-end' },
  heroBadge: { backgroundColor: 'rgba(76, 175, 80, 0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 15, borderWidth: 1, borderColor: '#4caf50' },
  heroBadgeText: { color: '#4caf50', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', lineHeight: 42 },
  heroTitleHighlight: { color: '#4caf50' },
  heroSubtitle: { fontSize: 16, color: '#e0e0e0', marginTop: 15, marginBottom: 25, lineHeight: 24 },
  primaryButton: { backgroundColor: '#2e7d32', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, elevation: 5 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  section: { padding: 25 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  sectionDesc: { fontSize: 15, color: '#666', marginTop: 8, marginBottom: 25, lineHeight: 22 },
  featureCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  featureIcon: { backgroundColor: '#e8f5e9', padding: 12, borderRadius: 12, marginRight: 18 },
  featureTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  featureSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 30 },
  statBox: { backgroundColor: '#fff', width: (width - 65) / 2, padding: 20, borderRadius: 20, alignItems: 'center', elevation: 2 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', marginVertical: 5 },
  statLabel: { fontSize: 12, color: '#666', textTransform: 'uppercase', letterSpacing: 1 },
  footerSpacer: { height: 20 }
});
