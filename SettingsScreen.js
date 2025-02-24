import React, { useState } from 'react';
import { View, Button, StyleSheet, Modal, TouchableOpacity, Text, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    { code: 'en', name: t('english') },
    { code: 'es', name: t('spanish') },
    { code: 'fr', name: t('french') },
    { code: 'de', name: t('german') },
    { code: 'zh', name: t('chinese') },
  ];

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
    navigation.navigate('Chatbot'); // Navigate back to Chatbot to apply changes
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
              alert(t('deleteAllChatsSuccess'));
              navigation.navigate('Chatbot'); // Navigate back to Chatbot to reload the app
            } catch (error) {
              console.error('Error deleting all chats:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Button title={t('Select language')} onPress={openLanguageModal} color="green" />
      <Button title={t('Delete all chats')} onPress={deleteAllChats} color="red" />

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  languageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  languageText: {
    fontSize: 16,
  },
});
