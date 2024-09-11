import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, PanResponder, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Homeimg from './MainImage/Homeimg';
import homeB1 from '../../../assets/images/homeB1.png';
import homeB2 from '../../../assets/images/homeB2.png';
import homeC from '../../../assets/images/homeC.png';
import homeN from '../../../assets/images/homeN.png';
import homeR from '../../../assets/images/homeR.png';
import homeV from '../../../assets/images/homeV.png';
import ChatBotExample from "./Bot/ChatBotExample";
import Roulette from './Roulette/Roulette';

// 화면 크기를 가져와서 동적으로 요소의 크기를 설정
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// 룰렛의 높이를 화면 높이의 1/10로 설정
const ROULETTE_HEIGHT = SCREEN_HEIGHT / 10;

const MainPage = () => {
    const navigation = useNavigation(); // 네비게이션 사용을 위한 hook
    const panY = useRef(new Animated.Value(-100)).current; // 애니메이션 값으로 Y축 이동값을 관리
    const [spinning, setSpinning] = useState(false); // 룰렛 회전 상태 관리
    const [isResultShown, setIsResultShown] = useState(false); // 결과 표시 여부 관리
    const [slowSpinning, setSlowSpinning] = useState(false); // 느린 회전 상태 관리

    // 룰렛을 천천히 멈추게 하는 함수
    const stopSlowly = () => {
        let remainingTime = 1000; // 남은 시간을 1초로 설정

        const interval = setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime <= 0) {
                clearInterval(interval); // 시간이 끝나면 인터벌 중지
                setSlowSpinning(false); // 느린 회전 상태를 false로
                setSpinning(false); // 전체 회전 상태를 false로
                showResult(); // 결과 표시 함수 호출
            }
        }, 1000);
    };

    // 결과를 보여주는 함수
    const showResult = () => {
        setIsResultShown(true); // 결과를 표시
        setTimeout(() => {
            setIsResultShown(false); // 2초 후 결과 표시를 종료
            resetPosition(); // 애니메이션 상태 초기화
        }, 2000);
    };

    // 애니메이션 위치를 초기 상태로 리셋하는 함수
    const resetPosition = () => {
        Animated.timing(panY, {
            toValue: 0, // 초기 위치로 설정
            duration: 300, // 애니메이션 지속 시간
            useNativeDriver: true, // 네이티브 드라이버 사용
        }).start(() => {
            setSpinning(false); // 회전 상태 종료
        });
    };

    // PanResponder 생성, 드래그 동작 감지 및 반응
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true, // 드래그 시작 조건 설정
        onPanResponderMove: (_, gestureState) => {
            panY.setValue(gestureState.dy); // Y축 드래그 값을 업데이트
            if (gestureState.dy > 0 && !spinning) {
                setSpinning(true); // 드래그가 아래로 움직일 때 회전 상태를 true로 설정
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > ROULETTE_HEIGHT) {
                // 드래그가 일정 값 이상일 때
                Animated.sequence([
                    Animated.timing(panY, {
                        toValue: ROULETTE_HEIGHT, // 드래그 한계를 룰렛 높이로 설정
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setSlowSpinning(true); // 느린 회전 상태로 전환
                    stopSlowly(); // 천천히 멈추기 시작
                });
            } else {
                // 드래그 값이 적을 때 원래 위치로 돌아감
                Animated.spring(panY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start(() => {
                    setSpinning(false); // 회전 상태 종료
                    setIsResultShown(false); // 결과 표시 종료
                });
            }
        },
    });

    // 룰렛 Y축 이동 애니메이션 설정
    const rouletteTranslateY = panY.interpolate({
        inputRange: [-ROULETTE_HEIGHT, 0, ROULETTE_HEIGHT], // 입력 범위
        outputRange: [-ROULETTE_HEIGHT, 0, 0], // 출력 범위
        extrapolate: 'clamp', // 값 제한
    });

    // 스크롤 뷰의 Y축 이동 애니메이션 설정
    const contentTranslateY = panY.interpolate({
        inputRange: [0, ROULETTE_HEIGHT],
        outputRange: [0, ROULETTE_HEIGHT],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>한마디 한 잔</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>로그인</Text>
                </TouchableOpacity>
            </View>

            {/* 룰렛 애니메이션 영역 */}
            <Animated.View style={[
                styles.rouletteContainer,
                { transform: [{ translateY: rouletteTranslateY }] }
            ]}>
                <Roulette panY={panY} spinning={spinning} slowSpinning={slowSpinning} />
            </Animated.View>

            {/* 스크롤 뷰에 PanResponder를 연결하여 드래그 반응 처리 */}
            <Animated.ScrollView
                {...panResponder.panHandlers}
                style={[styles.scrollView, { transform: [{ translateY: contentTranslateY }] }]}
                contentContainerStyle={styles.scrollContainer}
            >
                <Homeimg style={styles.homeImage} />

                {/* 주요 버튼 영역 */}
                <View style={styles.buttonRow1}>
                    <TouchableOpacity style={[styles.featureButton, { flex: 1 }]} onPress={() => navigation.navigate('VideoChat')}>
                        <View style={styles.leftTextContainer}>
                            <Text style={[styles.buttonText, {fontWeight:'bold'}]}>화상채팅하러가기</Text>
                            <Text style={styles.buttonText}>오늘 나의 술친구는 누굴까?</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Image source={homeV} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.featureButton, { flex: 1 }]} onPress={() => navigation.navigate('ChatRoomList')}>
                        <View style={styles.leftTextContainer}>
                            <Text style={[styles.buttonText, {fontWeight:'bold'}]}>채팅하러 가기</Text>
                            <Text style={styles.buttonText}>채팅으로도 충분히 재밌으니까</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Image source={homeC} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 하단 버튼들 */}
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

                {/* 텍스트 설명 영역 */}
                <View style={styles.buttonRow2Text}>
                    <Text style={styles.textItem}>오늘의 술상 자랑</Text>
                    <Text style={styles.textItemSmall}>안주 룰렛</Text>
                    <Text style={styles.textItem}>공지 사항</Text>
                </View>

                <View>
                    <ChatBotExample />
                </View>
            </Animated.ScrollView>
        </View>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9B300',
        paddingTop: 20,
        paddingHorizontal: 15,
        zIndex: 10,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    loginButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    loginText: {
        color: '#000000',
        fontSize: 17,
    },
    rouletteContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: ROULETTE_HEIGHT,
        zIndex: 5,
    },
    scrollView: {
        flex: 1,
    },
    homeImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    buttonRow1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    buttonRow2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 20,
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
    leftTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rightTextContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        color: '#333',
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
});

export default MainPage;