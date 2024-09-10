import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, { useState } from "react";
import { Input } from "react-native-elements";
import axios from "axios";
import api from "../../../utils/api"; // API 호출을 위한 설정이 되어 있다고 가정

export default function BotResponsePage({ navigation }) {
    const [inputText, setInputText] = useState(""); // 입력값 상태 관리
    const [responseData, setResponseData] = useState(null); // 응답 데이터 상태 관리
    const [error, setError] = useState(null); // 오류 상태 관리

    const API_KEY = process.env.REACT_APP_API_KEY;
    const HOST_IP = '10.0.2.2' //안드에서는 이거로 해야됨

    const handlePress1 = async () => {
        if (inputText.length < 0 ) {
            Alert.alert("삐빅⚠️", "텍스트를  입력해주세요.");
            return
        }
        if (inputText.length > 10) {
            Alert.alert("삐빅⚠️", "텍스트를 10자 미만 입력해주세요.");
            return
        }
        try {
            const response = await axios({
                method: 'POST',
                url: `http://${HOST_IP}:8080/bot/drink-recommend`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${API_KEY}`
                },
                data: { prompt: inputText }, // GET 요청에 본문 데이터를 포함
                transformRequest: [(data) => {
                    return JSON.stringify(data); // 데이터를 JSON 문자열로 변환
                }]
            });
            console.log(response);
            setResponseData(response.data); // 응답 데이터를 상태로 설정
            setError(null); // 오류 초기화
        } catch (error) {
            setError('데이터를 불러오는 중 오류가 발생했습니다.'); // 오류 처리
            setResponseData(null); // 오류 발생 시 응답 데이터 초기화
            console.error("오류 발생:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageText}>🍾술 추천 봇🤖</Text>


            {/* 응답 데이터가 있을 때 화면에 출력 */}
            {responseData && (
                <View style={styles.responseContainer}>
                    <Text style={styles.responseText}>{responseData}</Text>
                </View>
            )}

            {/* 오류 메시지가 있을 때 화면에 출력 */}
            {error && (
                <View style={styles.responseContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            <Input
                placeholder="음료 추천을 위한 텍스트를 입력하세요"
                value={inputText}
                onChangeText={setInputText} // 입력값 상태 업데이트
            />
            <TouchableOpacity style={styles.Button} onPress={handlePress1}>
                <Text style={styles.buttonText}>전송</Text>
            </TouchableOpacity>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    pageText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    Button: {
        backgroundColor: '#F9B300',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10, // 버튼 간격 추가
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    responseContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e1e1e1',
        borderRadius: 5,
    },
    responseText: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});