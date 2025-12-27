
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import {
  View,
  Text,
  Alert,
 
} from 'react-native';



 const DashboardScreen = () => {
       useEffect(()=>{
    checkUserName();
       },[]);
         const checkUserName = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        navigation.replace('LoginScreen');
        return;
      }

      const response = await fetch(
        'https://aapsuj.accevate.co/flutter-api/dashboard.php',
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('Auth check response:', data);
 await AsyncStorage.setItem('user', JSON.stringify(data.user));
      if (!response.ok || data?.status === false) {
        
        Alert.alert('Session Expired', 'Please login again');
       
        return;
      }


    } catch (error) {
      console.log('Auth check error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
    return(
        <View >
            <Text style={{color:"red"}}>Dashboard Screen</Text>
        </View>
    )
}
export default DashboardScreen;