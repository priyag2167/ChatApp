import React, { useContext, useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import { NavigationContainer, createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { colors } from '../helpers/styles';

import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import Screens from '../screens';
import { AuthContext } from '../context/AuthContext';

export const navigationRef = createNavigationContainerRef();

// Flag to track if we're in MainStack
let isInMainStack = false;

const exitApp = () => {
	BackHandler.exitApp();
};

const handleBackButtonClick = () => {
	// Don't handle back press if we're in MainStack
	// (MainStack now handles its own back button logic)
	if (isInMainStack) {
		return false;
	}
	
	// Only handle for AuthStack when can't go back
	if (!navigationRef.canGoBack()) {
		Alert.alert('Hold on!', 'Are you sure you want to exit the application?', [
			{
				text: 'Cancel',
				onPress: () => console.log('cancel')
			},
			{
				text: 'Yes',
				onPress: () => exitApp()
			}
		]);
	}
	return !navigationRef.canGoBack();
};

export function navigate(name: string, params?: any) {
	if (navigationRef.isReady()) {
		// @ts-ignore: Type issues with navigation params
		navigationRef?.navigate(name, params);
	}
}

export function replace(name: string, params?: any) {
	if (navigationRef.isReady()) {
		// @ts-ignore: Type issues with navigation params
		navigationRef.dispatch(StackActions.replace(name, params));
	}
}

export function goBack() {
	if (navigationRef.isReady()) {
		try {
			if (navigationRef.canGoBack()) {
				navigationRef.goBack();
			} else {
				handleBackButtonClick();
			}
		} catch (error) {
			console.log(error);
		}
	}
}

const RootStackNav = createNativeStackNavigator();

export const AppNavigation = () => {
	const { token, isLoading } = useContext(AuthContext);
	useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      
        return () => {
          backHandler.remove();
        };
    }, []);

	return (
			<SafeAreaProvider>
				<NavigationContainer 
					ref={navigationRef}
					onStateChange={(state) => {
						// Track when we enter/exit MainStack
						if (state && state.routes && state.index !== undefined) {
							const routeName = state.routes[state.index]?.name;
							isInMainStack = routeName === 'MainStack' || !!token;
						}
					}}
				>
					{isLoading ? null : (
					<RootStackNav.Navigator
						screenOptions={{
							headerShown: false,
							animation: 'slide_from_right',
							contentStyle: { backgroundColor: colors.darkblue }
						}}
						initialRouteName={token ? 'MainStack' : 'AuthFlow'}
					>
						{!token && <RootStackNav.Screen component={AuthStack} name={'AuthFlow'} />}
						{token && <RootStackNav.Screen component={MainStack} name={'MainStack'} />}
					</RootStackNav.Navigator>
					)}
				</NavigationContainer>
			</SafeAreaProvider>
	);
};
