import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// 커스텀 BottomNavigation 컴포넌트 불러오기
import BottomNavigation from './pages/auth-management-pages/HomePage/bottomNavigation/bottomNavigation';

// 모든 화면 컴포넌트 불러오기
import HomePage from './pages/auth-management-pages/HomePage/HomePage';
import LoginPage from './pages/auth-management-pages/LoginPage/LoginPage';
import SignUpFormPage from './pages/auth-management-pages/SignUpFormPage/SignUpFormPage';
import SignUpAgreementPage from './pages/auth-management-pages/SignUpAgreementPage/SignUpAgreementPage';
import MyPage from './pages/profile-management-pages/MyPage/MyPage';
import FriendListPage from './pages/profile-management-pages/FriendListPage/FriendListPage';
import FriendRequestPage from './pages/profile-management-pages/FriendRequestPage/FriendRequestPage';
import BlockListPage from './pages/profile-management-pages/BlockListPage/BlockListPage';
import ProfileEditorPage from './pages/profile-management-pages/ProfileEditorPage/ProfileEditorPage';
import BoardEditPage from './pages/board-system-pages/BoardEditPage/BoardEditPage';
import BoardPostPage from './pages/board-system-pages/BoardPostPage/BoardPostPage';
import BoardViewPage from './pages/board-system-pages/BoardViewPage/BoardViewPage';
import BoardListPage from './pages/board-system-pages/BoardListPage/BoardListPage';
import ChatRoomListPage from './pages/communication-tools-pages/ChatRoomListPage/ChatRoomListPage';
import ChatRoomPage from './pages/communication-tools-pages/ChatRoomPage/ChatRoomPage';
import VideoChatPage from './pages/communication-tools-pages/VideoChatPage/VideoChatPage';
import RoulettePage from './pages/extra-features-pages/RoulettePage/RoulettePage';
import BotResponsePage from './pages/extra-features-pages/BotResponsePage/BotResponsePage';
import UserSearchListPage from './pages/extra-features-pages/UserSearchListPage/UserSearchListPage';
import NoticeListPage from './pages/admin-management-pages/NoticeListPage/NoticeListPage';
import NoticePostPage from './pages/admin-management-pages/NoticePostPage/NoticePostPage';
import NoticeViewPage from './pages/admin-management-pages/NoticeViewPage/NoticeViewPage';
import NoticeEditPage from './pages/admin-management-pages/NoticeEditPage/NoticeEditPage';
import ChatRoomEditPage from './pages/communication-tools-pages/ChatRoomEditPage/ChatRoomEditPage';
import ReportListPage from './pages/admin-management-pages/ReportListPage/ReportListPage';

// LoadingPage 불러오기
import LoadingPage from './pages/auth-management-pages/LoadingPage/LoadingPage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 커스텀 BottomNavigation을 사용하는 메인 탭 네비게이터
function MainTabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <BottomNavigation {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="ChatRoomList"
        component={ChatRoomListPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="BoardList"
        component={BoardListPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Roulette"
        component={RoulettePage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BotResponse"
        component={BotResponsePage}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

// 메인 앱 컴포넌트
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로딩 시간 시뮬레이션 (예: 데이터 가져오기)
    const loadApp = async () => {
      // 2초 대기 (여기에 실제 데이터를 로딩하는 로직 추가 가능)
      setTimeout(() => {
        setIsLoading(false); // 로딩 완료 시 상태 변경
      }, 2000);
    };

    loadApp();
  }, []);

  if (isLoading) {
    return <LoadingPage />; // 로딩 중일 때 로딩 페이지 표시
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTab">
        <Stack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{headerShown: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="SignUpForm"
          component={SignUpFormPage}
          options={{headerShown: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="SignUpAgreement"
          component={SignUpAgreementPage}
          options={{headerShown: true, headerTitle: '회원가입'}}
        />
        <Stack.Screen
          name="FriendList"
          component={FriendListPage}
          options={{headerShown: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="FriendRequest"
          component={FriendRequestPage}
          options={{headerShown: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="BlockList"
          component={BlockListPage}
          options={{headerShown: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="ProfileEditor"
          component={ProfileEditorPage}
          options={{headerShown: true, headerTitle: '프로필 수정'}}
        />
        <Stack.Screen
          name="BoardView"
          component={BoardViewPage}
          options={{headerShown: true, headerTitle: ''}}
        />
        <Stack.Screen
          name="BoardPost"
          component={BoardPostPage}
          options={{headerShown: true , headerTitle: '게시글 작성'}}
        />
        <Stack.Screen
          name="BoardEdit"
          component={BoardEditPage}
          options={{headerShown: true, headerTitle: '게시글 수정'}}
        />
        <Stack.Screen
          name="ChatRoomEdit"
          component={ChatRoomEditPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoomPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VideoChat"
          component={VideoChatPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UserSearchList"
          component={UserSearchListPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NoticeList"
          component={NoticeListPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NoticeView"
          component={NoticeViewPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NoticePost"
          component={NoticePostPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NoticeEdit"
          component={NoticeEditPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReportList"
          component={ReportListPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
