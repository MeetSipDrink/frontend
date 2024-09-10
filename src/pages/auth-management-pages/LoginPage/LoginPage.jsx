import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';

const FloatingLabelInput = ({ label }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasText, setHasText] = useState(false);
    const animatedIsFocused = useState(new Animated.Value(0))[0];

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    React.useEffect(() => {
        Animated.timing(animatedIsFocused, {
            toValue: (isFocused || hasText) ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, hasText]);

    const labelStyle = {
        position: 'absolute',
        left: 5,
        top: animatedIsFocused.interpolate({
            inputRange: [0, 0.9],
            outputRange: [25, 0],
        }),
        fontSize: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: ['#aaa', '#000'],
        }),
        backgroundColor: 'white',
        paddingHorizontal: 5,
    };

    return (
        <View style={styles.inputContainer}>
            <Animated.Text style={labelStyle}>
                {label}
            </Animated.Text>
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.focusedInput
                ]}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={(text) => setHasText(text.length > 0)}
                blurOnSubmit
            />
        </View>
    );
};

export default function LoginPage({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.pageText}>한마디 한 잔🍻</Text>
            <View style={styles.InputBox}>
                <FloatingLabelInput label="아이디" />
                <FloatingLabelInput label="비밀번호" />
            </View>
            <TouchableOpacity style={styles.LoginButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('SignUpForm')}>
                <Text>회원가입</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    pageText: {
        fontSize: 24,
        marginTop: 50,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    InputBox: {
        width: '70%',
        paddingVertical: 15,
    },
    inputContainer: {
        paddingTop: 18,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.23)',
        borderRadius: 7,
        paddingHorizontal: 10,
    },
    focusedInput: {
        borderColor: '#1976d2',
        borderWidth: 2,
    },
    LoginButton: {
        width: '70%',
        backgroundColor: '#F9B300',
        paddingVertical: 15,
        borderRadius: 5,
        margin: 10,
    },
    Button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});