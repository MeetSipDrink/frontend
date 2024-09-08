import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './src/pages/auth-management-pages/HomePage/HomePage'; // 홈 페이지 경로
import LoginPage from './src/pages/auth-management-pages/LoginPage/LoginPage';
import SignUpFormPage from "./src/pages/auth-management-pages/SignUpFormPage/SignUpFormPage";
import SignUpAgreementPage from "./src/pages/auth-management-pages/SignUpAgreementPage/SignUpAgreementPage";
import MyPage from "./src/pages/profile-management-pages/MyPage/MyPage";
import FriendListPage from "./src/pages/profile-management-pages/FriendListPage/FriendListPage";
import FriendRequestPage from "./src/pages/profile-management-pages/FriendRequestPage/FriendRequestPage";
import BlockListPage from "./src/pages/profile-management-pages/BlockListPage/BlockListPage";
import ProfileEditorPage from "./src/pages/profile-management-pages/ProfileEditorPage/ProfileEditorPage";
import BoardEditPage from "./src/pages/board-system-pages/BoardEditPage/BoardEditPage";
import BoardPostPage from "./src/pages/board-system-pages/BoardPostPage/BoardPostPage";
import BoardViewPage from "./src/pages/board-system-pages/BoardViewPage/BoardViewPage";
import BoardListPage from "./src/pages/board-system-pages/BoardListPage/BoardListPage";
import ChatRoomListPage from "./src/pages/communication-tools-pages/ChatRoomListPage/ChatRoomListPage";
import ChatRoomPage from "./src/pages/communication-tools-pages/ChatRoomPage/ChatRoomPage";
import VideoChatPage from "./src/pages/communication-tools-pages/VideoChatPage/VideoChatPage";
import RoulettePage from "./src/pages/extra-features-pages/RoulettePage/RoulettePage";
import BotResponsePage from "./src/pages/extra-features-pages/BotResponsePage/BotResponsePage";
import UserSearchListPage from "./src/pages/extra-features-pages/UserSearchListPage/UserSearchListPage";
import NoticeListPage from "./src/pages/admin-management-pages/NoticeListPage/NoticeListPage";
import NoticePostPage from "./src/pages/admin-management-pages/NoticePostPage/NoticePostPage";
import NoticeViewPage from "./src/pages/admin-management-pages/NoticeViewPage/NoticeViewPage";
import NoticeEditPage from "./src/pages/admin-management-pages/NoticeEditPage/NoticeEditPage";
import ChatRoomEditPage from "./src/pages/communication-tools-pages/ChatRoomEditPage/ChatRoomEditPage";
import ReportListPage from "./src/pages/admin-management-pages/ReportListPage/ReportListPage";


// Stack Navigator 생성
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpFormPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="SignUpAgreement"
                    component={SignUpAgreementPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="MyPage"
                    component={MyPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="FriendList"
                    component={FriendListPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="FriendRequest"
                    component={FriendRequestPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="BlockList"
                    component={BlockListPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="ProfileEditor"
                    component={ProfileEditorPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="BoardList"
                    component={BoardListPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="BoardView"
                    component={BoardViewPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="BoardPost"
                    component={BoardPostPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="BoardEdit"
                    component={BoardEditPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="ChatRoomList"
                    component={ChatRoomListPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="ChatRoomEdit"
                    component={ChatRoomEditPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="ChatRoom"
                    component={ChatRoomPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="VideoChat"
                    component={VideoChatPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="Roulette"
                    component={RoulettePage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="BotResponse"
                    component={BotResponsePage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="UserSearchList"
                    component={UserSearchListPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="NoticeList"
                    component={NoticeListPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="NoticeView"
                    component={NoticeViewPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="NoticePost"
                    component={NoticePostPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="NoticeEdit"
                    component={NoticeEditPage}
                    options={{ headerShown: false }}/>
                <Stack.Screen
                    name="ReportList"
                    component={ReportListPage}
                    options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}