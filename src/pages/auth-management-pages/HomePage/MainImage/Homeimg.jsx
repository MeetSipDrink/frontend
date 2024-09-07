// src/screens/Homeimg.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';  // 아이콘 라이브러리 추가
import main1 from '../../../../assets/mainimg/1.png';
import main2 from '../../../../assets/mainimg/2.png';
import main3 from '../../../../assets/mainimg/3.png';
import main4 from '../../../../assets/mainimg/4.png';
import main5 from '../../../../assets/mainimg/5.png';
import main6 from '../../../../assets/mainimg/6.png';
import main7 from '../../../../assets/mainimg/7.png';
import main8 from '../../../../assets/mainimg/8.png';

const { width } = Dimensions.get('window');  // 화면의 가로 길이를 가져옴

const AutoImageChanger = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const images = [main1, main2, main3, main4, main5, main6, main7, main8];

    const slideAnim = useRef(new Animated.Value(0)).current;
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            slideImage('next');
        }, 3000); // 3초마다 이미지 변경

        return () => clearInterval(interval);
    }, [imageIndex]);

    const updateImageIndex = (prevIndex, direction) => {
        if (direction === 'next') {
            return (prevIndex + 1) % images.length;
        } else {
            return (prevIndex - 1 + images.length) % images.length;
        }
    };

    const slideImage = (direction) => {
        if (isAnimating) return;
        setIsAnimating(true);

        let toValue = direction === 'next' ? -width : width;

        Animated.timing(slideAnim, {
            toValue,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setImageIndex((prevIndex) => updateImageIndex(prevIndex, direction));

            slideAnim.setValue(0);
            setIsAnimating(false);
        });
    };

    return (
        <View style={styles.mainImageContainer}>
            <Animated.View
                style={[
                    styles.imageRow,
                    { transform: [{ translateX: slideAnim }] },
                ]}
            >
                <View style={styles.imageWrapper}>
                    <Image source={images[(imageIndex - 1 + images.length) % images.length]} style={styles.image} />
                </View>
                <View style={styles.imageWrapper}>
                    <Image source={images[imageIndex]} style={styles.image} />
                </View>
                <View style={styles.imageWrapper}>
                    <Image source={images[(imageIndex + 1) % images.length]} style={styles.image} />
                </View>
            </Animated.View>

            {/* 이전 버튼 */}
            <TouchableOpacity style={styles.prevButton} onPress={() => slideImage('prev')}>
                <Ionicons name="chevron-back-outline" size={24} color="#ffffff" />
            </TouchableOpacity>

            {/* 다음 버튼 */}
            <TouchableOpacity style={styles.nextButton} onPress={() => slideImage('next')}>
                <Ionicons name="chevron-forward-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const Homeimg = () => {
    return (
        <View style={styles.container}>
            <AutoImageChanger />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    mainImageContainer: {
        height: 300,
        width: '100%',
        justifyContent: 'center',
        marginTop: 10,
        overflow: 'hidden',
    },
    imageRow: {
        flexDirection: 'row',
        width: width * 3,
    },
    imageWrapper: {
        width: width,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'contain',
    },
    prevButton: {
        position: 'absolute',
        left: 10,
        top: '40%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 10,
        borderRadius: 5,
    },
    nextButton: {
        position: 'absolute',
        right: 10,
        top: '40%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 10,
        borderRadius: 5,
    },
});

export default Homeimg;