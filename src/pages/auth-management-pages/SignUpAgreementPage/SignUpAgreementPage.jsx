import React, {useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import defaultProfileImage from '../../../assets/images/profileImage.png';


const ADS_API_URL = 'http://10.0.2.2:8080';

const uploadImageToS3 = async uri => {
  // 실제 S3 업로드 로직 구현
  return (
    'https://fake-s3-bucket.amazonaws.com/' +
    Math.random().toString(36).substring(7) +
    '.jpg'
  );
};

export default function SignUpFormPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [alcoholTypes, setAlcoholTypes] = useState(['', '', '']);
  const navigation = useNavigation();

  const handleAlcoholTypeChange = (index, value) => {
    const newAlcoholTypes = [...alcoholTypes];
    newAlcoholTypes[index] = value;
    setAlcoholTypes(newAlcoholTypes);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUrl = await uploadImageToS3(result.assets[0].uri);
      setProfileImage(imageUrl);
    }
  };

  const validateInputs = () => {
    if (!email || !password || !name || !age || !nickname || !alcoholTypes[0]) {
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
    if (!/^[MF]$/.test(gender)) {
      Alert.alert('오류', "성별을 'M' 또는 'F'로 입력해 주세요.");
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
            // axios는 200번대 상태 코드를 성공으로 처리합니다.
            // 여기서는 200 OK가 중복된 닉네임을 의미합니다.
            Alert.alert('오류', '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.');
            setNicknameChecked(false);
        } catch (error) {
            if (error.response && error.response.status === 500) {
                // 500 에러는 중복되지 않은 닉네임을 의미합니다.
                Alert.alert('성공', '사용 가능한 닉네임입니다.');
                setNicknameChecked(true);
            } else {
                // 기타 다른 에러에 대한 처리
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
        profileImage,
        nickname,
        gender,
        name,
        age: parseInt(age),
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
      <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
        <Image
          source={profileImage ? {uri: profileImage} : defaultProfileImage}
          style={styles.profileImage}
        />
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
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
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
        placeholder="성별 (M 또는 F)"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="나이"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
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
  pageText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#4CAF50',
    fontSize: 16,
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
