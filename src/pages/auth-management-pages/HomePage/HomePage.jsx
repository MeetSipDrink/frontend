import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Homeimg from './MainImage/Homeimg';  // 메인 페이지 이미지 컴포넌트 불러오기
import homeB1 from '../../../assets/images/homeB1.png';
import homeB2 from '../../../assets/images/homeB2.png';
import homeC from '../../../assets/images/homeC.png';
import homeN from '../../../assets/images/homeN.png';
import homeR from '../../../assets/images/homeR.png';
import homeV from '../../../assets/images/homeV.png';
import ChatBotExample from "./Bot/ChatBotExample";  // 챗봇 예시 컴포넌트 불러오기
import Icon from "react-native-vector-icons/Ionicons";  // 아이콘 라이브러리 불러오기
import SlotMachine from "../../extra-features-pages/BotResponsePage/BotResponsePage";  // SlotMachine 컴포넌트 추가

export default function HomePage() {
    const navigation = useNavigation();  // 네비게이션 훅 사용

    return (
        <View style={styles.container}>
            {/* 고정된 헤더 영역 */}
            <View style={styles.header}>
                <Text style={styles.headerText}>한마디 한 잔</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>
            </View>

            {/* 스크롤 가능한 콘텐츠 */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* SlotMachine 컴포넌트를 헤더와 메인 이미지 사이에 배치 */}
                <View style={styles.slotMachineContainer}>
                    <SlotMachine />
                </View>

                {/* 메인 이미지 컴포넌트 */}
                <Homeimg />

                {/* 주요 기능 버튼들 */}
                <View style={styles.buttonRow1}>
                    <TouchableOpacity style={[styles.featureButton, { flex: 1 }]} onPress={() => navigation.navigate('VideoChat')}>
                        <View style={styles.leftTextContainer}>
                            <Text style={styles.buttonText}>화상채팅하러가기</Text>
                            <Text style={styles.buttonText}>오늘 나의 술친구는 누굴까?</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Image source={homeV} style={styles.mainIcon} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.featureButton, { flex: 1 }]} onPress={() => navigation.navigate('ChatRoomList')}>
                        <View style={styles.leftTextContainer}>
                            <Text style={styles.buttonText}>채팅하러 가기</Text>
                            <Text style={styles.buttonText}>채팅으로도 충분히 재밌으니까</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Image source={homeC} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 두 번째 버튼 그룹 */}
                <View style={styles.buttonRow2}>
                    <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]} onPress={() => navigation.navigate('BoardList')}>
                        <View style={styles.iconContainer}>
                            <Image source={homeB2} />
                            <Image source={homeB1} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.subFeatureButton, { flex: 1 }]} onPress={() => navigation.navigate('Roulette')}>
                        <View style={styles.singleIconContainer}>
                            <Image source={homeR} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]} onPress={() => navigation.navigate('NoticeList')}>
                        <View style={styles.singleIconContainer}>
                            <Image source={homeN} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 버튼 그룹 설명 텍스트 */}
                <View style={styles.buttonRow2Text}>
                    <Text style={styles.textItem}>오늘의 술상 자랑</Text>
                    <Text style={styles.textItemSmall}>안주 룰렛</Text>
                    <Text style={styles.textItem}>공지 사항</Text>
                </View>

                {/* 챗봇 예시 */}
                <View>
                    <ChatBotExample />
                </View>
            </ScrollView>

            {/* 하단 네비게이션 바 */}
            <View style={styles.bottomNavigation}>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('ChatRoomList')}>
                    <Icon name="chatbubble-outline" size={24} color="#333" style={styles.image} />
                    <Text style={styles.navItem}>채팅방</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('FriendList')}>
                    <Icon name="people-outline" size={24} color="#333" style={styles.image} />
                    <Text style={styles.navItem}>친구 만나러 가기</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('Home')}>
                    <Icon name="home-outline" size={24} color="#333" style={styles.image} />
                    <Text style={styles.navItem}>홈</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('BoardList')}>
                    <Icon name="list-outline" size={24} color="#333" style={styles.image} />
                    <Text style={styles.navItem}>자랑 게시판</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('MyPage')}>
                    <Icon name="person-outline" size={24} color="#333" style={styles.image} />
                    <Text style={styles.navItem}>마이 페이지</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        paddingTop: 100, // 헤더 높이만큼 추가 패딩을 줘서 콘텐츠가 헤더 밑으로 가도록 설정
    },
    header: {
        position: 'absolute', // 고정된 위치로 설정
        top: 0,
        left: 0,
        right: 0,
        height: 100, // 헤더 높이
        zIndex: 1, // 헤더가 스크롤 내용보다 위에 오도록 설정
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
    slotMachineContainer: {
        height: 100, // SlotMachine이 차지할 공간을 설정
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
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
        justifyContent: 'center',
    },
    singleIconContainer: {
        justifyContent: 'center',
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
        alignItems: 'center',
        justifyContent: 'center',
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