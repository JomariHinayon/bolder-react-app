import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Modal, TouchableOpacity, Text, Alert, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [cacheSize, setCacheSize] = useState('0 KB');


  const languages = [
    { code: 'en', name: t('english') },
    { code: 'es', name: t('spanish') },
    { code: 'fr', name: t('french') },
    { code: 'de', name: t('german') },
    { code: 'zh', name: t('chinese') },
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

  const openLanguageModal = () => {
    setIsLanguageModalVisible(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalVisible(false);
  };

  const handleLanguageSelect = (languageCode) => {
    navigation.getParam('handleLanguageSelect')(languageCode);
    closeLanguageModal();
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

      // Convert bytes to KB or MB
      const sizeInKB = totalSize / 1024;
      const formattedSize = sizeInKB >= 1024
        ? `${(sizeInKB / 1024).toFixed(2)} MB`
        : `${sizeInKB.toFixed(2)} KB`;

      setCacheSize(formattedSize);
    } catch (error) {
      console.error('Error calculating cache size:', error);
    }
  };
  const deleteAllChats = async () => {
    Alert.alert(
      t('Delete all chats?'),
      t('All existing chats will be deleted'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const chatKeys = keys.filter((key) => key.startsWith('chatHistory_'));
              await AsyncStorage.multiRemove(chatKeys);
              await AsyncStorage.removeItem('pastChats');
              setCacheSize('0 KB');
              alert(t('deleteAllChatsSuccess'));
              navigation.navigate('Chatbot'); 
            } catch (error) {
              console.error('Error deleting all chats:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  useEffect(() => {
    calculateCacheSize();
  }, []);


  return (
    <View style={styles.container}>
      {/* dark mode */}
      <TouchableOpacity  style={styles.languageCon}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <Ionicons size={25} color="black" name="moon-outline" />
            <Text style={styles.languageText}>Dark Mode</Text>
          </View>
          <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
            />
      </TouchableOpacity>

      {/* select language */}
      <TouchableOpacity onPress={openLanguageModal} style={styles.languageCon}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <Ionicons size={25} color="black" name="language-sharp" />
            <Text style={styles.languageText}>Language</Text>
          </View>
          <Ionicons size={25} name="chevron-down-sharp" />
      </TouchableOpacity>



      <View style={styles.deleteAllCon}>
        <Text style={styles.cacheSize}>{cacheSize}</Text>
        <Text style={styles.cacheText}>
          This is your accumulated space from chat history.
        </Text>
        <TouchableOpacity style={styles.deleteAllBtn} onPress={deleteAllChats}>
          <Text style={styles.deleteAllText}>{t('Clear chat history')}</Text> 
        </TouchableOpacity>
      </View>

      {/* about */}
      <TouchableOpacity  style={styles.languageCon}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }} >
            <Ionicons size={30} color="black" name="information-circle-outline" />
            <Text style={styles.languageText}>About</Text>
          </View>
          <Ionicons size={25} name="chevron-down-sharp" />

      </TouchableOpacity>

      <Modal visible={isLanguageModalVisible} transparent={true} animationType="slide" onRequestClose={closeLanguageModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('Select language')}</Text>
            {languages.map((language) => (
              <TouchableOpacity key={language.code} style={styles.languageItem} onPress={() => handleLanguageSelect(language.code)}>
                <Text style={styles.languageText}>{language.name}</Text>
              </TouchableOpacity>
            ))}
            <Button title={t('close')} onPress={closeLanguageModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    justifyContent: 'start',
    alignItems: 'start',
    backgroundColor: '#f0f0f0',
    gap: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ''
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  languageCon: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out left and right items
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 10,
    
  },
  
  languageText: {
    marginLeft: 10,
    fontSize: 16,
  },
  deleteAllCon:{
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    gap: 4,
    borderRadius: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  deleteAllBtn:{
    backgroundColor: '#FF2E00',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width:200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cacheSize:{
    fontSize: 30,
    fontWeight: 'bold'
  },
  cacheText:{
    fontSize: 15,
    fontWeight: 'normal'
  },
  deleteAllText:{
    fontSize: 15,
    color: 'white'
  }
  
});
