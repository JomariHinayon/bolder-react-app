import AsyncStorage from '@react-native-async-storage/async-storage';

export const addCredits = async (amount, dailyCredits, setDailyCredits) => {
  try {
    const newCredits = dailyCredits + amount;
    setDailyCredits(newCredits);
    await AsyncStorage.setItem('dailyCredits', newCredits.toString());
  } catch (error) {
    console.error('Error adding credits:', error);
  }
};
