import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BottomNavigation from '../../auth-management-pages/HomePage/bottomNavigation/bottomNavigation';

export default function NoticePostPage({ navigation }) {
    const [images, setImages] = useState([]); // 선택된 이미지의 URI 목록
    const [imageUrls, setImageUrls] = useState([]); // 서버에서 받은 이미지 URL 리스트
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const API_URL = 'http://10.0.2.2:8080';

    // 이미지 선택 및 업로드 함수
    const handleSelectImage = () => {
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
                setImages(prevImages => [...prevImages, { uri }]); // 선택된 이미지를 추가

                // 이미지 업로드 (즉시 서버에 업로드)
                const formData = new FormData();
                formData.append('multipartFile', {
                    uri: uri,
                    type: 'image/jpeg',
                    name: `image_${new Date().getTime()}.jpg`,
                });

                try {
                    const uploadResponse = await axios.post(`${API_URL}/images`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                
                    const result = uploadResponse.data;
                
                    if (uploadResponse.status == 200) {
                        // 이미지 URL 저장
                        const uploadedImageUrl = typeof result === 'string' ? result : result.imageUrl;
                        Alert.alert('성공', '이미지가 성공적으로 업로드되었습니다.');
                        console.log('이미지 URL:', uploadedImageUrl);
                        setImageUrls(prevUrls => [...prevUrls, uploadedImageUrl]); // 서버에서 받은 이미지 URL 추가
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

    // 이미지 삭제 함수
    const handleDeleteImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index)); // 선택된 이미지 URI 목록에서 해당 이미지 삭제
        setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index)); // 서버에서 받은 이미지 URL에서도 해당 이미지 삭제
    };

    // 공지사항 업로드 함수
    const handleUploadNotice = async () => {
        if (!title || !content) {
            Alert.alert('알림', '제목과 내용을 입력해주세요.');
            return;
        }
    
        const noticeData = {
            title,
            content,
            imageUrls, // 업로드된 이미지 URL 리스트
        };
    
        // 액세스 토큰 가져오기
        const credentials = await Keychain.getGenericPassword();
        if (!credentials) {
            Alert.alert('오류', '로그인이 필요합니다.');
            return;
        }
        const { accessToken } = JSON.parse(credentials.password);
    
        try {
            const response = await axios.post(`${API_URL}/notices`, noticeData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, // 액세스 토큰 추가
                },
            });
    
            if (response.status === 201) {
                Alert.alert('성공', '공지사항이 성공적으로 업로드되었습니다.');
                navigation.navigate('NoticeList');
            } else {
                Alert.alert('실패', '공지사항 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('공지사항 업로드 오류:', error);
            Alert.alert('에러', '공지사항을 업로드하는 중 오류가 발생했습니다.');
        }
    };

    // 알림을 보내는 함수
    const sendNotification = async (title, message) => {
        try {
            const notificationData = {
                title: title,
                message: message,
            };

            await axios.post(`${API_URL}/api/notifications/notice`, notificationData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        } catch (error) {
            console.error('알림 전송 오류:', error);
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <AntDesign name="left" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>공지사항 작성</Text>
                </View>

                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <ScrollView horizontal style={styles.imageContainer}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image.uri }} style={styles.image} />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(index)}>
                                    <AntDesign name="closecircle" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addImageButton} onPress={handleSelectImage}>
                            <AntDesign name="plus" size={40} color="#bbb" />
                            <Text style={styles.addImageText}>이미지를 선택해주세요.</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <TextInput
                        style={styles.textArea}
                        placeholder="내용을 입력하세요"
                        multiline
                        numberOfLines={20}
                        value={content}
                        onChangeText={setContent}
                    />

                    <TouchableOpacity style={styles.uploadButton} onPress={handleUploadNotice}>
                        <Text style={styles.uploadButtonText}>공지사항 작성</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomNavigationWrapper}>
                    <BottomNavigation navigation={navigation} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    imageContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    imageWrapper: {
        width: 150,
        height: 150,
        marginRight: 10,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
    },
    addImageButton: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    addImageText: {
        fontSize: 12,
        color: '#bbb',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    textArea: {
        height: 380,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    uploadButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNavigationWrapper: {
        height: 60,
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
});
