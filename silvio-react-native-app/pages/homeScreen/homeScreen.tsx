import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet, Button, ScrollView, ImageBackground, Dimensions } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { IWateredPlantInfo, usePlantListStore } from "../../store/plantListStore";
import BasePlantTile from "../../components/plantTile/basePlantTile";

const gap = 12;

const createRows = (data: any[], columns: number, wateredPlants: IWateredPlantInfo[]) => {
    let rows = [];

    data.sort((a, b) => {
        const firstPlantWatering = wateredPlants.find(
            (wateredPlant: IWateredPlantInfo) => wateredPlant.plantId === a.id
        );
        const secondPlantWatering = wateredPlants.find(
            (wateredPlant: IWateredPlantInfo) => wateredPlant.plantId === b.id
        );
        if (firstPlantWatering && secondPlantWatering) {
            return firstPlantWatering.nextWatering > secondPlantWatering.nextWatering ? 1 : -1;
        }
        if (firstPlantWatering && !secondPlantWatering) {
            return 1;
        }
        if (!firstPlantWatering && secondPlantWatering) {
            return -1;
        }

        return 0;
    });

    for (let i = 0; i < data.length; i += columns) {
        // Extract a slice of 'columns' items and add to the rows array
        rows.push(data.slice(i, i + columns));
    }

    return rows;
};

const HomeScreen = (props: any) => {
    const plants = usePlantListStore(state => state.plants);
    const wateredPlants = usePlantListStore(state => state.wateredPlants);

    const [displayText, setDisplayText] = useState(false);

    const onPress = () => {
        setDisplayText(!displayText);
    };

    const rows = createRows(plants, 2, wateredPlants);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.list}>
                <ImageBackground
                    source={require("../../components/icons/svgtopng/plantsHomeImage.png")}
                    style={styles.screenWrapper}
                    imageStyle={styles.backgroundStyle}
                >
                    <Text style={styles.headerText}>PLANTZZZ</Text>
                    <Text style={styles.headerSubtitle}>My plants</Text>
                    <View style={{ padding: 16 }}>
                        {rows.map((row: any, rowIndex: number) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((plant: any, index: number) => {
                                    if (!plant) {
                                        return null;
                                    }

                                    const wateredPlant = wateredPlants.find(
                                        (wateredPlant: IWateredPlantInfo) => wateredPlant.plantId === plant.id
                                    );

                                    return (
                                        <BasePlantTile
                                            plant={plant}
                                            wateredPlant={wateredPlant}
                                            navigation={props.navigation}
                                            key={plant.id}
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ImageBackground>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screenWrapper: {
        flex: 1,
        position: "relative",
    },
    backgroundStyle: {
        resizeMode: "cover",
        position: "absolute",
        top: 0,
        bottom: "80%",
        height: 220,
    },
    container: {
        flex: 1,
        backgroundColor: "#EFFFF0",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "500",
        fontSize: 20,
        paddingLeft: "20%",
    },
    list: {
        width: "100%",
    },
    headerText: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 40,
        marginBottom: 16,
        color: "white",
        textAlign: "center",
    },
    headerSubtitle: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: "left",
        width: "100%",
        fontWeight: "bold",
        color: "white",
        padding: 24,
        paddingBottom: 8,
    },
    image: {
        width: "100%",
        backgroundColor: "#000",
        padding: 20,
        paddingVertical: 40,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    box: {
        width: "48%",
        height: 100,
        backgroundColor: "lightgrey",
    },
});

export default HomeScreen;
