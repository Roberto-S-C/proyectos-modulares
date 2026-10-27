import HeaderBackButton from "@/src/components/HeaderBackButton";
import Colors from "@/src/constants/Colors";
import type { NativeStackHeaderItem, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Platform } from "react-native";

// iOS only draws its native back button when there's a previous screen in the same stack, so the
// first screen of each nested stack (modules, files, members...) had none, and on iOS 26 the ones it
// did draw were glass pills with the previous title. These items draw the app's own arrow instead,
// without the glass background. Android keeps its native back button.
const backButtonItem = (tintColor?: string): NativeStackHeaderItem[] => [{
    type: 'custom',
    element: <HeaderBackButton tintColor={tintColor} />,
    hidesSharedBackground: true,
}];

export const stackScreenOptions: NativeStackNavigationOptions = {
    headerTintColor: Colors.secondary,
    headerTitleStyle: { fontWeight: 'bold' },
    headerTitleAlign: 'center',
    ...(Platform.OS === 'ios' && {
        unstable_headerLeftItems: ({ canGoBack, tintColor }) => canGoBack ? backButtonItem(tintColor) : [],
    }),
};

// For screens that always show the back arrow, even without history (it then goes home)
export const alwaysBackButtonOptions: NativeStackNavigationOptions = Platform.OS === 'ios'
    ? { unstable_headerLeftItems: ({ tintColor }) => backButtonItem(tintColor) }
    : { headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} /> };
