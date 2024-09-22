import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, SafeAreaView, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { Input, Icon } from "react-native-elements";
import axios from "axios";
import * as Keychain from 'react-native-keychain';

export default function BotResponsePage({ navigation }) {
    const [inputText, setInputText] = useState("");
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const API_KEY = process.env.REACT_APP_API_KEY;
    const HOST_IP = '10.0.2.2';

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setResponseData(null);
            setError(null);
            setInputText("");
        });

        checkLoginStatus();

        return unsubscribe;
    }, [navigation]);

    const checkLoginStatus = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            setIsLoggedIn(!!credentials);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    const handlePress1 = async () => {
        if (!isLoggedIn) {
            Alert.alert(
                "로그인 필요",
                "이 기능을 사용하려면 로그인이 필요합니다.",
                [
                    { text: "취소", style: "cancel" },
                    { text: "로그인", onPress: () => navigation.navigate('Login') }
                ]
            );
            return;
        }

        if (inputText.length === 0) {
            Alert.alert("입력 오류", "텍스트를 입력해주세요.");
            return;
        }
        if (inputText.length > 1000) {
            Alert.alert("입력 오류", "텍스트를 1000자 미만으로 입력해주세요.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: `http://${HOST_IP}:8080/bot/drink-recommend`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${API_KEY}`
                },
                data: { prompt: inputText },
                transformRequest: [(data) => JSON.stringify(data)]
            });
            setResponseData(response.data);
            setError(null);
        } catch (error) {
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
            setResponseData(null);
            console.error("오류 발생:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.pageText}>🍾 술 추천 봇 🤖</Text>

                    {responseData && (
                        <View style={styles.responseContainer}>
                            <Text style={styles.responseText}>{responseData}</Text>
                        </View>
                    )}

                    {error && (
                        <View style={styles.responseContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <Input
                            placeholder="음료 추천을 위한 텍스트를 입력하세요"
                            value={inputText}
                            onChangeText={setInputText}
                            containerStyle={styles.inputContainerStyle}
                            inputStyle={styles.inputStyle}
                            inputContainerStyle={styles.inputInnerContainerStyle}
                            leftIcon={
                                <Icon
                                    name='glass-wine'
                                    type='material-community'
                                    color='#517fa4'
                                    containerStyle={styles.iconContainerStyle}
                                />
                            }
                        />
                        <TouchableOpacity style={styles.button} onPress={handlePress1} disabled={isLoading}>
                            <Text style={styles.buttonText}>전송</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={isLoading}
                    onRequestClose={() => {console.log('close modal')}}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <ActivityIndicator
                                animating={isLoading}
                                size="large"
                                color="#F9B300"
                            />
                            <Text style={styles.loadingText}>추천 중...</Text>
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pageText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginTop: 20,
    },
    inputContainerStyle: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        height: 60, // 인풋 박스의 높이를 명시적으로 설정
    },
    inputInnerContainerStyle: {
        borderBottomWidth: 0,
        height: '100%', // 내부 컨테이너가 전체 높이를 차지하도록 설정
    },
    inputStyle: {
        color: '#333',
        textAlignVertical: 'center', // 안드로이드에서 텍스트를 세로 중앙 정렬
        height: '100%', // 텍스트 입력 영역이 전체 높이를 차지하도록 설정
    },
    iconContainerStyle: {
        marginRight: 10,
        height: '100%', // 아이콘 컨테이너가 전체 높이를 차지하도록 설정
        justifyContent: 'center', // 아이콘을 세로 중앙 정렬
    },
    button: {
        backgroundColor: '#F9B300',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    responseContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    responseText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000080'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    }
});