import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

export default function NoticeViewPage({navigation}) {
    return(<View style={styles.container}>
        <Text style={styles.pageText}>공지사항 상세 페이지</Text>
    <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('NoticeList')}>
        <Text style={styles.buttonText}>공지사항 리스트(뒤로가기)</Text>
    </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('NoticeEdit')}>
                <Text style={styles.buttonText}>게시판 수정</Text>
            </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>홈으로</Text>
    </TouchableOpacity>
        </View>

        )
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