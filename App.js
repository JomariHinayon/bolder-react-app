import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_OPENAI_API_KEY } from '@env';
import { useTranslation, I18nextProvider } from 'react-i18next'; 
import i18n from './i18n'; 
import { NavigationContainer } from '@react-navigation/native';
import SettingsScreen from './SettingsScreen'; 
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import styles from './styles/appStyles';

const Stack = createStackNavigator();

const ChatbotComponent = ({ navigation, route }) => {
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
  const [isDarkMode, setIsDarkMode] = useState(route.params?.isDarkMode || false);
  const [isAdModalVisible, setIsAdModalVisible] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [dailyCredits, setDailyCredits] = useState(10); // Initialize daily credits

  // Refs and constants
  const sideMenuWidth = Dimensions.get('window').width * 0.75;
  const sideMenuAnim = useState(new Animated.Value(-sideMenuWidth))[0];
  const rightMenuOpacity = useState(new Animated.Value(0))[0];

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
    loadSettings();
    loadMessageCount();
    loadDailyCredits();
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

  // Load saved settings
  const loadSettings = async () => {
    const savedDarkMode = await AsyncStorage.getItem('isDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  };

  const loadMessageCount = async () => {
    try {
      const storedCount = await AsyncStorage.getItem('messageCount');
      if (storedCount !== null) {
        setMessageCount(parseInt(storedCount, 10));
      }
    } catch (error) {
      console.error('Error loading message count:', error);
    }
  };

  const incrementMessageCount = async () => {
    try {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      await AsyncStorage.setItem('messageCount', newCount.toString());
    } catch (error) {
      console.error('Error incrementing message count:', error);
    }
  };

  // Load daily credits from AsyncStorage
  const loadDailyCredits = async () => {
    try {
      const storedCredits = await AsyncStorage.getItem('dailyCredits');
      const lastReset = await AsyncStorage.getItem('lastReset');
      const now = new Date();

      if (storedCredits && lastReset) {
        const lastResetDate = new Date(lastReset);
        if (now.getDate() !== lastResetDate.getDate()) {
          // Reset credits if the date has changed
          setDailyCredits(10);
          await AsyncStorage.setItem('dailyCredits', '10');
          await AsyncStorage.setItem('lastReset', now.toISOString());
        } else {
          setDailyCredits(parseInt(storedCredits, 10));
        }
      } else {
        // Initialize credits and last reset date if not set
        setDailyCredits(10);
        await AsyncStorage.setItem('dailyCredits', '10');
        await AsyncStorage.setItem('lastReset', now.toISOString());
      }
    } catch (error) {
      console.error('Error loading daily credits:', error);
    }
  };

  // Decrement daily credits
  const decrementDailyCredits = async () => {
    try {
      const newCredits = dailyCredits - 1;
      setDailyCredits(newCredits);
      await AsyncStorage.setItem('dailyCredits', newCredits.toString());
    } catch (error) {
      console.error('Error decrementing daily credits:', error);
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
          model: 'gpt-4o-mini',
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
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: t('translatePrompt', { language: targetLanguage }), 
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
    if (!userInput.trim() || dailyCredits <= 0) return; // Don't send empty messages or if no credits left

    // Decrement daily credits
    await decrementDailyCredits();

    // Add user message to the messages array
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput(''); // Clear the input field

    // Increment message count
    await incrementMessageCount();

    // Generate AI response
    setIsTyping(true);
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
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

  const openSideMenu = () => {
    setIsSideMenuVisible(true);
    setSideMenuButtonText(t('close')); // Localized close text
  
    Animated.parallel([
      Animated.timing(sideMenuAnim, {
        toValue: 0,            
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rightMenuOpacity, {
        toValue: 1,           
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  

  // Close side menu with animation
  const closeSideMenu = () => {
    setSideMenuButtonText(t('open'));
  
    // Slide out Left Menu
    Animated.timing(sideMenuAnim, {
      toValue: -sideMenuWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  
    // Fade out Right Menu
    Animated.timing(rightMenuOpacity, {
      toValue: 0, 
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsSideMenuVisible(false));
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

  const toggleAdModal = () => {
    setIsAdModalVisible(!isAdModalVisible);
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
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={[styles.upperCon, selectedChat === chatTitle && styles.highlight, isDarkMode && styles.darkUpper]}>
          <TouchableOpacity onPress={toggleSideMenu}>
            <Ionicons name="reorder-three-outline" size={40} color={isDarkMode ? "white" : "black"}></Ionicons>
          </TouchableOpacity>
          {/* <Text style={styles.chatTitle}>{chatTitle} </Text> */}
          <Text style={[styles.mainLogo, isDarkMode && styles.darkText]}>AI Bolder</Text>
          <TouchableOpacity style={styles.adBtn} onPress={toggleAdModal}>
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
              <Text style={[styles.loadMoreText, isDarkMode && styles.darkBlueText]}>{t('seeMoreMessages')}</Text> 
            </TouchableOpacity>
          )}

          {messages.map((msg, index) => (
            <View
            key={index}
            style={[
              styles.message,
              msg.role === 'user' ? styles.userMessage : styles.botMessage,
              isDarkMode && (msg.role === 'user' ? styles.darkUserMessage : styles.darkBotMessage)
            ]}
          >
            <Text
              style={[
                {
                  color: isDarkMode 
                    ? 'white'                             // Dark mode: both texts white
                    : msg.role === 'user' 
                      ? 'white'                          // Light mode: user text white
                      : 'black'                          // Light mode: bot text black
                },
                styles.languageText,
                isDarkMode && styles.darkText
              ]}
            >
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


              {dailyCredits > 0 ? (
                      <View style={[styles.typeCon, isDarkMode && styles.darkTypeCon]}>
                        <TextInput style={styles.input} value={userInput} onChangeText={setUserInput} placeholder={t('writeAMessage')} 
                          placeholderTextColor="white"/>
                        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} title={t('send')} >
                          <Image source={require('./assets/sendIcon.png')} style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>
                      </View>             
                ) : (
                  <TouchableOpacity style={[styles.noTypeCon,  isDarkMode && styles.darkNoTypeCon]} onPress={toggleAdModal}>
                    <Text style={[styles.watchAdsText, isDarkMode && styles.darkWatchAdsText]}>{t('lowCredits')}</Text>
                  </TouchableOpacity>   
              
                )}




        </View>



        
        {/* Side Menu */}
        {isSideMenuVisible && (
          <View style={styles.sideMenu}>
            <Animated.View style={[styles.leftMenu, isDarkMode && styles.darkLeftMenu, { transform: [{ translateX: sideMenuAnim } ] }]}>
              <View style={styles.firstColumn}>
              <Text style={[styles.titleLogo, isDarkMode && styles.darkText]}>AI Bolder</Text>
              <TouchableOpacity onPress={closeSideMenu}>
                <Ionicons name="close-outline" size={30} color={isDarkMode ? "white" : "black"} />
              </TouchableOpacity>
              </View>
              {/* Second Column: + New Chat Button */}
              <View style={[styles.secondColumn, isDarkMode && styles.darksecondColumn]}>
                <TouchableOpacity onPress={newChat} style={styles.fullButton}>
                  <Ionicons name="add" size={20}  color={isDarkMode ? "#007acd" : "#41b7ec"} />
                  <Text style={[styles.newChatText, isDarkMode && styles.darkBlueText]} >{t('newChat')}</Text>
                </TouchableOpacity>
              </View>
              {/* Third Column: Ads Box */}
              <View style={styles.adsBox}>
                {dailyCredits > 0 ? (
                  <Text style={[styles.adsText, isDarkMode && styles.darkText]}>{t('availableCredits')} ({dailyCredits})</Text>
                ) : (
                 
                  <Text style={[styles.watchAdsText, isDarkMode && styles.darkWatchAdsText]}>{t('noCreditsCount')}</Text>

                )}
              </View>

              <View style={[styles.chatHistory, isDarkMode && styles.darkChatHistory]}>
                <Ionicons name="chatbox-ellipses-outline" size={20} color={isDarkMode ? "white" : "black"}                ></Ionicons>
                <Text style={[styles.chatHistoryTitle, isDarkMode && styles.darkText]}>{t('chatHistory')}</Text>
              </View>
          
              <FlatList
                  data={pastChats}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => loadChat(item)}
                      onLongPress={() => handleLongPress(item)}
                      style={styles.chatItemContainer} >
                      <View style={styles.chatContent}>
                        <View style={styles.row}>
                          <Text
                            style={[styles.pastChatItem, isDarkMode && styles.darkText, selectedChat === item && styles.highlightChatItem]}
                            >
                            {item}
                          </Text>
                          <View style={[styles.ellipsisContainer, isDarkMode && styles.darkEllipsisContainer]}>
                            <TouchableOpacity onPress={() => toggleDeleteButton(item)} style={styles.ellipsisIcon}>
                              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
                            </TouchableOpacity>
                          </View>
                        </View>




                        {/* Floating Delete & Clear Buttons */}
                        {selectedChat === item && deleteButtonVisible && (
                          <View style={[styles.floatingMenu, isDarkMode && styles.darkFloatingMenu]}>
                            <TouchableOpacity onPress={() => deleteChat(item)} style={[styles.floatingButton, isDarkMode && styles.darkFloatingButton]}>
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
                <View style={[styles.settings, isDarkMode && styles.darkSettings]}>
                  <Ionicons size={25} color="white" name="settings-outline" />
                  <Text style={{ marginLeft: 10, color: 'white', size: '14', fontWeight: 'bold' }}>{t('settings')}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.rightMenu, isDarkMode && styles.darkRightMenu, { opacity: rightMenuOpacity }]}>

              
            </Animated.View>

          </View>
        )}

        {/* Ad modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isAdModalVisible}
          onRequestClose={toggleAdModal}
        >
          <View style={styles.adModalBg}>
            <View style={styles.adModalCon}>
              {/* <Text style={styles.modalText}>{t('adModalContent')}</Text> */}
              <TouchableOpacity onPress={toggleAdModal} style={styles.adCloseButton}>
                <Ionicons name="close-outline" size={25} color={isDarkMode ? "black" : "white"} />
              </TouchableOpacity>
              <View style={styles.adUpperCon}>
                 
              </View>
              
              <View style={styles.adLowerCon}>
                <Text style={styles.adModalText}>{t('adAvailableCredits')}</Text>
                <Text style={styles.modalSecText}>{t('watchAdsToGain')}</Text>

              </View>


            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

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