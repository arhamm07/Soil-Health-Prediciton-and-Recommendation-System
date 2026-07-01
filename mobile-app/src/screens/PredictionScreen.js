import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Beaker, Microscope, Dna, Sparkles, ChevronRight, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { predict } from '../utils/ModelInference';

// Feature names in the exact order expected by the model
const FEATURE_NAMES = ['N', 'P', 'K', 'pH', 'EC', 'OC', 'S', 'Zn', 'Fe', 'Cu', 'Mn', 'B'];

const PARAMETER_RANGES = {
  N: { min: 1, max: 500, label: 'Nitrogen' },
  P: { min: 0.1, max: 150, label: 'Phosphorus' },
  K: { min: 5, max: 1000, label: 'Potassium' },
  pH: { min: 0.5, max: 14, label: 'Soil pH' },
  EC: { min: 0.05, max: 3, label: 'EC' },
  OC: { min: 0.05, max: 30, label: 'Organic Carbon' },
  S: { min: 0.5, max: 50, label: 'Sulfur' },
  Zn: { min: 0.05, max: 50, label: 'Zinc' },
  Fe: { min: 0.1, max: 50, label: 'Iron' },
  Cu: { min: 0.05, max: 5, label: 'Copper' },
  Mn: { min: 0.1, max: 40, label: 'Manganese' },
  B: { min: 0.05, max: 5, label: 'Boron' }
};

// Fertility class labels
const FERTILITY_CLASSES = {
  0: "Less Fertile",
  1: "Fertile",
  2: "Highly Fertile"
};

// Recommended actions based on fertility class
const RECOMMENDATIONS = {
  0: {
    "title": "Soil Improvement Plan for Less Fertile Soil",
    "description": "Your soil requires significant improvements to reach optimal fertility. Following these USDA and FAO recommended practices will help restore soil health and productivity.",
    "actions": [
      "Minimize soil disturbance: Reduce or eliminate tillage to preserve soil structure and organic matter",
      "Maximize soil cover: Plant cover crops (like clover, rye, or radishes) to protect soil from erosion and add organic matter",
      "Increase biodiversity: Implement diverse crop rotations including legumes to fix nitrogen naturally",
      "Add organic matter: Apply compost, manure, or other organic amendments to improve soil structure and nutrient content",
      "Balance soil pH: Apply lime if soil is acidic (pH < 6.0) or sulfur if alkaline (pH > 7.5) based on soil test results",
      "Address nutrient deficiencies: Apply targeted fertilizers based on soil test results, focusing on limiting nutrients",
      "Establish living roots: Maintain living plants year-round to support soil biology and nutrient cycling",
      "Implement Integrated Soil Fertility Management (ISFM): Combine organic and inorganic inputs with improved germplasm"
    ]
  },
  1: {
    "title": "Soil Maintenance Plan for Fertile Soil",
    "description": "Your soil is fertile but requires regular maintenance to sustain productivity. These science-based practices from USDA and FAO will help maintain optimal soil health.",
    "actions": [
      "Practice crop rotation: Alternate different crop families to break pest cycles and balance nutrient use",
      "Use cover crops strategically: Plant cover crops during fallow periods to maintain soil coverage and add organic matter",
      "Maintain organic matter levels: Add compost or incorporate crop residues to support soil biology",
      "Monitor and maintain pH: Test soil regularly and make small adjustments to keep pH in the optimal range (6.0-7.0)",
      "Practice conservation tillage: Minimize soil disturbance to preserve soil structure and biology",
      "Apply nutrients based on crop removal: Replace only what crops remove to prevent excess or deficiency",
      "Integrate livestock if possible: Managed grazing can improve nutrient cycling and soil biology",
      "Implement buffer strips: Create vegetated areas along water bodies to prevent nutrient runoff"
    ]
  },
  2: {
    "title": "Soil Preservation Plan for Highly Fertile Soil",
    "description": "Your soil is highly fertile. Focus on preservation and sustainable practices to maintain this optimal state according to USDA and FAO guidelines.",
    "actions": [
      "Practice precision nutrient management: Apply only what crops need when they need it to prevent excess",
      "Maximize continuous living roots: Use cover crops or perennials to maintain living roots year-round",
      "Implement diverse crop rotations: Include 3+ crop types to maintain biodiversity above and below ground",
      "Monitor soil health indicators: Regularly test organic matter, biological activity, and nutrient levels",
      "Maintain soil coverage: Keep residue on soil surface or living plants growing at all times",
      "Practice no-till or minimal tillage: Avoid disturbing soil structure and biology",
      "Use nutrient budgeting: Track inputs and outputs to maintain balance and prevent accumulation",
      "Implement agroforestry practices: Integrate trees or shrubs if appropriate to enhance biodiversity and soil protection"
    ]
  }
};

