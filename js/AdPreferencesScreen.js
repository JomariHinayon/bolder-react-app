import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, Linking, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTranslation } from 'react-i18next';

// const AdPreferencesScreen = () => {
//   const { t } = useTranslation();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{t('da')}</Text>
//     </View>
//   );
// };


import { requestConsentInfoUpdate, showConsentForm, ConsentStatus } from 'react-native-google-mobile-ads';

// Function to load GDPR consent status
const loadGDPRPreference = async () => {
  try {
    const value = await AsyncStorage.getItem('gdpr_consent');
    return value !== null ? JSON.parse(value) : true;
  } catch (error) {
    console.error('Error loading GDPR preference:', error);
    return true;
  }
};

// Function to save GDPR consent status
const saveGDPRPreference = async (isPersonalized) => {
  try {
    await AsyncStorage.setItem('gdpr_consent', JSON.stringify(isPersonalized));
  } catch (error) {
    console.error('Error saving GDPR preference:', error);
  }
};

const AdPreferencesScreen = () => {
  const [isPersonalized, setIsPersonalized] = useState(true);

  useEffect(() => {
    const fetchGDPRPreference = async () => {
      const storedPreference = await loadGDPRPreference();
      setIsPersonalized(storedPreference);
    };
    fetchGDPRPreference();
  }, []);

  // Function to toggle ad preference
  const toggleGDPRConsent = async () => {
    const newValue = !isPersonalized;
    setIsPersonalized(newValue);
    await saveGDPRPreference(newValue);
  };

  // Function to reset ad consent (GDPR)
  const resetAdConsent = async () => {
    try {
      const consentInfo = await requestConsentInfoUpdate();
      if (consentInfo.isConsentFormAvailable) {
        const consentStatus = await showConsentForm();
        if (consentStatus === ConsentStatus.OBTAINED) {
          console.log('User consent obtained');
        } else {
          console.log('User declined consent');
        }
      }
    } catch (error) {
      console.error('Error resetting ad consent:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Ad Preferences</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Text>Enable Personalized Ads</Text>
        <Switch value={isPersonalized} onValueChange={toggleGDPRConsent} />
      </View>
      <Button title="Reset Consent" onPress={resetAdConsent} style={{ marginTop: 10 }} />
      <Button title="Privacy Policy" onPress={() => Linking.openURL('https://www.freeprivacypolicy.com/live/7006e2b4-1355-4da7-9c48-1d40a4423475')} />
      <Button title="Google Ad Policies" onPress={() => Linking.openURL('https://policies.google.com/technologies/ads')} />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default AdPreferencesScreen;
