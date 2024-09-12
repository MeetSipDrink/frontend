import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Alert,
} from 'react-native';
import Svg, {Path, G, Text as SvgText, Circle} from 'react-native-svg';

const {width} = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;

const getRandomColor = () => `hsl(${Math.random() * 360}, 70%, 70%)`;

const Roulette = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [colors, setColors] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 항목의 개수에 따라 색상 설정
    setColors(items.map(() => getRandomColor()));
  }, [items]);

  const addItem = () => {
    if (!newItem.trim()) {
      Alert.alert('입력 오류', '메뉴를 입력한 후 버튼을 클릭해 주세요');
      return;
    }
    setItems([...items, newItem.trim()]);
    setNewItem('');
  };

  const spin = () => {
    if (items.length < 2) {
      Alert.alert('메뉴 부족', '2개 이상의 메뉴를 입력해 주세요');
      return;
    }
    setIsSpinning(true);
    const arc = 360 / items.length;
    const baseRotation = 3600; // 최소 10바퀴(3600도)
    const ran = Math.floor(Math.random() * items.length);
    const extraRotation = arc * 3;
    const correctionOffset = 360 - arc / 2;
    const randomSpin =
      ran * arc + baseRotation + extraRotation + correctionOffset;

    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: randomSpin,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
    });
  };

  const resetRoulette = () => {
    setItems([]);
    setColors([]);
    spinValue.setValue(0);
  };

  const rotation = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderSlices = () => {
    const slices = [];

    if (items.length === 1) {
      // 아이템이 1개일 때 원 전체에 색상을 채움
      slices.push(
        <G key={0}>
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={CIRCLE_SIZE / 2}
            fill={colors[0]}
          />
          <SvgText
            x={CIRCLE_SIZE / 2}
            y={CIRCLE_SIZE / 2}
            fill="black"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle">
            {items[0]}
          </SvgText>
        </G>,
      );
    } else {
      const sliceAngle = 360 / items.length;

      items.forEach((item, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = (index + 1) * sliceAngle;

        const x1 =
          CIRCLE_SIZE / 2 +
          (CIRCLE_SIZE / 2) * Math.cos((Math.PI * startAngle) / 180);
        const y1 =
          CIRCLE_SIZE / 2 +
          (CIRCLE_SIZE / 2) * Math.sin((Math.PI * startAngle) / 180);
        const x2 =
          CIRCLE_SIZE / 2 +
          (CIRCLE_SIZE / 2) * Math.cos((Math.PI * endAngle) / 180);
        const y2 =
          CIRCLE_SIZE / 2 +
          (CIRCLE_SIZE / 2) * Math.sin((Math.PI * endAngle) / 180);

        const path = `M${CIRCLE_SIZE / 2},${CIRCLE_SIZE / 2} L${x1},${y1} A${
          CIRCLE_SIZE / 2
        },${CIRCLE_SIZE / 2} 0 0,1 ${x2},${y2} Z`;

        slices.push(
          <G key={index}>
            <Path
              d={path}
              fill={colors[index]}
              stroke="white"
              strokeWidth="2"
            />
            <SvgText
              x={
                CIRCLE_SIZE / 2 +
                (CIRCLE_SIZE / 3) *
                  Math.cos((Math.PI * (startAngle + sliceAngle / 2)) / 180)
              }
              y={
                CIRCLE_SIZE / 2 +
                (CIRCLE_SIZE / 3) *
                  Math.sin((Math.PI * (startAngle + sliceAngle / 2)) / 180)
              }
              fill="black"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${90 + startAngle + sliceAngle / 2}, ${
                CIRCLE_SIZE / 2 +
                (CIRCLE_SIZE / 3) *
                  Math.cos((Math.PI * (startAngle + sliceAngle / 2)) / 180)
              }, ${
                CIRCLE_SIZE / 2 +
                (CIRCLE_SIZE / 3) *
                  Math.sin((Math.PI * (startAngle + sliceAngle / 2)) / 180)
              })`}>
              {item}
            </SvgText>
          </G>,
        );
      });
    }

    return slices;
  };

  return (
    <View style={styles.container}>
      <View style={styles.wheelContainer}>
        <Animated.View
          style={[styles.wheel, {transform: [{rotate: rotation}]}]}>
          <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE}>
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_SIZE / 2 - 5}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
            />
            {renderSlices()}
          </Svg>
        </Animated.View>
        <View style={styles.arrowContainer}>
          <AntDesign name="caretdown" size={25} color="red" />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newItem}
          onChangeText={setNewItem}
          placeholder="새 메뉴 입력"
          editable={!isSpinning}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={addItem}
          disabled={isSpinning}>
          <Text style={styles.buttonText}>추가</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.disabledButton]}
        onPress={spin}
        disabled={isSpinning}>
        <Text style={styles.spinButtonText}>
          {isSpinning ? '돌아가는 중...' : '돌려돌려 돌림판'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.resetButton, isSpinning && styles.disabledButton]}
        onPress={resetRoulette}
        disabled={isSpinning}>
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
  wheelContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  wheel: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  arrowContainer: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
  },
  spinButton: {
    backgroundColor: '#febf00',
    padding: 15,
    borderRadius: 25,
    marginTop: 30,
    elevation: 5,
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
    elevation: 5,
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
