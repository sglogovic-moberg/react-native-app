import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Button, View, Image } from "react-native";
import HomeScreenStack from "./pages/homeScreen/homeScreenStack";
import ListScreenStack from "./pages/listScreen/listScreenStack";
import Toast from "react-native-toast-message";
import SettingsScreen from "./pages/settingsScreen/settingsScreen";
const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <>
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen
                        name="Home"
                        component={HomeScreenStack}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ color, size }) => (
                                <Image
                                    source={require("./components/icons/svgtopng/home.png")}
                                    height={16}
                                    width={16}
                                />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="List"
                        component={ListScreenStack}
                        options={{
                            headerShown: false,
                            headerRight: () => <Button title="Add" color="#00cc00" />,
                            tabBarIcon: ({ color, size }) => (
                                <Image
                                    source={require("./components/icons/svgtopng/search.png")}
                                    height={16}
                                    width={16}
                                />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Settings"
                        component={SettingsScreen}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Image source={require("./components/icons/svgtopng/cog-small.png")} />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
            <Toast />
        </>
    );
}
