import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;

const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 70%, 70%)`;
};

const Roulette = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [colors, setColors] = useState([]);
    const [result, setResult] = useState('');
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setColors(items.map(() => getRandomColor()));
    }, [items]);

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        } else {
            alert('메뉴를 입력한 후 버튼을 클릭 해 주세요');
        }
    };

    const spin = () => {
        const randomSpin = Math.floor(Math.random() * 360) + 720; // At least 2 full rotations
        spinValue.setValue(0);
        if (items.length <= 2) {
            alert('2개 이상의 메뉴를 입력해 주세요');
            return;
        }
        Animated.timing(spinValue, {
            toValue: randomSpin,
            duration: 2000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => {
            const index = Math.floor(((randomSpin % 360) / 360) * items.length);
            setResult(items[index]);
        });
    };

    const rotation = spinValue.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
    });

    const renderSlices = () => {
        const slices = [];
        const sliceAngle = 360 / items.length;

        items.forEach((item, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = (index + 1) * sliceAngle;

            const x1 = CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2 * Math.cos(Math.PI * startAngle / 180);
            const y1 = CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2 * Math.sin(Math.PI * startAngle / 180);
            const x2 = CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2 * Math.cos(Math.PI * endAngle / 180);
            const y2 = CIRCLE_SIZE / 2 + CIRCLE_SIZE / 2 * Math.sin(Math.PI * endAngle / 180);

            const path = `M${CIRCLE_SIZE / 2},${CIRCLE_SIZE / 2} L${x1},${y1} A${CIRCLE_SIZE / 2},${CIRCLE_SIZE / 2} 0 0,1 ${x2},${y2} Z`;

            slices.push(
                <G key={index}>
                    <Path d={path} fill={colors[index]} />
                    <SvgText
                        x={CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 3) * Math.cos(Math.PI * (startAngle + sliceAngle / 2) / 180)}
                        y={CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 3) * Math.sin(Math.PI * (startAngle + sliceAngle / 2) / 180)}
                        fill="black"
                        fontSize="16"
                        fontWeight="bold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        {item}
                    </SvgText>
                </G>
            );
        });

        return slices;
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="새 메뉴 입력"
                />
                <TouchableOpacity style={styles.button} onPress={addItem}>
                    <Text style={styles.buttonText}>메뉴 추가</Text>
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.wheel, { transform: [{ rotate: rotation }] }]}>
                <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE}>
                    {renderSlices()}
                </Svg>
            </Animated.View>
            <View style={styles.pointer} />
            <TouchableOpacity style={styles.button} onPress={spin}>
                <Text style={styles.buttonText}>돌려돌려 돌림판</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f8fc',
    },
    wheel: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pointer: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 30,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'red',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#febf00',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 200,
        marginRight: 10,
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default Roulette;