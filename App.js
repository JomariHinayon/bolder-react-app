import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_OPENAI_API_KEY } from '@env';

const Chatbot = () => {
  // State variables
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [chatTitle, setChatTitle] = useState('AI Conversation');
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [sideMenuButtonText, setSideMenuButtonText] = useState('Side Menu');
  const [pastChats, setPastChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [deleteButtonVisible, setDeleteButtonVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [olderMessages, setOlderMessages] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [cacheSize, setCacheSize] = useState(0);

  // Refs and constants
  const sideMenuWidth = Dimensions.get('window').width * 0.75;
  const sideMenuAnim = useState(new Animated.Value(-sideMenuWidth))[0];
  const deleteButtonRef = useRef(null);
  const scrollViewRef = useRef(null);

  // List of supported languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
  ];

  // Load past chats on component mount
  useEffect(() => {
    loadPastChats();
  }, []);

  // Scroll to the end of the chat when messages update
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Calculate cache size
  useEffect(() => {
    const fetchCacheSize = async () => {
      const size = await calculateCacheSize();
      setCacheSize(size);
    };
    fetchCacheSize();
  }, []);

  // Save chat history to AsyncStorage
  const saveChatHistory = async (chatHistory, title) => {
    try {
      await AsyncStorage.setItem(`chatHistory_${title}`, JSON.stringify(chatHistory));
      await savePastChat(title);
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Load chat history from AsyncStorage
  const loadChatHistory = async (title) => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chatHistory_${title}`);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages.slice(-10));
        setOlderMessages(parsedMessages.slice(0, -10));
        setShowLoadMore(parsedMessages.length > 10);
        setChatTitle(title);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Load more messages from olderMessages
  const loadMoreMessages = () => {
    if (olderMessages.length > 0) {
      const nextBatch = olderMessages.slice(-10);
      const remainingOlder = olderMessages.slice(0, -10);

      setMessages((prevMessages) => [...nextBatch, ...prevMessages]);
      setOlderMessages(remainingOlder);
      setShowLoadMore(remainingOlder.length > 0);
    }
  };

  // Save past chat title to AsyncStorage
  const savePastChat = async (title) => {
    try {
      const storedPastChats = await AsyncStorage.getItem('pastChats');
      const pastChatsArray = storedPastChats ? JSON.parse(storedPastChats) : [];
      if (!pastChatsArray.includes(title)) {
        pastChatsArray.unshift(title); // Add new chat to the beginning
        await AsyncStorage.setItem('pastChats', JSON.stringify(pastChatsArray));
        setPastChats(pastChatsArray);
      }
    } catch (error) {
      console.error('Error saving past chat:', error);
    }
  };

  // Load past chats from AsyncStorage
  const loadPastChats = async () => {
    try {
      const storedPastChats = await AsyncStorage.getItem('pastChats');
      if (storedPastChats) {
        const parsedPastChats = JSON.parse(storedPastChats);
        setPastChats(parsedPastChats);
      } else {
        setPastChats([]);
      }
    } catch (error) {
      console.error('Error loading past chats:', error);
    }
  };

  // Generate a chat title using OpenAI API
  const generateChatTitle = async (firstMessage) => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Generate a short, relevant, and interesting chat title based on this message.' },
            { role: 'user', content: firstMessage },
          ],
          max_tokens: 10,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const generatedTitle = res.data.choices[0].message.content.trim();
      return generatedTitle || 'AI Conversation';
    } catch (error) {
      console.error('Error generating chat title:', error);
      return 'AI Conversation';
    }
  };

  // Send a message to the chatbot
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');

    if (messages.length === 1) {
      const generatedTitle = await generateChatTitle(userInput);
      setChatTitle(generatedTitle);
    }

    setIsTyping(true);

    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const botReply = res.data.choices[0].message.content;
      const updatedMessages = [...newMessages, { role: 'assistant', content: botReply }];
      setMessages(updatedMessages);

      await saveChatHistory(updatedMessages, chatTitle);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      const errorMessages = [...newMessages, { role: 'assistant', content: 'Oops! Something went wrong.' }];
      setMessages(errorMessages);
      await saveChatHistory(errorMessages, chatTitle);
    } finally {
      setIsTyping(false);
    }
  };

  // Toggle side menu visibility
  const toggleSideMenu = () => {
    if (isSideMenuVisible) {
      closeSideMenu();
    } else {
      openSideMenu();
    }
  };

  // Open side menu with animation
  const openSideMenu = () => {
    setIsSideMenuVisible(true);
    setSideMenuButtonText('Close');
    Animated.timing(sideMenuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close side menu with animation
  const closeSideMenu = () => {
    Animated.timing(sideMenuAnim, {
      toValue: -sideMenuWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsSideMenuVisible(false);
      setSideMenuButtonText('Side Menu');
    });
  };

  // Start a new chat
  const newChat = async () => {
    if (messages.length > 1) {
      await saveChatHistory(messages, chatTitle);
    }
    setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
    setChatTitle('New Conversation');
    closeSideMenu();
  };

  // Load a specific chat
  const loadChat = async (title) => {
    await loadChatHistory(title);
    closeSideMenu();
    setDeleteButtonVisible(false);
    setSelectedChat(title);
  };

  // Handle long press on chat items
  const handleLongPress = (title) => {
    setSelectedChat(title);
    setDeleteButtonVisible(true);
  };

  // Delete a specific chat
  const deleteChat = async (title) => {
    try {
      await AsyncStorage.removeItem(`chatHistory_${title}`);
      const updatedPastChats = pastChats.filter((chat) => chat !== title);
      await AsyncStorage.setItem('pastChats', JSON.stringify(updatedPastChats));
      setPastChats(updatedPastChats);
      if (chatTitle === title) {
        setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
        setChatTitle('AI Conversation');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  // Clear the current conversation
  const clearConversation = async () => {
    try {
      await AsyncStorage.removeItem(`chatHistory_${chatTitle}`);
      const updatedPastChats = pastChats.filter((chat) => chat !== chatTitle);
      await AsyncStorage.setItem('pastChats', JSON.stringify(updatedPastChats));
      setPastChats(updatedPastChats);
      setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
      setChatTitle('AI Conversation');
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  // Calculate the size of the AsyncStorage cache
  const calculateCacheSize = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      let totalSize = 0;
      items.forEach(([key, value]) => {
        totalSize += key.length + value.length;
      });
      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  };

  // Delete all chats
  const deleteAllChats = async () => {
    Alert.alert(
      'Delete All Chats',
      'Are you sure you want to delete all chats? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const chatKeys = keys.filter((key) => key.startsWith('chatHistory_'));
              await AsyncStorage.multiRemove(chatKeys);
              await AsyncStorage.removeItem('pastChats');
              setPastChats([]);
              setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
              setChatTitle('AI Conversation');
              alert('All chats deleted successfully!');
            } catch (error) {
              console.error('Error deleting all chats:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Open language selection modal
  const openLanguageModal = () => {
    setIsLanguageModalVisible(true);
  };

  // Close language selection modal
  const closeLanguageModal = () => {
    setIsLanguageModalVisible(false);
  };

  // Handle language selection
  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    closeLanguageModal();
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (deleteButtonVisible) {
          setDeleteButtonVisible(false);
          setSelectedChat(null);
        }
      }}
    >
      <View style={styles.container}>
        {/* Dynamic Chat Title */}
        <View style={[styles.upperCon, selectedChat === chatTitle && styles.highlight]}>
          <Button title={sideMenuButtonText} onPress={toggleSideMenu} />
          <Text style={styles.chatTitle}>{chatTitle} </Text>
          <Button title="Clear" onPress={clearConversation} />
        </View>
        <ScrollView
          style={styles.chatBox}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef}
        >
          {showLoadMore && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreMessages}>
              <Text style={styles.loadMoreText}>Load Previous Messages</Text>
            </TouchableOpacity>
          )}
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.botMessage]}
            >
              <Text style={{ color: 'black' }}>{msg.content}</Text>
            </View>
          ))}
          {isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={{ color: 'gray' }}>AI is typing...</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Chat input"
            placeholderTextColor="white"
          />
          <View style={styles.roundButtonContainer}>
            <Button style={styles.roundButton} onPress={sendMessage} title="Send" />
          </View>
        </View>
        {/* Side Menu */}
        {isSideMenuVisible && (
          <Animated.View style={[styles.sideMenu, { transform: [{ translateX: sideMenuAnim }] }]}>
            <Button title="+" onPress={newChat} />
            <Button title="Close" onPress={closeSideMenu} />
            <Text style={styles.pastChatsTitle}>Chat history</Text>
            <FlatList
              data={pastChats}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => loadChat(item)}
                  onLongPress={() => handleLongPress(item)}
                >
                  {selectedChat === item && deleteButtonVisible ? (
                    <View ref={deleteButtonRef} style={styles.deleteButtonContainer}>
                      <Button title="Delete" onPress={() => deleteChat(item)} color="red" />
                    </View>
                  ) : (
                    <Text style={[styles.pastChatItem, selectedChat === item && styles.highlightChatItem]}>{item}</Text>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={{ padding: 20 }}
              style={{ maxHeight: '80%' }}
            />
            <Button title="Select Language" onPress={openLanguageModal} color="green" />
            <Button title="Delete All Chats" onPress={deleteAllChats} color="red" />
          </Animated.View>
        )}
        {/* Language Selection Modal */}
        <Modal
          visible={isLanguageModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeLanguageModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              {languages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={styles.languageItem}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <Text style={styles.languageText}>{language.name}</Text>
                </TouchableOpacity>
              ))}
              <Button title="Close" onPress={closeLanguageModal} />
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: '12%', padding: 2, backgroundColor: '#f5f5f5', overflow: 'hidden' },
  chatBox: { flex: 1, marginBottom: '4%', padding: 10 },
  message: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#e9e8e9', fontWeight: 'bold' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#abaaaa', fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', padding: 2, alignItems: 'center', height: '9%', backgroundColor: '#02843e' },
  input: { flex: 1, marginRight: '2%', backgroundColor: '#02843e', color: 'white', borderRadius: 10, padding: 10 },
  roundButtonContainer: { borderRadius: 30, height: 55, width: 55, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  upperCon: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '9%', backgroundColor: '#02843e', paddingHorizontal: 10 },
  chatTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', textAlign: 'center', flex: 1 },
  sideMenu: { position: 'absolute', justifyContent: 'center', width: '75%', backgroundColor: 'white', padding: 20, marginTop: '12%', zIndex: 1000, height: '100%' },
  pastChatsTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  pastChatItem: { padding: 10, fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  deleteButtonContainer: { padding: 5, backgroundColor: 'red', borderRadius: 5 },
  typingIndicator: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%', alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  loadMoreButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#02843e',
    fontWeight: 'bold',
  },
  highlightChatItem: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
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