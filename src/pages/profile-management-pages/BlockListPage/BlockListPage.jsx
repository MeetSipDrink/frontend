import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from '../../../utils/api';

export default function BlockListPage({ navigation }) {
    const [apiResponse, setApiResponse] = useState('데이터 로딩 중...');

    const API_KEY = process.env.REACT_APP_API_KEY;
    const API_KEY2 = process.env["REACT_APP_API_URL "];


    // useEffect(() => {
    //     api.get('/members/1')
    //         .then((response) => {
    //             console.log(response.data);  // 콘솔에 데이터 출력
    //             console.log(API_KEY2);
    //             console.log(API_KEY);
    //
    //             setApiResponse(JSON.stringify(response.data, null, 2));  // 보기 좋게 포맷팅
    //         })
    //         .catch((error) => {
    //             console.error("API 호출 오류:", error);
    //             setApiResponse('API 호출 중 오류 발생');
    //         });
    // }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.pageText}>
                차단 목록 페이지
            </Text>
            <Text style={styles.apiResponseText}>
                {apiResponse}
            </Text>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText}>홈으로</Text>
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
    apiResponseText: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    Button: {
        backgroundColor: '#FF6347',
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