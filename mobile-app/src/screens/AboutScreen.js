import React from 'react';
import { StyleSheet, Text, View, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Info, Award, Target, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  const features = [
    {
      icon: <Award color="#2e7d32" size={24} />,
      title: 'ML Powered',
      desc: 'Utilizes Random Forest Classifier for 95%+ prediction accuracy.'
    },
    {
      icon: <Target color="#2e7d32" size={24} />,
      title: 'Precision Ag',
      desc: 'Derived from USDA and FAO agricultural standards.'
    },
    {
      icon: <Users color="#2e7d32" size={24} />,
      title: 'Community Focused',
      desc: 'Helping farmers make data-driven decisions for better yields.'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#2e7d32', '#4caf50']} style={styles.header}>
        <Info color="#fff" size={48} />
        <Text style={styles.title}>About SOIL.AI</Text>
        <Text style={styles.subtitle}>Version 1.0.0 - Intelligent Soil Analysis</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.description}>
          SOIL.AI is dedicated to empowering farmers and agronomists with advanced machine learning 
          tools to optimize soil health and agricultural productivity. Our proprietary analysis 
          engine utilizes a Random Forest Classifier trained on thousands of soil profiles to 
          deliver accuracy beyond traditional methods.
        </Text>

        <View style={styles.featuresList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={styles.iconBox}>{f.icon}</View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why it matters?</Text>
          <Text style={styles.cardText}>
            Soil health is the foundation of sustainable agriculture. By monitoring parameters like 
            Nitrogen, Phosphorus, and pH, we can prevent land degradation and ensure food security 
            for the future.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 40, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  subtitle: { fontSize: 14, color: '#e8f5e9', marginTop: 5 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32', marginBottom: 15 },
  description: { fontSize: 15, color: '#555', lineHeight: 24, marginBottom: 25 },
  featuresList: { marginBottom: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 2 },
  iconBox: { backgroundColor: '#e8f5e9', padding: 12, borderRadius: 10, marginRight: 15 },
  featureTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  featureDesc: { fontSize: 13, color: '#666', marginTop: 2 },
  card: { backgroundColor: '#2e7d32', padding: 20, borderRadius: 15, marginTop: 10 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cardText: { color: '#e8f5e9', fontSize: 14, lineHeight: 22 }
});
