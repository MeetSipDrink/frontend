import React, { useState } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert,
    Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {useNavigation} from "@react-navigation/native";

const  EXPO_APP_URI = 'http://172.30.1.19:8080'

const AD_API_URL = 'http://172.30.1.19:8080'; // 실제 API URL로 변경해주세요

const uploadImageToS3 = async (uri) => {
    // 실제 S3 업로드 로직 구현
    return "https://fake-s3-bucket.amazonaws.com/" + Math.random().toString(36).substring(7) + ".jpg";
};

export default function SignUpFormPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [nickname, setNickname] = useState('');
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
            Alert.alert("오류", "필수 필드를 모두 입력해주세요.");
            return false;
        }
        if (!/^[a-zA-Z0-9가-힣]{2,8}$/.test(nickname)) {
            Alert.alert("오류", "닉네임은 특수문자 제외 2자이상 8자 이하로 입력해주세요.");
            return false;
        }
        if (!/^[MF]$/.test(gender)) {
            Alert.alert("오류", "성별을 'M' 또는 'F'로 입력해 주세요.");
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) return;
        try {
            const response = await axios.post(`${EXPO_APP_URI}/members`, {
                email,
                password,
                profileImage,
                nickname,
                gender,
                name,
                age: parseInt(age),
                alcoholType1: alcoholTypes[0],
                alcoholType2: alcoholTypes[1],
                alcoholType3: alcoholTypes[2]
            });

            if (response.status === 201) {
                Alert.alert("성공", "회원가입이 완료되었습니다.");
                navigation.navigate('Home');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("오류", "회원가입 중 오류가 발생했습니다.");
        }

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.pageText}>회원가입</Text>

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
            <TextInput
                style={styles.input}
                placeholder="닉네임"
                value={nickname}
                onChangeText={setNickname}
            />
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
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                <Text style={styles.imagePickerButtonText}>프로필 사진 선택</Text>
            </TouchableOpacity>
            {profileImage ? (
                <View>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    <Text style={styles.imageUrlText}>이미지 URL: {profileImage}</Text>
                </View>
            ) : null}
            {alcoholTypes.map((type, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`선호 주종 ${index + 1}${index === 0 ? ' (필수)' : ''}`}
                    value={type}
                    onChangeText={(value) => handleAlcoholTypeChange(index, value)}
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
    imagePickerButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 15,
    },
    imagePickerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        alignSelf: 'center',
    },
    imageUrlText: {
        marginBottom: 15,
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
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