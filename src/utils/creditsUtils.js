import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadDailyCredits = async (setDailyCredits) => {
  try {
    const storedCredits = await AsyncStorage.getItem('dailyCredits');
    const lastReset = await AsyncStorage.getItem('lastReset');
    const now = new Date();

    if (lastReset) {
      const lastResetDate = new Date(lastReset);
      if (now.getDate() !== lastResetDate.getDate()) {
        // Reset credits if the date has changed
        setDailyCredits(10);
        await AsyncStorage.setItem('dailyCredits', '10');
        await AsyncStorage.setItem('lastReset', now.toISOString());
      } else {
        setDailyCredits(parseInt(storedCredits, 10) || 10);
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

export const decrementDailyCredits = async (dailyCredits, setDailyCredits) => {
  try {
    const newCredits = dailyCredits - 1;
    setDailyCredits(newCredits);
    await AsyncStorage.setItem('dailyCredits', newCredits.toString());
  } catch (error) {
    console.error('Error decrementing daily credits:', error);
  }
};

export const incrementMessageCount = async (messageCount, setMessageCount) => {
  try {
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    await AsyncStorage.setItem('messageCount', newCount.toString());
  } catch (error) {
    console.error('Error incrementing message count:', error);
  }
};

export const addCredits = async (creditsToAdd, dailyCredits, setDailyCredits) => {
  try {
    const newCredits = dailyCredits + creditsToAdd;
    setDailyCredits(newCredits);
    await AsyncStorage.setItem('dailyCredits', newCredits.toString());
  } catch (error) {
    console.error('Error adding credits:', error);
  }
};
