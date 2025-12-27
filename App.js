import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import DrawerNavigation from './src/navigation/DrawerNavigation';
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

 

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={"yellow"} size={50} />
      </View>
    );
  }

  return (
      
    <NavigationContainer>
      {isLoggedIn ? (
        <DrawerNavigation username={username} onLogout={handleLogout} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth">
            {(props) => <AuthScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
          
           
       
        </Stack.Navigator>
      )}
    </NavigationContainer>
   
  );
}
