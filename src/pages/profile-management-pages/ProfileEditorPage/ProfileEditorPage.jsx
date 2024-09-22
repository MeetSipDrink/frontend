import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image } from "react-native";
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Keychain from "react-native-keychain";

const ADS_API_URL = 'http://10.0.2.2:8080';

export default function ProfileEditorPage({ route, navigation }) {
    const [userInfo, setUserInfo] = useState(route.params?.userInfo || {});
    const [loading, setLoading] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(true);
    const [profileImage, setProfileImage] = useState(userInfo.profileImage);
    const [alcoholTypes, setAlcoholTypes] = useState([
        userInfo.alcoholType1,
        userInfo.alcoholType2,
        userInfo.alcoholType3
    ].filter(Boolean));
    const [originalNickname, setOriginalNickname] = useState(userInfo.nickname);

    useEffect(() => {
        if (!route.params?.userInfo) {
            Alert.alert('오류', '사용자 정보를 불러올 수 없습니다.');
            navigation.goBack();
        } else {
            setOriginalNickname(route.params.userInfo.nickname);
        }
    }, [route.params?.userInfo, navigation]);

    const handleUpdate = async () => {
        if (userInfo.nickname !== originalNickname && !nicknameChecked) {
            Alert.alert('알림', '닉네임이 변경되었습니다. 중복 검사를 진행해주세요.');
            return;
        }
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            const { accessToken } = JSON.parse(credentials.password);
            try {
                setLoading(true);
                const updatedFields = {
                    nickname: userInfo.nickname,
                    profileImage: profileImage, // S3에서 업로드한 이미지 URL
                    alcoholType1: alcoholTypes[0] || '',
                    alcoholType2: alcoholTypes[1] || '',
                    alcoholType3: alcoholTypes[2] || '',
                };

                console.log('Sending update request with data:', updatedFields);

                const response = await axios.patch(`${ADS_API_URL}/members`, updatedFields, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log('Update response:', response.data);

                if (response.data && response.data.data) {
                    Alert.alert('성공', '프로필이 업데이트되었습니다.');
                    setUserInfo({
                        ...userInfo,
                        ...updatedFields,
                    });
                    navigation.navigate('MyPage', { profileUpdated: true });
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('Error updating profile:', error.response ? error.response.data : error.message);
                Alert.alert('오류', `프로필 업데이트에 실패했습니다: ${error.response ? error.response.data.message : error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const checkNickname = async () => {
        if (!userInfo.nickname) {
            Alert.alert('오류', '닉네임을 입력해주세요.');
            return;
        }

        const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,8}$/;
        if (!nicknameRegex.test(userInfo.nickname)) {
            Alert.alert('오류', '특수문자 제외 2자 이상 8자 이하로 입력해주세요.');
            return;
        }

        if (userInfo.nickname === originalNickname) {
            // 원래 닉네임과 동일한 경우 무조건 성공
            Alert.alert('성공', '사용 가능한 닉네임입니다.');
            setNicknameChecked(true);
        } else {
            try {
                const response = await axios.get(`${ADS_API_URL}/members/${userInfo.nickname}`);
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

    const handleFieldChange = (field, value) => {
        setUserInfo(prev => ({ ...prev, [field]: value }));
        if (field === 'nickname') {
            setNicknameChecked(false);
        }
    };

    const addAlcoholType = () => {
        if (alcoholTypes.length < 3) {
            setAlcoholTypes([...alcoholTypes, '']);
        }
    };

    const removeAlcoholType = (index) => {
        const newAlcoholTypes = [...alcoholTypes];
        newAlcoholTypes.splice(index, 1);
        setAlcoholTypes(newAlcoholTypes);
    };

    const updateAlcoholType = (index, value) => {
        const newAlcoholTypes = [...alcoholTypes];
        newAlcoholTypes[index] = value;
        setAlcoholTypes(newAlcoholTypes);
    };

    const pickImage = () => {
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
                
                const formData = new FormData();
                formData.append('multipartFile', {
                    uri: uri,
                    type: 'image/jpeg',
                    name: `profile_${new Date().getTime()}.jpg`,
                });

                try {
                    const uploadResponse = await fetch('http://10.0.2.2:8080/images', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const contentType = uploadResponse.headers.get('content-type');
                    let result;

                    if (contentType && contentType.includes('application/json')) {
                        result = await uploadResponse.json();
                    } else {
                        result = await uploadResponse.text();
                        console.log('Response is not JSON:', result);
                    }

                    if (uploadResponse.ok) {
                        const uploadedImageUrl = typeof result === 'string' ? result : result.imageUrl;
                        Alert.alert('성공', '프로필 이미지가 성공적으로 업로드되었습니다.');
                        setProfileImage(uploadedImageUrl);
                    } else {
                        Alert.alert('실패', '이미지 업로드에 실패했습니다.');
                        console.error(result);
                    }
                } catch (error) {
                    console.error('이미지 업로드 오류:', error);
                    Alert.alert('에러', '이미지를 업로드하는 중 오류가 발생했습니다.');
                }
            }
        });
    };

    const resetToOriginalImage = () => {
        setProfileImage(userInfo.profileImage); // 기존의 프로필 이미지로 리셋
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imageWrapper}>
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    <Text style={styles.changePhotoText}>사진 변경</Text>
                </TouchableOpacity>

                {/* 기본 이미지가 아닐 경우에만 X 버튼을 보여줌 */}
                {profileImage !== userInfo.profileImage && (
                    <TouchableOpacity style={styles.resetButton} onPress={resetToOriginalImage}>
                        <Text style={styles.resetButtonText}>X</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.nicknameContainer}>
                <TextInput
                    style={styles.nicknameInput}
                    value={userInfo.nickname}
                    onChangeText={(text) => handleFieldChange('nickname', text)}
                    placeholder="닉네임"
                />
                <TouchableOpacity
                    style={styles.checkButton}
                    onPress={checkNickname}
                    disabled={loading}
                >
                    <Text style={styles.checkButtonText}>중복 검사</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>선호 주종</Text>
            {alcoholTypes.map((alcoholType, index) => (
                <View key={index} style={styles.alcoholTypeContainer}>
                    <TextInput
                        style={[styles.alcoholTypeInput, index === 0 && styles.requiredInput]}
                        value={alcoholType}
                        onChangeText={(text) => updateAlcoholType(index, text)}
                        placeholder={`선호주종 ${index + 1}${index === 0 ? ' (필수)' : ''}`}
                    />
                    {index !== 0 && (
                        <TouchableOpacity onPress={() => removeAlcoholType(index)} style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>X</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
            {alcoholTypes.length < 3 && (
                <TouchableOpacity onPress={addAlcoholType} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ 주종 추가</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleUpdate}
            >
                <Text style={styles.buttonText}>
                    {loading ? '업데이트 중...' : '프로필 업데이트'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    imageWrapper: {
        position: 'relative',
        marginBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
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
    resetButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
    },
    resetButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    nicknameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    nicknameInput: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        marginRight: 10,
    },
    checkButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    checkButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 20,
        marginBottom: 10,
    },
    alcoholTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    alcoholTypeInput: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
    },
    requiredInput: {
        borderColor: '#F9B300',
        borderWidth: 2,
    },
    removeButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#ff4d4f',
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#F9B300',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
});
