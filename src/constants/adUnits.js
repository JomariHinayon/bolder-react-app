import { Platform } from 'react-native';

export const adBannerID = Platform.OS === "ios" 
  ? "ca-app-pub-1566921124634242/4140353735" // ios banner id
  : "ca-app-pub-1566921124634242/3916158307";   // android banner ID

export const rewardedAdUnitId = Platform.OS === "ios"
  ? "ca-app-pub-1566921124634242/2816497928" // ios rewarded id
  : "ca-app-pub-1566921124634242/3226990646"; // android rewarded id
