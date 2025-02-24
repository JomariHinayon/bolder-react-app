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
import { useTranslation, I18nextProvider } from 'react-i18next'; // Import I18nextProvider
import i18n from './i18n'; // Import your i18n configuration
import { NavigationContainer } from '@react-navigation/native';
import SettingsScreen from './SettingsScreen'; // Import the settings screen
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Stack = createStackNavigator();

const ChatbotComponent = ({ navigation }) => {
  const { t, i18n } = useTranslation(); // Use the translation hook

  // State variables
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('welcome') }, // Use localized welcome message
  ]);
  const [userInput, setUserInput] = useState('');
  const [chatTitle, setChatTitle] = useState(t('chatTitle')); // Use localized chat title
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [sideMenuButtonText, setSideMenuButtonText] = useState(t('sideMenu')); // Use localized side menu text
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
    { code: 'en', name: t('english') }, // Use localized language names
    { code: 'es', name: t('spanish') },
    { code: 'fr', name: t('french') },
    { code: 'de', name: t('german') },
    { code: 'zh', name: t('chinese') },
  ];

  // Load past chats and language preference on component mount
  useEffect(() => {
    loadPastChats();
    loadLanguage();
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

  // Load saved language preference
  const loadLanguage = async () => {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // Change the app's language
      setSelectedLanguage(savedLanguage);
    }
  };

  // Save chat history to AsyncStorage
  const saveChatHistory = async (chatHistory, title) => {
    try {
      await AsyncStorage.setItem(`chatHistory_${title}`, JSON.stringify(chatHistory));
      await savePastChat(title); // Save the title to past chats
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

  const generateChatTitle = async (firstMessage) => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions', // Fixed typo in the URL
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: t('generateTitlePrompt') }, // Use localized prompt
            { role: 'user', content: firstMessage },
          ],
          max_tokens: 20,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const generatedTitle = res.data.choices[0].message.content.trim();
      return generatedTitle || t('chatTitle'); // Use localized fallback title
    } catch (error) {
      console.error('Error generating chat title:', error.response?.data || error.message); // Log full error details
      return t('chatTitle'); // Use localized fallback title
    }
  };

  // Translate text using OpenAI GPT
  const translateText = async (text, targetLanguage) => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: t('translatePrompt', { language: targetLanguage }), // Use localized prompt
            },
            { role: 'user', content: text },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      return res.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error translating text:', error);
      return text; // Return the original text if translation fails
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return; // Don't send empty messages

    // Add user message to the messages array
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput(''); // Clear the input field

    // Generate AI response
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

      // Add AI response to the messages array
      const botReply = res.data.choices[0].message.content;
      const updatedMessages = [...newMessages, { role: 'assistant', content: botReply }];
      setMessages(updatedMessages);

      // Generate chat title if it's the first user message
      if (messages.length === 1) {
        const generatedTitle = await generateChatTitle(userInput);
        setChatTitle(generatedTitle);
      }

      await saveChatHistory(updatedMessages, chatTitle);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      const errorMessages = [...newMessages, { role: 'assistant', content: t('errorMessage') }];
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
    setSideMenuButtonText(t('close')); // Use localized close text
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
      setSideMenuButtonText(t('sideMenu')); // Use localized side menu text
    });
  };

  // Start a new chat
  const newChat = async () => {
    if (messages.length > 1) {
      await saveChatHistory(messages, chatTitle);
    }
    setMessages([{ role: 'assistant', content: t('welcome') }]); // Use localized welcome message
    setChatTitle(t('newConversation')); // Use localized new conversation text
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
        setMessages([{ role: 'assistant', content: t('welcome') }]); // Use localized welcome message
        setChatTitle(t('chatTitle')); // Use localized chat title
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
      setMessages([{ role: 'assistant', content: t('welcome') }]); // Use localized welcome message
      setChatTitle(t('chatTitle')); // Use localized chat title
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
      t('deleteAllChatsTitle'), // Use localized delete all chats title
      t('deleteAllChatsMessage'), // Use localized delete all chats message
      [
        {
          text: t('cancel'), // Use localized cancel text
          style: 'cancel',
        },
        {
          text: t('delete'), // Use localized delete text
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const chatKeys = keys.filter((key) => key.startsWith('chatHistory_'));
              await AsyncStorage.multiRemove(chatKeys);
              await AsyncStorage.removeItem('pastChats');
              setPastChats([]);
              setMessages([{ role: 'assistant', content: t('welcome') }]); // Use localized welcome message
              setChatTitle(t('chatTitle')); // Use localized chat title
              alert(t('deleteAllChatsSuccess')); // Use localized success message
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
  const handleLanguageSelect = async (languageCode) => {
    // Update the selected language
    i18n.changeLanguage(languageCode); // Change the app's language
    setSelectedLanguage(languageCode);

    // Translate all messages in the chat history
    const translatedMessages = await Promise.all(
      messages.map(async (msg) => {
        const translatedContent = await translateText(msg.content, languageCode);
        return { ...msg, content: translatedContent };
      })
    );

    // Update the chat history with translated messages
    setMessages(translatedMessages);

    // Save the selected language to AsyncStorage
    await AsyncStorage.setItem('selectedLanguage', languageCode);

    // Close the language selection modal
    closeLanguageModal();
  };

  const toggleDeleteButton = (item) => {
    if (selectedChat === item && deleteButtonVisible) {
      setDeleteButtonVisible(false);
      setSelectedChat(null);
    } else {
      setSelectedChat(item);
      setDeleteButtonVisible(true);
    }
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
        <View style={[styles.upperCon, selectedChat === chatTitle && styles.highlight]}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Ionicons name="reorder-three-outline" size={40} color="black"></Ionicons>
          </TouchableOpacity>
          {/* <Text style={styles.chatTitle}>{chatTitle} </Text> */}
          <Text style={styles.mainLogo}>AI Bolder</Text>
          <TouchableOpacity style={styles.adBtn}>
             <Image source={require('./assets/gift.png')} style={{ width: 40, height: 40 }} />
           </TouchableOpacity>


        </View>
        <ScrollView
          style={styles.chatBox}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef}
        >

          {/* load more */}
          {showLoadMore && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreMessages}>
              <Text style={styles.loadMoreText}>{t('See more messages')}</Text> 
            </TouchableOpacity>
          )}

          {messages.map((msg, index) => (
         <View
            key={index}
            style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.botMessage]}
          >
            <Text style={{ color: msg.role === 'user' ? 'white' : 'black' }}>
              {msg.content}
            </Text>
          </View>
          
          ))}
          {isTyping && (
            <View style={styles.typingIndicator}>
              <Animatable.Text animation="pulse" iterationCount="infinite" duration={500} style={styles.dot}>
                .
              </Animatable.Text>
              <Animatable.Text animation="pulse" iterationCount="infinite" delay={100} duration={500} style={styles.dot}>
                .
              </Animatable.Text>
              <Animatable.Text animation="pulse" iterationCount="infinite" delay={200} duration={500} style={styles.dot}>
                .
              </Animatable.Text>
            </View>
          )}
        </ScrollView>

        {/* typing section */}
        <View style={styles.inputContainer}>
           <View style={styles.typeCon}>
            <TextInput
              style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder={t('Write a message ...')} 
            placeholderTextColor="white"/>
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} title={t('send')}>
              <Image source={require('./assets/sendIcon.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
          {/* <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder={t('Type here ...')} 
            placeholderTextColor="white"/>
          <View style={styles.roundButtonContainer}>
            <Button style={styles.roundButton} onPress={sendMessage} title={t('send')} /> 
          </View> */}
            </View>

        </View>
        
        {/* Side Menu */}
        {isSideMenuVisible && (
          <Animated.View style={[styles.sideMenu, { transform: [{ translateX: sideMenuAnim }] }]}>
             <View style={styles.firstColumn}>
             <Text style={styles.titleLogo}>AI Bolder</Text>
            <TouchableOpacity onPress={closeSideMenu}>
          <Ionicons name="close-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Second Column: + New Chat Button */}
      <View style={styles.secondColumn}>
        <TouchableOpacity onPress={newChat} style={styles.fullButton}>
          <Ionicons name="add" size={20} color="#41b7ec" />
          <Text style={styles.newChatText}>{t('New chat')}</Text>
        </TouchableOpacity>
      </View>

      {/* Third Column: Ads Box */}

      <View style={styles.adsBox}>
        <Text style={styles.adsText}>{t('Available Credits: 10')}</Text>
      </View>


      <View style={styles.chatHistory}>
         <Ionicons name="chatbox-ellipses-outline" size={20}></Ionicons>
         <Text style={styles.chatHistoryTitle}>{t('Chat history')}</Text>
      </View>
    
      <FlatList
          data={pastChats}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => loadChat(item)}
              onLongPress={() => handleLongPress(item)}
              style={styles.chatItemContainer}
            >
              <View style={styles.chatContent}>
                <View style={styles.row}>
                  {/* Text that can extend under the ellipsis */}
                  <Text
                    style={[styles.pastChatItem, selectedChat === item && styles.highlightChatItem]}
                    >
                    {item}
                  </Text>
                  <View style={styles.ellipsisContainer}>
                    <TouchableOpacity onPress={() => toggleDeleteButton(item)} style={styles.ellipsisIcon}>
                      <Ionicons name="ellipsis-vertical" size={20} color="#555" />
                    </TouchableOpacity>
                  </View>
                </View>




                {/* Floating Delete & Clear Buttons */}
                {selectedChat === item && deleteButtonVisible && (
                  <View style={styles.floatingMenu}>
                    <TouchableOpacity onPress={() => deleteChat(item)} style={styles.floatingButton}>
                      <Text style={styles.deleteText}>{t('delete')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => clearConversation(item)} style={styles.floatingButton}>
                      <Text style={styles.clearText}>{t('clear')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: 5 }}
          style={{ maxHeight: '78%' }}
        />


        
           
            {/* settings */}
            <TouchableOpacity onPress={() => navigation.navigate('Settings', { handleLanguageSelect, deleteAllChats })}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                borderTopWidth: 2, 
                borderColor: '#F2F2F2', 
                padding: 10,
                backgroundColor: 'black',
                backgroundColorOpacity: 0.1,
              }}>
                <Ionicons size={25} color="white" name="settings-outline" />
                <Text style={{ marginLeft: 10, color: 'white', size: '14', fontWeight: 'bold' }}>Settings</Text>
              </View>
            </TouchableOpacity>


          </Animated.View>
        )}
       
      </View>
    </TouchableWithoutFeedback>
  );
};

