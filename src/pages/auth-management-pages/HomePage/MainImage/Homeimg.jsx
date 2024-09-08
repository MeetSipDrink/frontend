import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import main1 from '../../../../assets/mainimg/1.png';
import main2 from '../../../../assets/mainimg/2.png';
import main3 from '../../../../assets/mainimg/3.png';
import main4 from '../../../../assets/mainimg/4.png';
import main5 from '../../../../assets/mainimg/5.png';
import main6 from '../../../../assets/mainimg/6.png';
import main7 from '../../../../assets/mainimg/7.png';
import main8 from '../../../../assets/mainimg/8.png';

const { width, height } = Dimensions.get('window'); // 화면의 너비와 높이 가져오기

const images = [main1, main2, main3, main4, main5, main6, main7, main8];

const Homeimg = ({ slideInterval = 3000 }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const intervalRef = useRef(null);

    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, []);

    // 자동 슬라이드 시작
    const startAutoSlide = () => {
        stopAutoSlide(); // 중복 슬라이드 방지
        intervalRef.current = setInterval(() => goToNextImage(), slideInterval);
    };

    // 자동 슬라이드 중지
    const stopAutoSlide = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    // 이미지 슬라이드 처리
    const slideImage = (direction) => {
        const toValue = direction === 'next' ? -width : width;
        Animated.timing(slideAnim, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setImageIndex((prevIndex) =>
                direction === 'next'
                    ? (prevIndex + 1) % images.length
                    : (prevIndex - 1 + images.length) % images.length
            );
            slideAnim.setValue(0);
        });
    };

    // 다음 이미지로 이동
    const goToNextImage = () => slideImage('next');
    // 이전 이미지로 이동
    const goToPrevImage = () => slideImage('prev');

    // 스와이프 이벤트 처리
    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            const { translationX } = event.nativeEvent;
            if (translationX < -width / 4) {
                goToNextImage();
            } else if (translationX > width / 4) {
                goToPrevImage();
            } else {
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
            startAutoSlide();
        } else if (event.nativeEvent.state === State.BEGAN) {
            stopAutoSlide();
        }
    };

    return (
        <View style={styles.mainImageContainer}>
            <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
                <Animated.View style={[styles.imageRow, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.imageWrapper}>
                        <Image source={images[imageIndex]} style={styles.image} />
                    </View>
                    <View style={styles.imageWrapper}>
                        <Image source={images[(imageIndex + 1) % images.length]} style={styles.image} />
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    mainImageContainer: {
        height: 300,
        width: '100%',
        justifyContent: 'center',
        marginTop: 10,
        overflow: 'hidden',
    },
    imageRow: {
        flexDirection: 'row',
        width: width * 2, // 너비를 두 배로 설정하여 두 개의 이미지를 나란히 배치
    },
    imageWrapper: {
        width: width,
        height: 300, // 높이를 명시적으로 지정
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // 이미지가 화면에 맞게 조정됨
    },
});

export default Homeimg;