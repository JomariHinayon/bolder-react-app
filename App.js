import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Animated, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_OPENAI_API_KEY } from '@env';
import { auto } from 'openai/_shims/registry.mjs';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! How can I help you today?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [chatTitle, setChatTitle] = useState("AI Conversation");
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [sideMenuButtonText, setSideMenuButtonText] = useState("Side Menu");
  const [pastChats, setPastChats] = useState([]);
  const sideMenuWidth = Dimensions.get('window').width * 0.75;
  const sideMenuAnim = useState(new Animated.Value(-sideMenuWidth))[0];

  useEffect(() => {
    loadPastChats();
  }, []);

  const saveChatHistory = async (chatHistory, title) => {
    try {
      await AsyncStorage.setItem(`chatHistory_${title}`, JSON.stringify(chatHistory));
      await savePastChat(title);
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };
  
  const loadChatHistory = async (title) => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chatHistory_${title}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
        setChatTitle(title);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

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
      console.error("Error saving past chat:", error);
    }
  };

  const loadPastChats = async () => {
    try {
      const storedPastChats = await AsyncStorage.getItem('pastChats');
      if (storedPastChats) {
        setPastChats(JSON.parse(storedPastChats));
      }
    } catch (error) {
      console.error("Error loading past chats:", error);
    }
  };

  const generateChatTitle = async (firstMessage) => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: "Generate a short, relevant chat title based on this message." },
            { role: 'user', content: firstMessage }
          ],
          max_tokens: 10
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const generatedTitle = res.data.choices[0].message.content.trim();
      return generatedTitle || "AI Conversation";
    } catch (error) {
      console.error("Error generating chat title:", error);
      return "AI Conversation";
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');

    if (messages.length === 1) {
      const generatedTitle = await generateChatTitle(userInput);
      setChatTitle(generatedTitle);
    }

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
            'Authorization': `Bearer ${REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const botReply = res.data.choices[0].message.content;
      const updatedMessages = [...newMessages, { role: 'assistant', content: botReply }];
      setMessages(updatedMessages);

      await saveChatHistory(updatedMessages, chatTitle);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      const errorMessages = [...newMessages, { role: 'assistant', content: "Oops! Something went wrong." }];
      setMessages(errorMessages);
      await saveChatHistory(errorMessages, chatTitle);
    }
  };

  const toggleSideMenu = () => {
    if (isSideMenuVisible) {
      closeSideMenu();
    } else {
      openSideMenu();
    }
  };

  const openSideMenu = () => {
    setIsSideMenuVisible(true);
    setSideMenuButtonText("Close");
    Animated.timing(sideMenuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSideMenu = () => {
    Animated.timing(sideMenuAnim, {
      toValue: -sideMenuWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsSideMenuVisible(false);
      setSideMenuButtonText("Side Menu");
    });
  };

  const newChat = async () => {
    if (messages.length > 1) {
      await saveChatHistory(messages, chatTitle);
    }
    setMessages([{ role: 'assistant', content: "Hello! How can I help you today?" }]);
    setChatTitle("AI Conversation");
    closeSideMenu();
  };

  const loadChat = async (title) => {
    await loadChatHistory(title);
    closeSideMenu();
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Chat Title */}
      <View style={styles.upperCon}>
        <Button title={sideMenuButtonText} onPress={toggleSideMenu} />
        <Text style={styles.chatTitle}>{chatTitle}</Text>
      </View>

      <ScrollView style={styles.chatBox} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={{ color: 'black' }}>{msg.content}</Text>
          </View>
        ))}
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
    
    <Button title="New Chat" onPress={newChat} />
    <Button title="Close" onPress={closeSideMenu} />

    <Text style={styles.pastChatsTitle}>Chat history</Text>

    <FlatList
      data={pastChats}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => loadChat(item)}>
          <Text style={styles.pastChatItem}>{item}</Text>
        </TouchableOpacity>
      )}
      
      contentContainerStyle={{ padding: 20 }}
      style={{ maxHeight: '100%' }}
    />

  </Animated.View>
)}


    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: '12%', padding: 2, backgroundColor: '#f5f5f5', overflow: 'hidden'},
  chatBox: { flex: 1, marginBottom: '4%', padding: 10 },
  message: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#e9e8e9', fontWeight: 'bold' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#abaaaa', fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', padding: 2, alignItems: 'center', height: '9%', backgroundColor: '#02843e' },
  input: { flex: 1, marginRight: '2%', backgroundColor: '#02843e', color: 'white', borderRadius: 10, padding: 10 },
  roundButtonContainer: { borderRadius: 30, height: 55, width: 55, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  upperCon: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '9%', backgroundColor: '#02843e', paddingHorizontal: 10 },
  chatTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', textAlign: 'center', flex: 1 },
  sideMenu: { position: 'absolute'  , justifyContent:'center', width: '75%', backgroundColor: 'white' ,padding: 20, marginTop:'12%', zIndex: 1000,  height: '100%'},
  pastChatsTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  pastChatItem: { padding: 10, fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