// Wrap the ChatbotComponent with I18nextProvider and NavigationContainer
const Chatbot = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Chatbot">
          <Stack.Screen name="Chatbot" component={ChatbotComponent} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: '12%', padding: 2, backgroundColor: 'white', overflow: 'hidden' },
  chatBox: { flex: 1, marginBottom: '4%', padding: 10 },
  firstColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '',
    height: 55,
  },
  secondColumn: {
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    backgroundColor: '#f2fafe', // Background color
    height: 45,
    borderRadius: 10, // Border radius
    borderWidth: 1, // Border width
    borderColor: '#41b7ec', // Border color
    paddingHorizontal: 10, // Optional: Add padding for better spacing
    marginBottom: 10
  },
  fullButton: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center content vertically
    justifyContent: 'start', // Center content horizontally
    width: '100%', // Make the button fill the container
    height: '100%', // Make the button fill the container
  },
  newChatText: {
    marginLeft: 10, // Space between icon and text
    fontSize: 14,
    color: '#41b7ec', // Font color
  },
  adsBox: {
    backgroundColor: '',
    borderRadius: 5,
    alignItems: 'end',
    height: 30,
    justifyContent: 'end'
  },
  adsText: {
    fontSize: 13,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  titleLogo:{
   fontSize: 20,
    fontWeight: 'bold',
  },
  chatHistoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft:5
  },

  chatHistory: {
      alignItems: 'center',
      justifyContent: 'start', 
      flexDirection: 'row',
      backgroundColor: "#f3f3f2",
      padding: 10,
      borderRadius: 10,
      overflow: 'visible',

  },
  chatItemContainer: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    width: '100%',
    overflow: 'visible', 
  },
  
  chatContent: {
    flexDirection: 'row',
    zIndex:0,
    overflow: 'visible',
    width: '100%',

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible', 
    backgroundColor: '',
    borderBottomWidth: 1,
    borderColor: '#f3f3f2',
    width: '100%'
  },
  pastChatItem: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    elevation: 1,
    overflow: 'visible',

  },
  highlightChatItem: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative', // Ensures child elements position correctly
  },
  
  pastChatItem: {
    flex: 1,             
    paddingRight: 35,   
    color: '#000',        
  },
  
  ellipsisContainer: {
    position: 'absolute',  
    right: 0,           
    backgroundColor: 'white',
    padding: 5,            
    // iOS shadow
  
    zIndex: 10,            
  },
  
  
  floatingMenu: {
    position: 'absolute',
    width: 100,
    top: 0, 
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 50, 
    zIndex: 9999, 
    overflow: 'visible', 
    shadow: 'none'

  },
  
  floatingButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height:'50%',
    overflow: 'visible', 
    shadow: 'none'

    
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  clearText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  message: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#03a1e7'},
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#f3f3f2'},
  inputContainer: { flexDirection: 'row', padding: 15, alignItems: 'center', height: '11%', backgroundColor: '' },
  typeCon: { backgroundColor: '#03a1e7', justifyContent: 'center', gap: '10', alignItems: 'center', flexDirection: 'row', padding: 5, flex:1, height: 60, marginBottom: 20, borderRadius: 10,},
  input: { backgroundColor: 'transparent', color: 'white', borderRadius: 10, width: 320, padding: 10 },
  roundButtonContainer: { borderRadius: 30, height: 55, width: 55, backgroundColor: '', justifyContent: 'center', alignItems: 'center' },
  upperCon: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '9%', backgroundColor: 'white', padding: 20 },
  mainLogo: { fontSize: 20, fontWeight: 'bold', color: 'black', textAlign: 'center', flex: 1 },
  chatTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', textAlign: 'center', flex: 1 },
  sideMenu: { position: 'absolute', justifyContent: 'center', width: '75%', backgroundColor: 'white', padding: 20, marginTop: '12%', zIndex: 1000, height: '100%' },
  pastChatsTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  pastChatItem: { padding: 10, fontSize: 16,  borderBottomColor: '#ccc' },
  deleteButtonContainer: { padding: 5, backgroundColor: 'red', borderRadius: 5 },
  typingIndicator: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%', alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  loadMoreButton: {
    backgroundColor: '',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#03a1e7',
    fontWeight: 'bold',
  },
  highlightChatItem: {
    backgroundColor: '',
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
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  typingText: {
    fontSize: 16,
    color: 'gray',
  },
  dot: {
    fontSize: 50,
    color: '#cdcdcc',
    marginLeft: 1,
  },
});