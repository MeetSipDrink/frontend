import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as Keychain from 'react-native-keychain';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkLoginStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                const { accessToken } = JSON.parse(credentials.password);
                setIsLoggedIn(!!accessToken);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (accessToken, refreshToken) => {
        try {
            await Keychain.setGenericPassword('tokens', JSON.stringify({ accessToken, refreshToken }));
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Login error:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await Keychain.resetGenericPassword();
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Logout error:', error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }, []);

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    const contextValue = {
        isLoggedIn,
        isLoading,
        login,
        logout,
        checkLoginStatus
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};