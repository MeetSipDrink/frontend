import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginPage({ navigation }) {  // navigation을 props로 받아옴
    return (
        <View style={styles.container}>
            <Text style={styles.pageText}>로그인 페이지</Text>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('SignUp')}>
                <Text>회원가입</Text>
            </TouchableOpacity>
            {/* 홈으로 돌아가는 버튼 */}
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