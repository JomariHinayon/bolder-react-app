import { Platform } from 'react-native';

export const adBannerID = Platform.OS === "ios" 
  ? "ca-app-pub-1566921124634242/4140353735" // ios banner id
  : "ca-app-pub-3963804402374453/1773458116";   // android banner ID

export const rewardedAdUnitId = Platform.OS === "ios"
  ? "ca-app-pub-1566921124634242/2816497928" // ios rewarded id
  : "ca-app-pub-3963804402374453/7426090100"; // android rewarded id
