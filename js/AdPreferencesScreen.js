import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button, Linking, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { requestConsentInfoUpdate, showConsentForm, ConsentStatus } from 'react-native-google-mobile-ads';
import styles from '../styles/adPreferenceStyle';
import { BannerAd, BannerAdSize, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { adBannerID, rewardedAdUnitId } from '../src/constants/adUnits'; 
import { Ionicons } from '@expo/vector-icons';


// Function to load GDPR consent status
async function loadGDPRPreference() {
  try {
    const value = await AsyncStorage.getItem('gdpr_consent');
    return value !== null ? JSON.parse(value) : true;
  } catch (error) {
    console.error('Error loading GDPR preference:', error);
    return true;
  }
}

// Function to save GDPR consent status
const saveGDPRPreference = async (isPersonalized) => {
  try {
    await AsyncStorage.setItem('gdpr_consent', JSON.stringify(isPersonalized));
  } catch (error) {
    console.error('Error saving GDPR preference:', error);
  }
};

const AdPreferencesScreen = () => {
  const { t } = useTranslation(); // Add useTranslation hook
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
    <View style={styles.container}>
      <View style={styles.descCon}>
        <Text style={styles.description}>{t('adPrefDesc')}</Text>
      </View>




      <View style={styles.switchCon}>
        <Text style={styles.switchText}>{t('enablePersonalized')}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#black' }}
          value={isPersonalized}
          onValueChange={toggleGDPRConsent}
        />
      </View>

      <TouchableOpacity   style={styles.resetButton} onPress={resetAdConsent}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }} >
            <Ionicons style={styles.icon} name="refresh-outline" />
            <Text style={styles.resetContent}>{t('resetConsent')}</Text>
          </View>
      </TouchableOpacity>


      <TouchableOpacity style={styles.linkButtons} onPress={() => Linking.openURL('https://policies.google.com/technologies/ads')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }} >
          <Ionicons style={styles.linkIcon} name="logo-google" />
          <Text style={styles.linkText}>{t('googleAdPolicy')}</Text>
            </View>
          <Ionicons style={styles.linkIcon} name="open-outline" />
      </TouchableOpacity>



      <View style={styles.bannerAd}>
          <BannerAd
          unitId={adBannerID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            networkExtras: {
              collapsible: "bottom",
            }
          }}
         
        />
      </View>

    </View>
  );
};


export default AdPreferencesScreen;