export default function PredictionScreen({ navigation }) {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', pH: '', EC: '', OC: '', S: '', Zn: '', Fe: '', Cu: '', Mn: '', B: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const fillSampleData = () => {
    setFormData({
      N: '150', P: '45', K: '210', pH: '6.5', EC: '0.45', OC: '0.85',
      S: '12', Zn: '1.2', Fe: '4.5', Cu: '0.8', Mn: '2.5', B: '0.5'
    });
  };

  const prepareInputData = (data) => {
    // Convert to array in correct order and apply log transformation
    return FEATURE_NAMES.map(feature => {
      const val = parseFloat(data[feature]);
      // Apply log transformation as done in the backend
      // Handle zeros by adding a small constant
      return Math.log10(val + 1e-10);
    });
  };

  const handleSubmit = async () => {
    // Basic validation and Range check
    for (let key in formData) {
      const val = formData[key];
      if (val === '') {
        Alert.alert('Missing Info', `Please enter a value for ${PARAMETER_RANGES[key]?.label || key}`);
        return;
      }

      const numVal = parseFloat(val);
      const range = PARAMETER_RANGES[key];
      if (range) {
        if (numVal < range.min || numVal > range.max) {
          Alert.alert(
            'Invalid Value', 
            `${range.label} must be between ${range.min} and ${range.max}.`
          );
          return;
        }
      }
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      // 1. Prepare payload for local use (and ResultScreen display)
      const payload = {};
      Object.keys(formData).forEach(key => {
        payload[key] = parseFloat(formData[key]);
      });

      // 2. Prepare input array for model
      const modelInput = prepareInputData(formData);

      // 3. Run prediction (simulating async to allow UI update)
      // Use setTimeout to ensure the UI thread isn't blocked immediately if model is large
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const output = predict(modelInput);
      const endTime = Date.now();
      console.log(`Success: Inference took ${endTime - startTime}ms`);

      // Handle m2cgen output (array of probabilities for classifiers)
      let prediction;
      let confidenceScore = 0;

      if (Array.isArray(output)) {
        // Find the index of the highest probability
        const maxProb = Math.max(...output);
        prediction = output.indexOf(maxProb);
        confidenceScore = Math.round(maxProb * 100);
      } else {
        // Fallback if model returns a single class label (unlikely for classifiers but possible)
        prediction = Math.round(output);
        confidenceScore = 85; // Default if no probability
      }

      // 4. Construct result object
      const fertilityClass = FERTILITY_CLASSES[prediction] || "Unknown";
      const recommendation = RECOMMENDATIONS[prediction] || RECOMMENDATIONS[1];

      const result = {
        success: true,
        prediction: prediction,
        fertility_class: fertilityClass,
        recommendation: recommendation,
        confidence_score: confidenceScore,
        timestamp: new Date().toLocaleString()
      };

      // 5. Navigate
      navigation.navigate('Result', { 
        result: result,
        inputData: payload
      });

    } catch (error) {
      console.error("Prediction Error:", error);
      Alert.alert('Analysis Failed', 'An error occurred during local analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#2e7d32', '#4caf50']} style={styles.header}>
          <Text style={styles.headerTitle}>Soil Diagnostics</Text>
          <Text style={styles.headerSubtitle}>Enter 12 chemical parameters for analysis</Text>
        </LinearGradient>

        <View style={styles.form}>
          {/* Macronutrients */}
          <View style={styles.sectionHeader}>
            <Beaker color="#2e7d32" size={20} />
            <Text style={styles.sectionTitle}>Macronutrients</Text>
          </View>
          <View style={styles.grid}>
            <InputGroup 
              label="Nitrogen (N)" 
              name="N" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="150" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.N}
              icon={<View style={[styles.dot, {backgroundColor: '#4caf50'}]} />} 
            />
            <InputGroup 
              label="Phosphorus (P)" 
              name="P" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="45" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.P}
              icon={<View style={[styles.dot, {backgroundColor: '#81c784'}]} />} 
            />
            <InputGroup 
              label="Potassium (K)" 
              name="K" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="210" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.K}
              icon={<View style={[styles.dot, {backgroundColor: '#2e7d32'}]} />} 
            />
            <InputGroup 
              label="Sulfur (S)" 
              name="S" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="12" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.S}
              icon={<View style={[styles.dot, {backgroundColor: '#a5d6a7'}]} />} 
            />
          </View>

          {/* Micronutrients */}
          <View style={styles.sectionHeader}>
            <Microscope color="#2e7d32" size={20} />
            <Text style={styles.sectionTitle}>Micronutrients</Text>
          </View>
          <View style={styles.grid}>
            <InputGroup 
              label="Zinc (Zn)" 
              name="Zn" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="1.2" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.Zn}
              icon={<View style={[styles.dot, {backgroundColor: '#ffb74d'}]} />} 
            />
            <InputGroup 
              label="Iron (Fe)" 
              name="Fe" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="4.5" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.Fe}
              icon={<View style={[styles.dot, {backgroundColor: '#ffa726'}]} />} 
            />
            <InputGroup 
              label="Copper (Cu)" 
              name="Cu" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="0.8" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.Cu}
              icon={<View style={[styles.dot, {backgroundColor: '#fb8c00'}]} />} 
            />
            <InputGroup 
              label="Manganese (Mn)" 
              name="Mn" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="2.5" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.Mn}
              icon={<View style={[styles.dot, {backgroundColor: '#f57c00'}]} />} 
            />
            <InputGroup 
              label="Boron (B)" 
              name="B" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="0.5" 
              unit="mg/kg" 
              range={PARAMETER_RANGES.B}
              icon={<View style={[styles.dot, {backgroundColor: '#ef6c00'}]} />} 
            />
          </View>

          {/* Physical Properties */}
          <View style={styles.sectionHeader}>
            <Dna color="#2e7d32" size={20} />
            <Text style={styles.sectionTitle}>Physical Properties</Text>
          </View>
          <View style={styles.grid}>
            <InputGroup 
              label="Soil pH" 
              name="pH" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="6.5" 
              range={PARAMETER_RANGES.pH}
              icon={<View style={[styles.dot, {backgroundColor: '#4fc3f7'}]} />} 
            />
            <InputGroup 
              label="EC" 
              name="EC" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="0.45" 
              unit="dS/m" 
              range={PARAMETER_RANGES.EC}
              icon={<View style={[styles.dot, {backgroundColor: '#29b6f6'}]} />} 
            />
            <InputGroup 
              label="Org. Carbon" 
              name="OC" 
              formData={formData} 
              onInputChange={handleInputChange} 
              placeholder="0.85" 
              unit="%" 
              range={PARAMETER_RANGES.OC}
              icon={<View style={[styles.dot, {backgroundColor: '#039be5'}]} />} 
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.sampleButton} onPress={fillSampleData}>
              <Sparkles color="#2e7d32" size={20} />
              <Text style={styles.sampleButtonText}>Sample Data</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <LinearGradient colors={['#2e7d32', '#4caf50']} style={styles.gradientButton}>
                  <Text style={styles.submitButtonText}>Run Analysis</Text>
                  <ChevronRight color="#fff" size={20} />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footerSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const InputGroup = ({ label, name, icon, placeholder, unit, range, formData, onInputChange }) => {
  const isOutOfRange = formData[name] !== '' && range && (parseFloat(formData[name]) < range.min || parseFloat(formData[name]) > range.max);
  
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
      <View style={[styles.inputContainer, isOutOfRange && styles.inputError]}>
        <View style={styles.inputIcon}>{icon}</View>
        <TextInput
          style={styles.input}
          value={formData[name]}
          onChangeText={(val) => onInputChange(name, val)}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
      </View>
      {range && (
        <Text style={[styles.rangeInfo, isOutOfRange && styles.rangeErrorText]}>
          Range: {range.min} - {range.max}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 30, paddingBottom: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#e8f5e9', marginTop: 5 },
  form: { padding: 20, marginTop: -30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  inputWrapper: { width: '48%', marginBottom: 15 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  unit: { fontSize: 10, color: '#999' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 12, height: 50 },
  inputError: { borderColor: '#d32f2f', backgroundColor: '#fff8f8' },
  inputIcon: { marginRight: 10 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  input: { flex: 1, color: '#333', fontSize: 16, fontWeight: '500' },
  rangeInfo: { fontSize: 10, color: '#999', marginTop: 4, marginLeft: 2 },
  rangeErrorText: { color: '#d32f2f', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  sampleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 15, borderWidth: 2, borderColor: '#2e7d32', height: 60 },
  sampleButtonText: { color: '#2e7d32', fontWeight: 'bold', marginLeft: 8 },
  submitButton: { flex: 1.5, height: 60, borderRadius: 15, overflow: 'hidden' },
  gradientButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  footerSpacer: { height: 40 }
});
