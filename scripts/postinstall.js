const { execSync } = require('child_process');
const path = require('path');

try {
  const reanimatedPostinstallPath = path.resolve(__dirname, '../node_modules/react-native-reanimated/scripts/postinstall.js');
  execSync(`node ${reanimatedPostinstallPath}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run react-native-reanimated postinstall script:', error);
  process.exit(1);
}
