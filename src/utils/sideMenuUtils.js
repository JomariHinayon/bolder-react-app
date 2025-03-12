import { Animated } from 'react-native';

export const toggleSideMenu = (isSideMenuVisible, openSideMenu, closeSideMenu) => {
  if (isSideMenuVisible) {
    closeSideMenu();
  } else {
    openSideMenu();
  }
};

export const openSideMenu = (setIsSideMenuVisible, setSideMenuButtonText, sideMenuAnim, rightMenuOpacity, t) => {
  setIsSideMenuVisible(true);
  setSideMenuButtonText(t('close')); 

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

export const closeSideMenu = (setSideMenuButtonText, sideMenuAnim, rightMenuOpacity, sideMenuWidth, t, setIsSideMenuVisible) => {
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
