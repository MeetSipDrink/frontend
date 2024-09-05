import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './src/pages/auth-management-pages/HomePage/HomePage';

// Stack Navigator 생성
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomePage}
                    options={{ headerShown: false }} // 헤더 숨기기
                />
                {/* 필요하다면 다른 페이지도 추가 가능 */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}