import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Button } from "react-native";
import HomeScreenStack from "./pages/homeScreen/homeScreenStack";
import ListScreenStack from "./pages/listScreen/listScreenStack";
const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Home"
                    component={HomeScreenStack}
                    options={{
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="List"
                    component={ListScreenStack}
                    options={{
                        headerShown: false,
                        headerRight: () => <Button title="Add" color="#00cc00" />,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
