import React, { useState,useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,

} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ setIsLoggedIn}) => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
   const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]); 
   const handleChange = (value, index) => {
    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    if (value && index < 5) inputs.current[index + 1].focus();
    if (!value && index > 0) inputs.current[index - 1].focus();
  };

  const handleAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://aapsuj.accevate.co/flutter-api/login.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
  "userid": "sandeep",
  "password": "Sandeep@2025"
}),
        }
      );

      const result = await response.json();

      if (response.ok && result.status) {
         setStep(2);
         
        
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (e) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
    const handleOTPAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://aapsuj.accevate.co/flutter-api/verify_otp.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
  "userid": "1",
  "otp": "123456"
}),
        }
      );

      const result = await response.json();

      if (response.ok && result.token) {
        console.log('Login successful, token:', result.token);
        await AsyncStorage.setItem('token', result.token);
        setIsLoggedIn(true);
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (e) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
  
      <Image
        source={require('../assets/Logo.png')} 
        style={styles.logo}
      />

       {step === 1  && (
<View>
      <Text style={styles.title}>Log In Now</Text>
      <Text style={styles.subtitle}>
        Please login to continue using our app
      </Text>

   
      <TextInput
        style={styles.input}
        placeholder="Userid"
        placeholderTextColor="#B0B0B0"
        value={userid}
        onChangeText={setUserid}
      />


      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#B0B0B0"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye' : 'eye-off'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.forgotWrapper} >
        <Text style={styles.forgotText}>Forgot Password</Text>
      </TouchableOpacity>

    
      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? 'Logging in...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or connect with</Text>
     
<View style={styles.socialRow}>


  <TouchableOpacity
  >
    <Icon name="logo-facebook" size={22} color="#1877F2" />
  </TouchableOpacity>

 
  <TouchableOpacity
  >
    <Icon name="logo-instagram" size={22} color="#E4405F" />
  </TouchableOpacity>

 
  <TouchableOpacity
  >
    <Icon name="logo-linkedin" size={22} color="#0A66C2" />
  </TouchableOpacity>

 

        

</View>
</View>)
}


       {step === 2  && (
<View>
      <Text style={styles.title}>Enter OTP </Text>
        <View style={styles.otpRow}>
                {code.map((d, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => (inputs.current[i] = ref)}
                    style={styles.otp}
                    maxLength={1}
                    keyboardType="numeric"
                    value={d}
                    onChangeText={(v) => handleChange(v, i)}
                  />
                ))}
              </View>
      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        onPress={handleOTPAuth}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? 'OTP sending...' : 'Send Otp'}
        </Text>
      </TouchableOpacity>



</View>)
}
    </View>
  );
};

export default AuthScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    // paddingTop:70,
    alignContent: 'center',
    justifyContent: 'center',
    height: '100%',
  },

  logo: {
    width: 120,
    height: 70,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0051F9',
  },

  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#888',
    marginBottom: 30,
    marginTop: 5,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 14,
    color: '#000',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
  },

  passwordInput: {
    flex: 1,
    color: '#000',
  },

  forgotWrapper: {
    alignItems: 'flex-end',
    marginVertical: 10,
  },

  forgotText: {
    color: '#0051F9',
    fontSize: 13,
  },

  loginButton: {
    backgroundColor: '#0051F9',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  orText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
    fontSize: 13,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  otp: {
    width: 52,
    height: 58,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    backgroundColor: "#F4F6F8",
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: "#E1E5EA",
  },
});
