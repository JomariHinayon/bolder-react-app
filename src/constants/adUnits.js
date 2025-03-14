import { Platform } from 'react-native';

export const adBannerID = Platform.OS === "ios" 
  ? "ca-app-pub-3963804402374453/5238479263" // ios banner id
  : "ca-app-pub-3963804402374453/1773458116";   // android banner ID

export const rewardedAdUnitId = Platform.OS === "ios"
  ? "ca-app-pub-3963804402374453/4486572740" // ios rewarded id
  : "ca-app-pub-3963804402374453/7426090100"; // android rewarded id
