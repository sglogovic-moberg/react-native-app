import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ListScreen from "./listScreen";

import ListScreenDetails from "./listScreenDetails";
import { Button } from "react-native";

const ListStack = createNativeStackNavigator();

const ListScreenStack = () => {
    return (
        <ListStack.Navigator>
            <ListStack.Screen name="Plant list" component={ListScreen} />
            <ListStack.Screen
                name="Plant Details"
                component={ListScreenDetails}
                options={{
                    headerRight: () => <Button title="Add" />,
                }}
            />
        </ListStack.Navigator>
    );
};

export default ListScreenStack;
