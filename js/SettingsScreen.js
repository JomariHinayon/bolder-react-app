import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Modal,Linking, TouchableOpacity, Text, Alert, DevSettings , ScrollView, Image,  } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/settingsStyles';
import { BannerAd, BannerAdSize, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { adBannerID, rewardedAdUnitId } from '../src/constants/adUnits'; 
const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [cacheSize, setCacheSize] = useState('0 KB');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAboutDropdownVisible, setIsAboutDropdownVisible] = useState(false);
  const [cacheModalVisible, setCacheModalVisible] = useState(false);
  const [cacheSuccessModal, setCacheSuccessModal] = useState(false);

  const languages = [
    { code: 'en', name: t('english') },
    { code: 'es', name: t('spanish') },
    { code: 'fr', name: t('french') },
    { code: 'de', name: t('german') },
    { code: 'zh', name: t('chinese') },
    { code: 'jp', name: t('japanese') },
    { code: 'kr', name: t('korean') },
    { code: 'th', name: t('thai') },  
  ];

  useEffect(() => {
    navigation.setOptions({
      handleLanguageSelect: async (languageCode) => {
        i18n.changeLanguage(languageCode);
        setSelectedLanguage(languageCode);
        await AsyncStorage.setItem('selectedLanguage', languageCode);
        navigation.navigate('Chatbot'); 
      },
    });
  }, [navigation, i18n]);

  useEffect(() => {
    const loadSettings = async () => {
      const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }

      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (savedLanguage !== null) {
        setSelectedLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadSettings();
  }, []);

  const openLanguageModal = () => {
    setIsLanguageModalVisible(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalVisible(false);
  };

  const handleLanguageSelect = async (languageCode) => {
    i18n.changeLanguage(languageCode);
    setSelectedLanguage(languageCode);
    await AsyncStorage.setItem('selectedLanguage', languageCode);
    closeLanguageModal();
    navigation.navigate('Chatbot'); 
  };

  const toggleDarkMode = async () => {
    try {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);

      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newDarkMode));
      navigation.navigate('Chatbot', { isDarkMode: newDarkMode });
    } catch (error) {
      console.error('Error toggling dark mode:', error);
    }
  };
  

  const calculateCacheSize = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);

      let totalSize = 0;

      items.forEach(([key, value]) => {
        if (value) {
          totalSize += key.length + value.length;
        }
      });

      const sizeInKB = totalSize / 1024;
      const formattedSize = sizeInKB >= 1024
        ? `${(sizeInKB / 1024).toFixed(2)} MB`
        : `${sizeInKB.toFixed(2)} KB`;

      setCacheSize(formattedSize);
    } catch (error) {
      console.error('Error calculating cache size:', error);
    }
  };
  const [modalVisible, setModalVisible] = useState(false);

  const deleteAllChats = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const chatKeys = keys.filter((key) => key.startsWith('chatHistory_'));
      await AsyncStorage.multiRemove(chatKeys);
      await AsyncStorage.removeItem('pastChats');
      setCacheSize('0 KB');
      DevSettings.reload();
      setModalVisible(true);
    } catch (error) {
      console.error('Error deleting all chats:', error);
    }
  };
  useEffect(() => {
    calculateCacheSize();
  }, []);

  const toggleAboutDropdown = () => {
    setIsAboutDropdownVisible(!isAboutDropdownVisible);
  };

  const openAdPreferences = () => {
    navigation.navigate('AdPreferences');
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      setCacheSize('0 KB');
      setCacheModalVisible(false);
      setCacheSuccessModal(true);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (

    
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>

     <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalCon}>
            <Text style={styles.modalTit}>Delete All Chats?</Text>
            <Text style={styles.modalTxt}>This action cannot be undone.</Text>
            <View style={styles.buttonCon}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={deleteAllChats}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>





      {/* dark mode */}
      {/* <TouchableOpacity style={[styles.languageCon, isDarkMode && styles.darkSmCon]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons size={25} color={isDarkMode ? "white" : "black"} name="moon-outline" />
          <Text style={[styles.languageText, isDarkMode && styles.darkText]}>{t('darkMode')}</Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#007acd' }}
          value={isDarkMode}
          onValueChange={toggleDarkMode}
        />
      </TouchableOpacity> */}


      {/* select language */}
      <TouchableOpacity onPress={openLanguageModal} style={[styles.languageCon, isDarkMode && styles.darkSmCon]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons size={25} color={isDarkMode ? "white" : "black"} name="language-sharp" />
          <Text style={[styles.languageText, isDarkMode && styles.darkText]}>{t('language')}</Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.deleteAllCon, isDarkMode && styles.darkSmCon]}>
        <Text style={[styles.cacheSize, isDarkMode && styles.darkText]}>{cacheSize}</Text>
        <Text style={[styles.cacheText, isDarkMode && styles.darkText]}>
        {t('accumulatedSpace')}        </Text>
        <TouchableOpacity style={styles.deleteAllBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.deleteAllText}>{t('clearChatHistory')}</Text> 
        </TouchableOpacity>
      </View>

      {/* Ad Preference */}
      <TouchableOpacity onPress={openAdPreferences} style={[styles.languageCon, isDarkMode && styles.darkSmCon]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <Ionicons name="megaphone-outline" size={25}></Ionicons>
            <Text style={[styles.languageText, isDarkMode && styles.darkText]}>{t('adPref')}</Text>
          </View>
          <Ionicons size={25} color={isDarkMode ? "white" : "black"} name="arrow-forward-outline" />
      </TouchableOpacity>

      <TouchableOpacity  style={[styles.languageCon, isDarkMode && styles.darkSmCon]} onPress={() => Linking.openURL('https://www.freeprivacypolicy.com/live/7006e2b4-1355-4da7-9c48-1d40a4423475')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <Ionicons size={25} name="home-outline" />
            <Text style={[styles.languageText, isDarkMode && styles.darkText]}>{t('privacyPolicy')}</Text>
          </View>
          <Ionicons  size={25} color={isDarkMode ? "white" : "black"} name="open-outline" />
      </TouchableOpacity>

     

      
      {/* about */}
      <TouchableOpacity onPress={toggleAboutDropdown} style={[styles.languageCon, isDarkMode && styles.darkSmCon]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <Ionicons size={30} color={isDarkMode ? "white" : "black"} name="information-circle-outline" />
            <Text style={[styles.languageText, isDarkMode && styles.darkText]}>{t('about')}</Text>
          </View>
          <Ionicons size={25} color={isDarkMode ? "white" : "black"} name={isAboutDropdownVisible ? "chevron-up-sharp" : "chevron-down-sharp"} />
      </TouchableOpacity>
      {isAboutDropdownVisible && (
        <View style={[styles.dropdownContent, isDarkMode && styles.darkDropdownContent]}>
          <Image source={require('../assets/logoAI.png')} style={{ width: 90, height: 90, marginBottom:5, borderRadius: 15}} />
          <Text style={[styles.dropDownBoldText, isDarkMode && styles.darkText]}>{t('AIChatVer')}</Text>
          <Text style={[styles.dropdownText, isDarkMode && styles.darkText]}>{t('© 2025')}</Text>

        </View>
      )}


      {/* select language modal */}
      <Modal visible={isLanguageModalVisible} transparent={true} animationType="slide" onRequestClose={closeLanguageModal}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
             <View style={[styles.modalTitClose, isDarkMode && styles.darkModalContent]}>
                <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>{t('selectLanguage')}</Text>
                <TouchableOpacity onPress={closeLanguageModal}>
                  <Ionicons name="close-outline" size={30} color={isDarkMode ? "white" : "black"} />
                </TouchableOpacity>
             </View>
              
                <ScrollView style={styles.allLanguageCon}>

                    {languages.map((language) => (
                      <TouchableOpacity 
                        key={language.code} 
                        style={[
                          styles.languageItem, 
                          isDarkMode && styles.darkLanguageItem, 
                          selectedLanguage === language.code && (isDarkMode ? styles.selectedDarkLanguageItem : styles.selectedLanguageItem),
                        ]} 
                        onPress={() => handleLanguageSelect(language.code)}
                      >
                        <Text style={[
                          styles.languageText, 
                          isDarkMode && styles.darkText, 
                          selectedLanguage === language.code && (isDarkMode ? styles.selectedDarkLanguageText : styles.selectedLanguageText), 
                        ]}>
                          {language.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>

          </View>
        </View>
      </Modal>
           
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



export default SettingsScreen;