import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { usePlantListStore } from "../../store/plantListStore";

const SettingsScreen = () => {
    const clearPlants = usePlantListStore(state => state.clearPlants);
    return (
        <View style={styles.screenWrapper}>
            <Text> Do you want to delete all of your stored data? </Text>
            <Button title="Clear plant Data" onPress={() => clearPlants()} />
        </View>
    );
};

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
        padding: 16,
    },
});

export default SettingsScreen;
