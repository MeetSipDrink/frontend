import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Easing, Dimensions, Alert } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle, Polygon, Defs, RadialGradient, Stop, LinearGradient } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const ARROW_SIZE = 40;

const Roulette = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [lastRotation, setLastRotation] = useState(0);

  useEffect(() => {
    spinValue.addListener(({ value }) => {
      setLastRotation(value);
    });
    return () => spinValue.removeAllListeners();
  }, []);

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    } else {
      Alert.alert('입력 오류', '메뉴를 입력한 후 버튼을 클릭해 주세요');
    }
  };

  const spin = () => {
    if (items.length < 2) {
      Alert.alert('메뉴 부족', '2개 이상의 메뉴를 입력해 주세요');
      return;
    }
    setIsSpinning(true);

    const totalSpins = 5 + Math.random() * 5; // 5~10 회전
    const totalRotation = lastRotation + totalSpins * 360;

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 4000, // 4초 동안 회전
      easing: (t) => {
        if (t < 0.5) {
          return 4 * t * t * t; // 빠른 시작
        } else {
          return 1 - Math.pow(-2 * t + 2, 3) / 2; // 느린 종료
        }
      },
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
    });
  };

  const resetRoulette = () => {
    setItems([]);
    // 초기화 시 마지막 회전 위치를 유지합니다.
    spinValue.setValue(lastRotation);
  };

  const renderSlices = () => {
    if (items.length === 0) {
      return null;
    }

    if (items.length === 1) {
      return (
          <G>
            <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_SIZE / 2 - 5}
                fill="url(#singleItemGradient)"
            />
            <SvgText
                x={CIRCLE_SIZE / 2}
                y={CIRCLE_SIZE / 2}
                fill="white"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
            >
              {items[0]}
            </SvgText>
          </G>
      );
    }

    return items.map((item, index) => {
      const sliceAngle = 360 / items.length;
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;

      const x1 = CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 2) * Math.cos((Math.PI * startAngle) / 180);
      const y1 = CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 2) * Math.sin((Math.PI * startAngle) / 180);
      const x2 = CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 2) * Math.cos((Math.PI * endAngle) / 180);
      const y2 = CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 2) * Math.sin((Math.PI * endAngle) / 180);

      const path = `M${CIRCLE_SIZE / 2},${CIRCLE_SIZE / 2} L${x1},${y1} A${CIRCLE_SIZE / 2},${CIRCLE_SIZE / 2} 0 0,1 ${x2},${y2} Z`;

      return (
          <G key={index}>
            <Defs>
              <RadialGradient id={`grad${index}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor={`hsl(${index * (360 / items.length)}, 100%, 70%)`} stopOpacity="1" />
                <Stop offset="100%" stopColor={`hsl(${index * (360 / items.length)}, 100%, 40%)`} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Path d={path} fill={`url(#grad${index})`} stroke="white" strokeWidth="2" />
            <SvgText
                x={CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 3) * Math.cos((Math.PI * (startAngle + sliceAngle / 2)) / 180)}
                y={CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 3) * Math.sin((Math.PI * (startAngle + sliceAngle / 2)) / 180)}
                fill="white"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(${90 + startAngle + sliceAngle / 2}, ${
                    CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 3) * Math.cos((Math.PI * (startAngle + sliceAngle / 2)) / 180)
                }, ${
                    CIRCLE_SIZE / 2 + (CIRCLE_SIZE / 3) * Math.sin((Math.PI * (startAngle + sliceAngle / 2)) / 180)
                })`}
            >
              {item}
            </SvgText>
          </G>
      );
    });
  };

  const renderArrow = () => (
      <Svg height={ARROW_SIZE} width={ARROW_SIZE} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FF4500" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FF8C00" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Polygon
            points="50,0 0,100 100,100"
            fill="url(#arrowGradient)"
            stroke="black"
            strokeWidth="5"
        />
        <Circle
            cx="50"
            cy="75"
            r="20"
            fill="gold"
            stroke="black"
            strokeWidth="5"
        />
      </Svg>
  );

  return (
      <View style={styles.container}>
        <View style={styles.wheelContainer}>
          <Animated.View
              style={[
                styles.wheel,
                {
                  transform: [
                    {
                      rotate: spinValue.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
          >
            <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE}>
              <Defs>
                <RadialGradient id="singleItemGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <Stop offset="0%" stopColor="#4CAF50" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#2E7D32" stopOpacity="1" />
                </RadialGradient>
              </Defs>
              <Circle cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_SIZE / 2} fill="#FFFFFF" />
              <Circle cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={CIRCLE_SIZE / 2 - 5} fill="none" stroke="#333333" strokeWidth="2" />
              {items.length > 0 ? renderSlices() : (
                  <SvgText
                      x={CIRCLE_SIZE / 2}
                      y={CIRCLE_SIZE / 2}
                      fill="#333333"
                      fontSize="16"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                  >
                    2개 이상의 메뉴를 추가해주세요
                  </SvgText>
              )}
            </Svg>
          </Animated.View>
        </View>
        <View style={styles.arrowContainer}>
          {renderArrow()}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
              style={styles.input}
              value={newItem}
              onChangeText={setNewItem}
              placeholder="새 메뉴 입력"
              editable={!isSpinning}
          />
          <TouchableOpacity style={styles.button} onPress={addItem} disabled={isSpinning}>
            <Text style={styles.buttonText}>추가</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.spinButton, isSpinning && styles.disabledButton]} onPress={spin} disabled={isSpinning}>
          <Text style={styles.spinButtonText}>{isSpinning ? '돌아가는 중...' : '돌려돌려 돌림판'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.resetButton, isSpinning && styles.disabledButton]} onPress={resetRoulette} disabled={isSpinning}>
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  wheel: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  arrowContainer: {
    marginTop: -ARROW_SIZE / 2,
    marginBottom: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#febf00',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  spinButton: {
    backgroundColor: '#febf00',
    padding: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  spinButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  resetButton: {
    backgroundColor: '#febf00',
    padding: 15,
    borderRadius: 25,
    marginTop: 15,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default Roulette;