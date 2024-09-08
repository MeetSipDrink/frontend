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
import Icon from "react-native-vector-icons/Ionicons";
import Roulette from './Roulette/Roulette';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const ROULETTE_HEIGHT = SCREEN_HEIGHT / 8; // Reduced roulette height

const MainPage = () => {
    const navigation = useNavigation();
    const panY = useRef(new Animated.Value(0)).current;
    const [spinning, setSpinning] = useState(false);
    const [isResultShown, setIsResultShown] = useState(false);
    const [slowSpinning, setSlowSpinning] = useState(false);

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
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>로그인</Text>
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

                <View style={styles.buttonRow2}>
                    <TouchableOpacity style={[styles.subFeatureButton, { flex: 2 }]} onPress={() => navigation.navigate('BoardList')}>
                        <View style={styles.iconContainer}>
                            <Image source={homeB2} />
                            <Image source={homeB1} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.subFeatureButton, { flex: 1 }]} onPress={() => navigation.navigate('ScrollHandler')}>
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

                <View>
                    <ChatBotExample />
                </View>
            </Animated.ScrollView>

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
    header: {
        height: 80, // 헤더 높이 축소
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        paddingTop: 30, // 상태 바 공간 고려하여 조정
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
        top: 0, // 헤더 바로 아래 위치
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
        height: 180, // 이미지 높이 수정
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
        flexDirection: 'row',
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
    bottomNavigation: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#e0e0e0',
    },
    navItemContainer: {
        alignItems: 'center',
    },
    image: {
        marginBottom: 5,
    },
    navItem: {
        fontSize: 11,
        color: '#333',
    },
});

export default MainPage;