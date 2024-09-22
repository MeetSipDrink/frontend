import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ADS_API_URL = 'http://10.0.2.2:8080';

export default function SignUpFormPage() {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { name: fixedName, gender: fixedGender, age: fixedAge } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('https://meetsipdrink-bucket.s3.ap-northeast-2.amazonaws.com/default-profile/profileImage.png');
  const [profileImageUrl, setProfileImageUrl] = useState('https://meetsipdrink-bucket.s3.ap-northeast-2.amazonaws.com/default-profile/profileImage.png');
  const [nickname, setNickname] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [alcoholTypes, setAlcoholTypes] = useState(['', '', '']);

  const handleAlcoholTypeChange = (index, value) => {
    const newAlcoholTypes = [...alcoholTypes];
    newAlcoholTypes[index] = value;
    setAlcoholTypes(newAlcoholTypes);
  };

  // 이미지 선택 및 S3에 업로드하는 함수
  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 600,
      maxHeight: 600,
      quality: 1,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        Alert.alert('알림', '이미지 선택이 취소되었습니다.');
      } else if (response.errorMessage) {
        Alert.alert('에러', '이미지를 선택하는 중 오류가 발생했습니다.');
      } else {
        const uri = response.assets[0].uri;
        setProfileImage(uri); // 선택한 이미지를 로컬에 저장

        // 이미지 업로드 (S3로 업로드)
        const formData = new FormData();
        formData.append('multipartFile', {
          uri: uri,
          type: 'image/jpeg',
          name: `profile_${new Date().getTime()}.jpg`,
        });

        try {
          const uploadResponse = await axios.post(`${ADS_API_URL}/images`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        
          const uploadedImageUrl = typeof uploadResponse.data === 'string' ? uploadResponse.data : uploadResponse.data.imageUrl;
        
          if (uploadResponse.status === 200) {
            setProfileImageUrl(uploadedImageUrl);  // S3 URL 저장
            Alert.alert('성공', '이미지가 성공적으로 업로드되었습니다.');
          } else {
            Alert.alert('실패', '이미지 업로드에 실패했습니다.');
            console.error(uploadResponse.data);
          }
        } catch (error) {
          console.error('이미지 업로드 오류:', error);
          Alert.alert('에러', '이미지를 업로드하는 중 오류가 발생했습니다.');
        }
      }
    });
  };

  // 프로필 이미지 삭제
  const removeProfileImage = () => {
    setProfileImage('https://meetsipdrink-bucket.s3.ap-northeast-2.amazonaws.com/default-profile/profileImage.png');
    setProfileImageUrl('https://meetsipdrink-bucket.s3.ap-northeast-2.amazonaws.com/default-profile/profileImage.png');
  };

  const validateInputs = () => {
    if (!email || !password || !nickname || !alcoholTypes[0]) {
      Alert.alert('오류', '필수 필드를 모두 입력해주세요.');
      return false;
    }
    if (!/^[a-zA-Z0-9가-힣]{2,8}$/.test(nickname)) {
      Alert.alert(
        '오류',
        '닉네임은 특수문자 제외 2자이상 8자 이하로 입력해주세요.',
      );
      return false;
    }
    return true;
  };

  const checkNickname = async () => {
    if (!nickname) {
        Alert.alert('오류', '닉네임을 입력해주세요.');
        return;
    }

    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,8}$/;
    if (!nicknameRegex.test(nickname)) {
        Alert.alert('오류', '특수문자 제외 2자 이상 8자 이하로 입력해주세요.');
        return;
    }
    else {
        try {
            const response = await axios.get(`${ADS_API_URL}/members/${nickname}`);
            Alert.alert('오류', '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
            setNicknameChecked(false);
        } catch (error) {
            if (error.response && error.response.status === 500) {
                Alert.alert('성공', '사용 가능한 닉네임입니다.');
                setNicknameChecked(true);
            } else {
                console.error('닉네임 중복 확인 중 오류 발생:', error);
                Alert.alert('오류', '닉네임 중복 확인 중 문제가 발생했습니다. 다시 시도해주세요.');
                setNicknameChecked(false);
            }
        }
    }
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    if (!nicknameChecked) {
      Alert.alert('오류', '닉네임 중복 검사를 먼저 진행해주세요.');
      return;
    }
    try {
      const response = await axios.post(`${ADS_API_URL}/members`, {
        email,
        password,
        profileImage: profileImageUrl,
        nickname,
        gender: fixedGender,
        name: fixedName, 
        age: fixedAge,
        alcoholType1: alcoholTypes[0],
        alcoholType2: alcoholTypes[1],
        alcoholType3: alcoholTypes[2],
      });

      if (response.status === 201) {
        Alert.alert('성공', '회원가입이 완료되었습니다.');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ position: 'relative', alignItems: 'center' }}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>
        {profileImage !== 'https://meetsipdrink-bucket.s3.ap-northeast-2.amazonaws.com/default-profile/profileImage.png' ? (
          <TouchableOpacity style={styles.deleteButton} onPress={removeProfileImage}>
            <AntDesign name="closecircle" size={24} color="red" />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity style={styles.changePhotoButton} onPress={handleImagePick}>
        <Text style={styles.changePhotoText}>프로필 사진 선택</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.nicknameContainer}>
        <TextInput
          style={styles.nicknameInput}
          placeholder="닉네임"
          value={nickname}
          onChangeText={text => {
            setNickname(text);
            setNicknameChecked(false);
          }}
        />
        <TouchableOpacity style={styles.checkButton} onPress={checkNickname}>
          <Text style={styles.checkButtonText}>중복 검사</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={fixedName}
        editable={false}
        color='#3A3A3A'
        backgroundColor='#E6E6E6'
      />
      <TextInput
      style={styles.input}
      value={fixedGender === 'M' ? '남자' : '여자'}
      editable={false}
      color='#3A3A3A'
      backgroundColor='#E6E6E6'
      />
      <TextInput
        style={styles.input}
        value={String(fixedAge)} 
        editable={false}
        color='#3A3A3A'
        backgroundColor='#E6E6E6'
      />
      {alcoholTypes.map((type, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`선호 주종 ${index + 1}${index === 0 ? ' (필수)' : ''}`}
          value={type}
          onChangeText={value => handleAlcoholTypeChange(index, value)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changePhotoButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePhotoText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    zIndex: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  nicknameInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginRight: 10,
  },
  checkButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
