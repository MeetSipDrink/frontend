import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkLoginStatus = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                const { accessToken } = JSON.parse(credentials.password);
                if (accessToken) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    const login = async (accessToken) => {
        try {
            await Keychain.setGenericPassword('user', JSON.stringify({ accessToken }));
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            await Keychain.resetGenericPassword();
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    useEffect(() => {
        console.log('isLoggedIn changed:', isLoggedIn);
    }, [isLoggedIn]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, checkLoginStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);