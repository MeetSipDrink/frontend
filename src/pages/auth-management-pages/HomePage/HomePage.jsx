import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 추가

export default function HomePage() {
    const navigation = useNavigation(); // 네비게이션 객체 사용

    return (

        <View style={styles.container}>

            {/* 헤더 영역 */}
            <View style={styles.header}>
                <Text style={styles.headerText}>한마디 한 잔</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>
            </View>

            {/* 이미지 영역 */}
            <View style={styles.mainImageContainer}>
                <Image source={require('/Users/gimchanjun/Desktop/MeetSipDrink/frontend/src/assets/images/image 24.png')}
                       style={styles.mainImage} />
            </View>

            {/* 기능 버튼들 */}
            <View style={styles.buttonRow1}>
                <TouchableOpacity style={[styles.featureButton,  { flex: 1 }]} onPress={() => navigation.navigate('VideoChat')}>
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.buttonText}>화상채팅하러가기</Text>
                        <Text style={styles.buttonText}>오늘 나의 술친구는 누굴까?</Text>
                    </View>
                    <Text style={styles.imageText}>이미지</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.featureButton,  { flex: 1 }]}  onPress={() => navigation.navigate('ChatRoomList')}>
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.buttonText}>채팅하러 가기</Text>
                        <Text style={styles.buttonText}>체팅으로도 충분히 재밌으니까</Text>
                    </View>
                    <Text style={styles.imageText}>이미지</Text>
                </TouchableOpacity>
            </View>

            {/* 3개의 버튼을 한 줄에 배치 */}
            <View style={styles.buttonRow2}>
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]} onPress={() => navigation.navigate('BoardList')}>
                    <Text style={styles.buttonText}>오늘의 술상 자랑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 1 }]} onPress={() => navigation.navigate('Roulette')}>
                    <Text style={styles.buttonText}>안주 룰렛</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]} onPress={() => navigation.navigate('NoticeList')}>
                    <Text style={styles.buttonText}>공지사항</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonRow3} >
                <TouchableOpacity style={styles.subFeatureButton} onPress={() => navigation.navigate('UserSearchList')}>
                    <Text style={styles.buttonText}>유저 검색</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.subFeatureButton} onPress={() => navigation.navigate('BotResponse')}>
                    <Text style={styles.buttonText}>응답 봇</Text>
                </TouchableOpacity>

            </View>

            {/* 하단 네비게이션 */}
            <View style={styles.bottomNavigation}>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('ChatRoomList')}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>채팅방</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('FriendList')}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>친구 만나러 가기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>홈</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('BoardList')}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>자랑 게시판</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('MyPage')}>
                    <Text style={styles.image}>이미지</Text>
                    <Text style={styles.navItem}>마이 페이지</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 30,
        height: '11.4%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
    },
    mainImageContainer: {
        height: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    mainImage: {
        width: 500,
        flex: 1,
    },
    buttonRow1: {
        height: '18%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    leftTextContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    imageText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 16,
        color: '#fff',
    },
    buttonRow2: {
        height: '9%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    buttonRow3: {
        height: '5%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    featureButton: {
        backgroundColor: '#FF6347',
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 5,
        flexDirection: 'row',
    },
    subFeatureButton: {
        backgroundColor: '#FFAD60',
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'left',
    },
    bottomNavigation: {
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
        position: 'absolute',
        bottom: 10,
        width: '100%',
        padding: 10,
    },
    navItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        fontSize: 24,
        marginBottom: 5,
    },
    navItem: {
        fontSize: 11,
        color: '#333',
    },
});