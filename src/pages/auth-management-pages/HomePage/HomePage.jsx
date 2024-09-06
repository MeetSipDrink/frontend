import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Homeimage from '../../../assets/images/Homeimage.png';
import homeB1 from '../../../assets/images/homeB1.png';
import homeB2 from '../../../assets/images/homeB2.png';
import homeBot from '../../../assets/images/homeBot.png';
import homeC from '../../../assets/images/homeC.png';
import homeN from '../../../assets/images/homeN.png';
import homeR from '../../../assets/images/homeR.png';
import homeV from '../../../assets/images/homeV.png';

export default function HomePage() {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* 헤더 영역 */}
            <View style={styles.header}>
                <Text style={styles.headerText}>한마디 한 잔</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>
            </View>

            {/* 메인 이미지 영역 */}
            <View style={styles.mainImageContainer}>
                <Image source={Homeimage} style={styles.mainImage} />
            </View>

            {/* 기능 버튼들 */}
            <View style={styles.buttonRow1}>
                {/* 화상채팅 버튼 */}
                <TouchableOpacity style={[styles.featureButton, { flex: 1 }]} onPress={() => navigation.navigate('VideoChat')}>
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.buttonText}>화상채팅하러가기</Text>
                        <Text style={styles.buttonText}>오늘 나의 술친구는 누굴까?</Text>
                    </View>
                    <View style={styles.rightTextContainer}>
                        <Image source={homeV} style={styles.mainIcon} />
                    </View>
                </TouchableOpacity>

                {/* 채팅 버튼 */}
                <TouchableOpacity style={[styles.featureButton, { flex: 1 }]} onPress={() => navigation.navigate('ChatRoomList')}>
                    <View style={styles.leftTextContainer}>
                        <Text style={styles.buttonText}>채팅하러 가기</Text>
                        <Text style={styles.buttonText}>체팅으로도 충분히 재밌으니까</Text>
                    </View>
                    <View style={styles.rightTextContainer}>
                        <Image source={homeC} style={styles.mainIcon} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* 3개의 버튼을 한 줄에 배치 */}
            <View style={styles.buttonRow2}>
                {/* 게시판 버튼 */}
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]} onPress={() => navigation.navigate('BoardList')}>
                    <View style={styles.iconContainer}>
                        <Image source={homeB2} style={styles.mainIcon} />
                        <Image source={homeB1} style={styles.mainIcon} />
                    </View>
                </TouchableOpacity>

                {/* 룰렛 버튼 */}
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 1 }]} onPress={() => navigation.navigate('Roulette')}>
                    <View style={styles.singleIconContainer}>
                        <Image source={homeR} style={styles.mainIcon} />
                    </View>
                </TouchableOpacity>

                {/* 공지사항 버튼 */}
                <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]} onPress={() => navigation.navigate('NoticeList')}>
                    <View style={styles.singleIconContainer}>
                        <Image source={homeN} style={styles.mainIcon} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* 텍스트 설명 */}
            <View style={styles.buttonRow2Text}>
                <Text style={styles.textItem}>오늘의 술상 자랑</Text>
                <Text style={styles.textItemSmall}>안주 룰렛</Text>
                <Text style={styles.textItem}>공지 사항</Text>
            </View>

            {/* 하단 버튼들 */}
            <View style={styles.buttonRow3}>
                <TouchableOpacity style={styles.botButton} onPress={() => navigation.navigate('ReportList')}>
                    <Text style={styles.buttonText}>신고 게시판(관리자)(임시)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botButton} onPress={() => navigation.navigate('UserSearchList')}>
                    <Text style={styles.buttonText}>유저 검색(임시)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botButton} onPress={() => navigation.navigate('BotResponse')}>
                    <Image source={homeBot} style={styles.mainIcon} />
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
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
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    loginText: {
        color: '#000000',
        fontSize: 19,
    },
    mainImageContainer: {
        height: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    mainImage: {
        flex: 1,
        borderRadius: 10,
    },
    mainIcon: {
        width: 40,  // 아이콘 크기 설정
        height: 40,
        margin: 5,  // 아이콘 간 간격
    },
    buttonRow1: {
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    leftTextContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    rightTextContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    buttonRow2: {
        height: '9%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',  // 아이콘들을 가로 중앙에 배치
    },
    singleIconContainer: {
        justifyContent: 'center',  // 이미지가 중앙 정렬되도록
        alignItems: 'center',
    },
    buttonRow2Text: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    textItem: {
        width: '40%',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    textItemSmall: {
        width: '20%',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonRow3: {
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    featureButton: {
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    subFeatureButton: {
        backgroundColor: '#F8F8F8',
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',   // 자식 요소가 가로 중앙으로 오도록 설정
        justifyContent: 'center',  // 자식 요소가 세로 중앙으로 오도록 설정
    },
    botButton: {
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#000000',
        fontSize: 13,
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