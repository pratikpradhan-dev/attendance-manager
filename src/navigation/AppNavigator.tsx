import { NavigationContainer } from "@react-navigation/native";

import {
    createNativeStackNavigator,
} from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import AddSubjectScreen from "../screens/AddSubjectScreen";
import SubjectDetailScreen from "../screens/SubjectDetailScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import EditSubjectScreen from "../screens/EditSubjectScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Stack =
    createNativeStackNavigator();

export default function AppNavigator() {

    return (
        <NavigationContainer>

            <Stack.Navigator

                initialRouteName="Dashboard"

                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: "#121212",
                    },
                }}
            >

                <Stack.Screen
                    name="Dashboard"
                    component={DashboardScreen}
                />

                <Stack.Screen
                    name="AddSubject"
                    component={AddSubjectScreen}
                />

                <Stack.Screen
                    name="SubjectDetail"
                    component={SubjectDetailScreen}
                />

                <Stack.Screen
                    name="Analytics"
                    component={AnalyticsScreen}
                />

                <Stack.Screen
                    name="EditSubject"
                    component={EditSubjectScreen}
                />

                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                />

            </Stack.Navigator>

        </NavigationContainer>
    );
}