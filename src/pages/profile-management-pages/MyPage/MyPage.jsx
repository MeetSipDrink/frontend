import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import homeV from '../../../assets/images/homeV.png';
import profileImage from "../../../assets/images/profileImage.png";
import React from "react";

export default function MyPage({navigation}) {
    return(
        <View style={styles.container}>

            {/* 헤더 영역 */}
            <View style={styles.top}>
            <Text style={styles.pageText}>마이 페이지</Text>
            </View>

            {/* 프로필 영역 */}
                <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>닉네임 값 받아와야함</Text>
                    <Image source={profileImage}
                           style={styles.mainImage} />
                <Text style={styles.emailText}>이메일 받아와야함</Text>
            </View>

            {/* 선택 주종 영역 */}

            <View style={styles.friendList}>
                    <Text>선호주종</Text>
                    <Text>주종 값</Text>
                </View>
            <View style={styles.friendList}>
                <Text>선호주종</Text>
                <Text>주종 값</Text>
            </View>
            <View style={styles.friendList}>
                <Text>선호주종</Text>
                <Text>주종 값</Text>
            </View>

            {/* 친구목록, 차단목록, 개인정보 수정, 탈퇴 버튼 */}
            <View style={styles.friendList}>
                <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('FriendList')}>
                    <Text style={styles.buttonText}>친구목록</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('BlockList')}>
                    <Text style={styles.buttonText}>차단목록</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.friendList}>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('ProfileEditor')}>
                <Text style={styles.buttonText}>개인정보 수정</Text>
            </TouchableOpacity>
            </View>
                <View style={styles.friendList}>
            <TouchableOpacity style={styles.Button}>
                <Text style={styles.buttonText}>탈퇴</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
            <TouchableOpacity style={styles.Button} onPress={() =>navigation.navigate('Home') }>
                <Text style={styles.buttonText}>홈으로</Text>
            </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    top: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    bottom: {
        flex: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    userInfo: {
        borderRadius: 10,

        width: '95%',
        flex: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0E0E0',

    },
    friendList: {
        flex: 3,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
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
    userInfoText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    emailText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#gray',
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