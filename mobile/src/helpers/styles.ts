import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const bottomBarHeight = Platform.OS === 'ios' ? 80 : 65;

const colors = {
	bg: '#ffffff',
	black: '#000000',
    darkgreen:'#38B44A',
    lightgreen:'#56BE15',
    red: '#CC0000',
	blue: '#545EAF',
	white: '#ffffff',
	combinedColor: '#EDFBF8',
	darkblue:'#1B202D',
	gray:'#292F3F',
};

const fonts = {
	BOLD: 'ProductSans-Bold',
	ITALIC: 'ProductSans-Italic',
	BOLD_ITALIC: 'ProductSans-Bold-Italic',
};

export { screenWidth, screenHeight, colors, fonts, bottomBarHeight };
