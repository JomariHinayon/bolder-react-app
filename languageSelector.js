import React, { useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, ScrollView } from 'react-native';

export default function LanguageSelector() {
  const [modalVisible, setModalVisible] = useState(false);

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean'];

  const openLanguageOption = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Button title="Select Language" onPress={openLanguageOption} color="green" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-80 bg-white rounded-2xl p-4 shadow-lg">
            <Text className="text-lg font-bold text-center mb-4">Select a Language</Text>
            <ScrollView className="max-h-60">
              {languages.map((lang, index) => (
                <TouchableOpacity
                  key={index}
                  className="p-3 border-b border-gray-200 hover:bg-gray-100"
                  onPress={() => {}}
                >
                  <Text className="text-center text-base">{lang}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              className="mt-4 bg-red-500 py-2 rounded-xl"
              onPress={closeModal}
            >
              <Text className="text-center text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
