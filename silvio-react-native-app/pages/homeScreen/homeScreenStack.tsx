import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "./homeScreen";
import HomeScreenDetails from "./homeScreenDetails";

const HomeStack = createNativeStackNavigator();

const HomeScreenStack = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="Details" component={HomeScreenDetails} />
        </HomeStack.Navigator>
    );
};

export default HomeScreenStack;
