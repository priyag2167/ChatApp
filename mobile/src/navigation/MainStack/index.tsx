import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Screens from '../../screens';

import { colors } from '../../helpers/styles';
import { StyleSheet } from 'react-native';

const MainStackNav = createNativeStackNavigator();

export const MainStack = () => {
	return (
		<MainStackNav.Navigator
			screenOptions={{
				headerShown: false,
				contentStyle: styles.container,
				animation: 'slide_from_right'
			}}
			initialRouteName='Home'
		>
			<MainStackNav.Screen component={Screens.Home} name='Home' />
			<MainStackNav.Screen component={Screens.Chat} name='Chat' />
			<MainStackNav.Screen component={Screens.Profile} name='Profile' />
			
		
		</MainStackNav.Navigator>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.darkblue
	}
});
