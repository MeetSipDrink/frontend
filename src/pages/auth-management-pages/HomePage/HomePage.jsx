import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, PanResponder, Dimensions, Animated, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';
import Homeimg from './MainImage/Homeimg';
import homeB1 from '../../../assets/images/homeB1.png';
import homeB2 from '../../../assets/images/homeB2.png';
import homeC from '../../../assets/images/homeC.png';
import homeN from '../../../assets/images/homeN.png';
import homeR from '../../../assets/images/homeR.png';
import homeV from '../../../assets/images/homeV.png';
import ChatBotExample from "./Bot/ChatBotExample";
import Roulette from './Roulette/Roulette';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ROULETTE_HEIGHT = SCREEN_HEIGHT / 10;
const ADS_API_URL = 'http://10.0.2.2:8080'; // 안드로이드 에뮬레이터 기준 localhost

const MainPage = ({ route, navigation }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const panY = useRef(new Animated.Value(-100)).current;
    const [spinning, setSpinning] = useState(false);
    const [isResultShown, setIsResultShown] = useState(false);
    const [slowSpinning, setSlowSpinning] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (route.params?.isLoggedIn === false) {
            setIsLoggedIn(false);
        }
    }, [route.params?.isLoggedIn]);

    const checkLoginStatus = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                const { accessToken } = JSON.parse(credentials.password);
                if (accessToken) {
                    setIsLoggedIn(true);
                    await fetchUserInfo(credentials);
                } else {
                    await logout();
                }
            } else {
                setIsLoggedIn(false);
                setUserName('');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            await logout();
        }
    };

    const logout = async () => {
        try {
            await Keychain.resetGenericPassword();
            setIsLoggedIn(false);
            setUserName('');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                const { accessToken } = JSON.parse(credentials.password);
                const response = await axios.get(`${ADS_API_URL}/members`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setUserName(response.data.data.nickname);
                console.log('User info fetched:', response.data.data.nickname);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            setUserName('사용자');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            checkLoginStatus();
        }, [])
    );

    const handleMyPageNavigation = () => {
        if (isLoggedIn) {
            Alert.alert(
                "마이페이지",
                "원하시는 작업을 선택해주세요.",
                [
                    { text: "마이페이지로 이동", onPress: () => navigation.navigate('MyPage') },
                    { text: "로그아웃", onPress: logout },
                    { text: "취소", style: "cancel" }
                ]
            );
        } else {
            navigation.navigate('Login');
        }
    };

    const handleNavigation = (screenName) => {
        if (isLoggedIn) {
            navigation.navigate(screenName);
        } else {
            Alert.alert(
                "로그인 필요",
                "이 기능을 사용하려면 로그인이 필요합니다.",
                [
                    { text: "취소", style: "cancel" },
                    { text: "로그인", onPress: () => navigation.navigate('Login') }
                ]
            );
        }
    };

    const stopSlowly = () => {
        let remainingTime = 1000;
        const interval = setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime <= 0) {
                clearInterval(interval);
                setSlowSpinning(false);
                setSpinning(false);
                showResult();
            }
        }, 1000);
    };

    const showResult = () => {
        setIsResultShown(true);
        setTimeout(() => {
            setIsResultShown(false);
            resetPosition();
        }, 2000);
    };

    const resetPosition = () => {
        Animated.timing(panY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setSpinning(false);
        });
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            panY.setValue(gestureState.dy);
            if (gestureState.dy > 0 && !spinning) {
                setSpinning(true);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > ROULETTE_HEIGHT) {
                Animated.sequence([
                    Animated.timing(panY, {
                        toValue: ROULETTE_HEIGHT,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setSlowSpinning(true);
                    stopSlowly();
                });
            } else {
                Animated.spring(panY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start(() => {
                    setSpinning(false);
                    setIsResultShown(false);
                });
            }
        },
    });

    const rouletteTranslateY = panY.interpolate({
        inputRange: [-ROULETTE_HEIGHT, 0, ROULETTE_HEIGHT],
        outputRange: [-ROULETTE_HEIGHT, 0, 0],
        extrapolate: 'clamp',
    });

    const contentTranslateY = panY.interpolate({
        inputRange: [0, ROULETTE_HEIGHT],
        outputRange: [0, ROULETTE_HEIGHT],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>한마디 한 잔</Text>
                <TouchableOpacity style={styles.loginButton} onPress={handleMyPageNavigation}>
                    <Text style={styles.loginText}>
                        {isLoggedIn ? `${userName}님` : '로그인'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Animated.View style={[
                styles.rouletteContainer,
                { transform: [{ translateY: rouletteTranslateY }] }
            ]}>
                <Roulette panY={panY} spinning={spinning} slowSpinning={slowSpinning} />
            </Animated.View>

            <Animated.ScrollView
                {...panResponder.panHandlers}
                style={[styles.scrollView, { transform: [{ translateY: contentTranslateY }] }]}
                contentContainerStyle={styles.scrollContainer}
            >
                <Homeimg style={styles.homeImage} />

                <View style={styles.buttonRow1}>
                    <TouchableOpacity
                        style={[styles.featureButton, { flex: 1 }]}
                        onPress={() => handleNavigation('VideoChat')}
                    >
                        <View style={styles.leftTextContainer}>
                            <Text style={[styles.buttonText, {fontWeight:'bold'}]}>화상채팅하러가기</Text>
                            <Text style={styles.buttonText}>오늘 나의 술친구는 누굴까?</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Image source={homeV} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.featureButton, { flex: 1 }]}
                        onPress={() => handleNavigation('ChatRoomList')}
                    >
                        <View style={styles.leftTextContainer}>
                            <Text style={[styles.buttonText, {fontWeight:'bold'}]}>채팅하러 가기</Text>
                            <Text style={styles.buttonText}>채팅으로도 충분히 재밌으니까</Text>
                        </View>
                        <View style={styles.rightTextContainer}>
                            <Image source={homeC} />
                        </View>
                    </TouchableOpacity>
                </View>

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

                <View style={styles.buttonRow2Text}>
                    <Text style={styles.textItem}>오늘의 술상 자랑</Text>
                    <Text style={styles.textItemSmall}>안주 룰렛</Text>
                    <Text style={styles.textItem}>공지 사항</Text>
                </View>

                <TouchableOpacity onPress={() => handleNavigation('ChatBot')}>
                    <View>
                        <ChatBotExample />
                    </View>
                </TouchableOpacity>
            </Animated.ScrollView>
        </View>
    );
}

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