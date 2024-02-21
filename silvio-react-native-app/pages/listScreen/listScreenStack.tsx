import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ListScreen from "./listScreen";
import ListScreenAdd from "./listScreenAdd";
import ListScreenDetails from "./listScreenDetails";
import { Button } from "react-native";

const ListStack = createNativeStackNavigator();

const ListScreenStack = () => {
    return (
        <ListStack.Navigator>
            <ListStack.Screen name="List-home" component={ListScreen} />
            <ListStack.Screen name="Add-new" component={ListScreenAdd} />
            <ListStack.Screen
                name="Details"
                component={ListScreenDetails}
                options={{
                    headerRight: () => <Button title="Add" color="#00cc00" />,
                }}
            />
        </ListStack.Navigator>
    );
};

export default ListScreenStack;
