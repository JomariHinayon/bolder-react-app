import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveChatHistory = async (chatHistory, title, t) => {
  try {
    if (title !== t('chatTitle')) {
      await AsyncStorage.setItem(`chatHistory_${title}`, JSON.stringify(chatHistory));
      await savePastChat(title);
    }

    // Remove previous chat with no title
    if (title !== t('chatTitle')) {
      const storedPastChats = await AsyncStorage.getItem('pastChats');
      const pastChatsArray = storedPastChats ? JSON.parse(storedPastChats) : [];
      const noTitleIndex = pastChatsArray.indexOf(t('chatTitle'));
      if (noTitleIndex !== -1) {
        pastChatsArray.splice(noTitleIndex, 1);
        await AsyncStorage.setItem('pastChats', JSON.stringify(pastChatsArray));
        await AsyncStorage.removeItem(`chatHistory_${t('chatTitle')}`);
      }
    }
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const loadChatHistory = async (title, setMessages, setOlderMessages, setShowLoadMore, setChatTitle, scrollViewRef) => {
  try {
    const storedMessages = await AsyncStorage.getItem(`chatHistory_${title}`);
    if (storedMessages) {
      const parsedMessages = JSON.parse(storedMessages);
      setMessages(parsedMessages.slice(-10));
      setOlderMessages(parsedMessages.slice(0, -10));
      setShowLoadMore(parsedMessages.length > 10);
      setChatTitle(title);

      // Scroll to the bottom after loading chat history
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
};

export const savePastChat = async (title) => {
  try {
    const storedPastChats = await AsyncStorage.getItem('pastChats');
    const pastChatsArray = storedPastChats ? JSON.parse(storedPastChats) : [];
    if (!pastChatsArray.includes(title)) {
      pastChatsArray.unshift(title);
      await AsyncStorage.setItem('pastChats', JSON.stringify(pastChatsArray));
    }
  } catch (error) {
    console.error('Error saving past chat:', error);
  }
};

export const loadPastChats = async (setPastChats) => {
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
