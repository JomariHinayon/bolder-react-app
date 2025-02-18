import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { REACT_APP_OPENAI_API_KEY } from '@env';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');

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
      setMessages([...newMessages, { role: 'assistant', content: botReply }]);

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessages([...newMessages, { role: 'assistant', content: "Oops! Something went wrong." }]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatBox}>
        {messages.map((msg, index) => (
          <View key={index} style={[styles.message, msg.role === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  chatBox: { flex: 1, marginBottom: 10 },
  message: { padding: 10, marginVertical: 5, borderRadius: 10, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 5, backgroundColor: '#fff' },
  input: { flex: 1, padding: 10, borderWidth: 1, borderRadius: 5, marginRight: 5 },
});
