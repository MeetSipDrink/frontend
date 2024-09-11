import React, { useState, useRef, useEffect } from 'react';
import {Text, StyleSheet, Animated, View} from 'react-native';

const foodList = ['소주', '맥주', '와인', '막걸리', '양주'];
const COMPONENT_HEIGHT = 100; // This value can be passed from the main component.

const Roulette = ({ panY, spinning, slowSpinning, style }) => {
    const [selectedFood, setSelectedFood] = useState('');
    const spinInterval = useRef(null);

    useEffect(() => {
        if (spinning) {
            spinInterval.current = setInterval(() => {
                setSelectedFood(foodList[Math.floor(Math.random() * foodList.length)]);
            }, 100);
        } else if (slowSpinning) {
            spinInterval.current = setInterval(() => {
                setSelectedFood(foodList[Math.floor(Math.random() * foodList.length)]);
            }, 2000);
        } else {
            clearInterval(spinInterval.current);
        }

        return () => clearInterval(spinInterval.current);
    }, [spinning, slowSpinning]);

    const rouletteY = panY.interpolate({
        inputRange: [0, COMPONENT_HEIGHT],
        outputRange: [0, COMPONENT_HEIGHT],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View style={[styles.roulette, style, { transform: [{ translateY: rouletteY }] }]}>
            <View style={styles.rouletteTexts}>
            <Text style={styles.rouletteText}>{selectedFood  || ''}</Text>
            <Text style={styles.rouletteText}> 마시자</Text>
                </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    roulette: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: `#F9B300`,
        padding: 20,
    },
    rouletteText: {
        fontSize: 30,
        fontWeight: 'bold',
        width: 100, // 고정된 너비를 설정하여 밀리지 않도록 처리
        textAlign: 'center',
    },
    rouletteTexts: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default Roulette;