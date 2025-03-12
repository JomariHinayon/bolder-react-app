import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from './SettingsScreen';
import AdPreferencesScreen from './AdPreferencesScreen';
// ...existing code...

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Settings">
        {/* ...existing code... */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="AdPreferences" component={AdPreferencesScreen} />
        {/* ...existing code... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;