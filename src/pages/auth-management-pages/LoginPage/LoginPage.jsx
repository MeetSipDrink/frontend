import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { useAuth } from '../../../AuthContext';

const AD_API_URL = 'http://10.0.2.2:8080';

const FloatingLabelInput = ({label, value, onChangeText, secureTextEntry}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useState(new Animated.Value(value ? 1 : 0))[0];

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 5,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 0.9],
      outputRange: [25, 0],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#000'],
    }),
    backgroundColor: 'white',
    paddingHorizontal: 5,
  };

  return (
      <View style={styles.inputContainer}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
            style={[styles.input, isFocused && styles.focusedInput]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={secureTextEntry}
            blurOnSubmit
        />
      </View>
  );
};

export default function LoginPage({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const saveToKeychain = async (accessToken, refreshToken) => {
    try {
      await Keychain.setGenericPassword('tokens', JSON.stringify({
        accessToken,
        refreshToken
      }));
      console.log('Tokens saved successfully to Keychain');
    } catch (error) {
      console.error('Error saving to Keychain:', error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('오류', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${AD_API_URL}/members/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const accessToken = response.headers['authorization'];
        const refreshToken = response.headers['refresh'];

        if (accessToken && refreshToken) {
          const cleanAccessToken = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;

          await saveToKeychain(cleanAccessToken, refreshToken);
          await login(cleanAccessToken, refreshToken);  // Call AuthContext login function
          navigation.navigate('Home');
        } else {
          throw new Error('인증 토큰이 제공되지 않았습니다.');
        }
      } else {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = '로그인에 실패했습니다. 다시 시도해 주세요.';
      if (error.response) {
        console.log('Error response status:', error.response.status);
        console.log('Error response data:', error.response.data);

        if (error.response.status === 401) {
          errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.response.status === 400) {
          errorMessage = '잘못된 요청입니다. 입력을 확인해 주세요.';
        }
      } else if (error.request) {
        errorMessage = '서버와의 통신에 실패했습니다. 네트워크 연결을 확인해 주세요.';
      }
      Alert.alert('로그인 실패', errorMessage);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.pageText}>한마디 한 잔🍻</Text>
        <View style={styles.InputBox}>
          <FloatingLabelInput
              label="아이디"
              value={username}
              onChangeText={setUsername}
          />
          <FloatingLabelInput
              label="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.Button}
            onPress={() => navigation.navigate('SignUpForm')}>
          <Text>회원가입</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  pageText: {
    fontSize: 24,
    marginTop: 50,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  InputBox: {
    width: '70%',
    paddingVertical: 15,
  },
  inputContainer: {
    paddingTop: 18,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    borderRadius: 7,
    paddingHorizontal: 10,
  },
  focusedInput: {
    borderColor: '#1976d2',
    borderWidth: 2,
  },
  LoginButton: {
    width: '70%',
    backgroundColor: '#F9B300',
    paddingVertical: 15,
    borderRadius: 5,
    margin: 10,
  },
  Button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});