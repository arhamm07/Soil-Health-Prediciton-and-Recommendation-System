import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share, Dimensions } from 'react-native';
import { CheckCircle, AlertTriangle, Info, Share2, Download, Table as TableIcon, Activity, Leaf, BarChart2 } from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ResultScreen({ route, navigation }) {
  if (!route.params || !route.params.result) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>No analysis data found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { result, inputData = {} } = route.params;

  const getStatusColor = (status) => {
    switch (status) {
      case 'High Fertility': return '#2e7d32';
      case 'Moderate Fertility': return '#f57c00';
      default: return '#d32f2f';
    }
  };

  const onShare = async () => {
    try {
      const recs = result.recommendation?.actions || [];
      await Share.share({
        message: `Soil Fertility Analysis Result: ${result.fertility_class}\nConfidence: ${result.confidence_score}%\nDate: ${result.timestamp}\n\nRecommendations:\n${recs.join('\n')}`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  // Prepare data for the Bar Chart (Macro/Micro nutrients)
  const chartData = {
    labels: ['N', 'P', 'K', 'pH', 'OC', 'S'],
    datasets: [{
      data: [
        inputData.N || 0,
        inputData.P || 0,
        inputData.K || 0,
        inputData.pH || 0,
        inputData.OC || 0,
        inputData.S || 0
      ]
    }]
  };

  const nutrientTable = [
    { label: 'Nitrogen (N)', value: inputData.N, unit: 'mg/kg' },
    { label: 'Phosphorus (P)', value: inputData.P, unit: 'mg/kg' },
    { label: 'Potassium (K)', value: inputData.K, unit: 'mg/kg' },
    { label: 'Soil pH', value: inputData.pH, unit: '' },
    { label: 'Organic Carbon', value: inputData.OC, unit: '%' },
    { label: 'Sulfur (S)', value: inputData.S, unit: 'mg/kg' },
    { label: 'Zinc (Zn)', value: inputData.Zn, unit: 'mg/kg' },
    { label: 'Iron (Fe)', value: inputData.Fe, unit: 'mg/kg' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Result Card */}
      <LinearGradient 
        colors={[getStatusColor(result.fertility_class), '#4caf50']} 
        style={styles.resultHeader}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Analysis Complete</Text>
        </View>
        <Text style={styles.fertilityClass}>{result.fertility_class}</Text>
        <View style={styles.confidenceRow}>
          <Activity color="#fff" size={16} />
          <Text style={styles.confidenceText}>Confidence Score: {result.confidence_score}%</Text>
        </View>
        <Text style={styles.timestamp}>{result.timestamp}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={[styles.statValue, { color: getStatusColor(result.fertility_class) }]}>
              {result.fertility_class.split(' ')[0]}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Parameters</Text>
            <Text style={styles.statValue}>12 Checked</Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart2 color="#2e7d32" size={20} />
            <Text style={styles.sectionTitle}>Nutrient Profile</Text>
          </View>
          <BarChart
            data={chartData}
            width={width - 40}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2', stroke: '#2e7d32' }
            }}
            style={styles.chart}
          />
        </View>

        {/* Parameter Table */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TableIcon color="#2e7d32" size={20} />
            <Text style={styles.sectionTitle}>Input Parameters</Text>
          </View>
          <View style={styles.table}>
            {nutrientTable.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
                <Text style={styles.tableLabel}>{item.label}</Text>
                <Text style={styles.tableValue}>{item.value} <Text style={styles.unit}>{item.unit}</Text></Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Leaf color="#2e7d32" size={20} />
            <Text style={styles.sectionTitle}>Action Plan</Text>
          </View>
          {result.recommendation?.actions ? result.recommendation.actions.map((rec, index) => (
            <View key={index} style={styles.recommendationCard}>
              <View style={styles.recIcon}>
                <CheckCircle color="#2e7d32" size={20} />
              </View>
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          )) : (
            <Text style={styles.noDataText}>No recommendations available.</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Share2 color="#fff" size={20} />
            <Text style={styles.buttonText}>Share Report</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.backButtonText}>New Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footerSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  resultHeader: { padding: 40, alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 10 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 15 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  fertilityClass: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  confidenceText: { color: '#fff', fontSize: 16, marginLeft: 8, fontWeight: '500' },
  timestamp: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 15 },
  content: { padding: 20 },
  quickStats: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 20, marginTop: -40, elevation: 4, marginBottom: 25 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#666', textTransform: 'uppercase', marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  divider: { width: 1, backgroundColor: '#eee', height: '100%' },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  chart: { borderRadius: 16, marginVertical: 8, elevation: 2 },
  table: { backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden', elevation: 2 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tableRowEven: { backgroundColor: '#fcfdfc' },
  tableLabel: { fontSize: 14, color: '#555' },
  tableValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  unit: { fontSize: 10, color: '#999', fontWeight: 'normal' },
  recommendationCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 18, borderRadius: 15, marginBottom: 12, elevation: 2, alignItems: 'flex-start' },
  recIcon: { marginTop: 2, marginRight: 15 },
  recommendationText: { flex: 1, fontSize: 15, color: '#444', lineHeight: 22 },
  actionButtons: { marginTop: 10, gap: 12 },
  shareButton: { backgroundColor: '#2e7d32', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 15, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  backButton: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 15, borderWidth: 2, borderColor: '#2e7d32' },
  backButtonText: { color: '#2e7d32', fontSize: 16, fontWeight: 'bold' },
  noDataText: { fontSize: 14, color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
  footerSpacer: { height: 40 }
});
