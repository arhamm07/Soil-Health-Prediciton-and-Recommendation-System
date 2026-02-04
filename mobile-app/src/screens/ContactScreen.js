import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Mail, Phone, MapPin, Globe, MessageSquare } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContactScreen() {
  const contactInfo = [
    { icon: <Mail color="#2e7d32" size={24} />, label: 'Email Us', value: 'support@soilhealth.ai', action: () => Linking.openURL('mailto:support@soilhealth.ai') },
    { icon: <Phone color="#2e7d32" size={24} />, label: 'Call Us', value: '+1 (555) 123-4567', action: () => Linking.openURL('tel:+15551234567') },
    { icon: <Globe color="#2e7d32" size={24} />, label: 'Website', value: 'www.soilhealth.ai', action: () => Linking.openURL('https://soilhealth.ai') },
    { icon: <MapPin color="#2e7d32" size={24} />, label: 'Location', value: 'AgriTech Innovation Hub, NY', action: null }
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#2e7d32', '#4caf50']} style={styles.header}>
        <MessageSquare color="#fff" size={48} />
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.subtitle}>We are here to help you grow better</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        {contactInfo.map((item, i) => (
          <TouchableOpacity 
            key={i} 
            style={styles.contactCard}
            onPress={item.action}
            disabled={!item.action}
          >
            <View style={styles.iconBox}>{item.icon}</View>
            <View>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>24/7 Support</Text>
          <Text style={styles.supportText}>
            Our team of agronomists is available 24/7 to assist you with your soil analysis results 
            and implementation plans.
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
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  contactCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: { backgroundColor: '#e8f5e9', padding: 12, borderRadius: 12, marginRight: 20 },
  label: { fontSize: 12, color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },
  value: { fontSize: 16, color: '#333', marginTop: 2, fontWeight: '500' },
  supportBox: { backgroundColor: '#e8f5e9', padding: 25, borderRadius: 20, marginTop: 10, borderLeftWidth: 5, borderLeftColor: '#2e7d32' },
  supportTitle: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10 },
  supportText: { fontSize: 14, color: '#444', lineHeight: 22 }
});
