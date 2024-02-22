import React from "react";
import { IBasePlant, SunlightOptionsEnum, WateringOptionsEnum } from "../../models/plantModels";
import { Button, TouchableOpacity, View, Text, Image, StyleSheet, Dimensions, Touchable } from "react-native";
import { IWateredPlantInfo, usePlantListStore } from "../../store/plantListStore";
import { DateTime } from "luxon";
import Toast from "react-native-toast-message";

export interface IListPlantTileProps {
    plant: IBasePlant;
    navigation?: any;
}

const ListPlantTile = (props: IListPlantTileProps) => {
    const addPlant = usePlantListStore(state => state.addPlant);
    const deletePlant = usePlantListStore(state => state.deletePlant);
    const myPlants = usePlantListStore(state => state.plants);
    const hasImage = props.plant.default_image?.small_url ? true : false;
    const hasMyPlant = myPlants.findIndex(plant => plant.id === props.plant.id) !== -1;

    const waterIcon =
        props.plant.watering && props.plant.watering.toLowerCase() === WateringOptionsEnum.Frequent
            ? require("../icons/svgtopng/waterFrequent.png")
            : props.plant.watering.toLowerCase() === WateringOptionsEnum.Average
            ? require("../icons/svgtopng/waterAverage.png")
            : require("../icons/svgtopng/waterRare.png");

    const sunIcon =
        props.plant.sunlight && props.plant.sunlight.length > 0 && Array.isArray(props.plant.sunlight)
            ? props.plant.sunlight.findIndex(value => value.toLowerCase() === SunlightOptionsEnum.FullSun) !== -1
                ? require("../icons/svgtopng/fullSun.png")
                : props.plant.sunlight.findIndex(value => value.toLowerCase() === SunlightOptionsEnum.PartShade) !== -1
                ? require("../icons/svgtopng/partShade.png")
                : require("../icons/svgtopng/filteredSun.png")
            : require("../icons/svgtopng/fullSun.png");

    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Details", { screen: "List", id: props.plant.id })}
                    style={styles.touchable1}
                >
                    {hasImage && (
                        <Image
                            source={{
                                uri: props.plant.default_image!.small_url,
                            }}
                            style={styles.image}
                            height={120}
                            width={110}
                        />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate("Details", { screen: "List", id: props.plant.id })}
                    style={styles.touchable2}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>{props.plant.common_name}</Text>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignContent: "center",
                                gap: 10,
                                alignItems: "center",
                            }}
                        >
                            <Image source={require("../icons/svgtopng/sun.png")} />
                            <Image source={sunIcon} />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignContent: "center",
                                gap: 10,
                                alignItems: "center",
                            }}
                        >
                            <Image source={require("../icons/svgtopng/droplet.png")} />
                            <Image source={waterIcon} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            {hasMyPlant ? (
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        deletePlant(props.plant.id);

                        Toast.show({
                            type: "error",
                            text1: "Deleted plant 🌱",
                        });
                    }}
                >
                    <View style={styles.actionButton2}>
                        <Text style={styles.actionText}>Delete</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        addPlant(props.plant);

                        Toast.show({
                            type: "success",
                            text1: "Added new plant 🌱",
                        });
                    }}
                >
                    <View style={styles.actionButton}>
                        <Text style={styles.actionText}>Add</Text>
                        <Image style={styles.icon} source={require("../icons/svgtopng/whitePlus.png")} />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 12,
        marginRight: 0,
        backgroundColor: "#FBFBFB",
        borderRadius: 20,
        height: 120,
    },
    touchable1: {
        flex: 0.8,
    },
    touchable2: {
        flex: 1,
    },
    image: {
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    content: {
        flex: 1,
        flexDirection: "column",
        padding: 8,
        paddingLeft: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        height: 42,
    },
    action: {
        flex: 0.35,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        height: 12,
        width: 12,
    },
    actionButton: {
        height: 120,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        alignItems: "center",
        paddingTop: 0,
        paddingRight: 16,
        paddingBottom: 0,
        paddingLeft: 16,
        borderRadius: 12,
        backgroundColor: "#76BC65",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    actionButton2: {
        height: 120,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        alignItems: "center",
        paddingTop: 0,
        paddingRight: 16,
        paddingBottom: 0,
        paddingLeft: 16,
        borderRadius: 12,
        backgroundColor: "#CC4444",
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    actionText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "white",
    },
});

export default ListPlantTile;

// const sunIcons =
//     props.plant.sunlight &&
//     props.plant.sunlight.map(value => {
//         if (!value) {
//             return;
//         }

//         return value.toLowerCase() === SunlightOptionsEnum.FullSun
//             ? require("../icons/svgtopng/fullSun.png")
//             : value.toLowerCase() === SunlightOptionsEnum.PartShade
//             ? require("../icons/svgtopng/partShade.png")
//             : require("../icons/svgtopng/filteredSun.png");
//     });
// const waterIcons =
//     props.plant.watering && props.plant.watering.toLowerCase() === WateringOptionsEnum.Average
//         ? require("../icons/svgtopng/singleDroplet.png")
//         : require("../icons/svgtopng/doubleDroplet.png");

{
    /* {sunIcons &&
                                sunIcons.map((icon, index) => {
                                    return <Image source={icon} style={{ width: 20, height: 24 }} />;
                                })}
                            <Image source={waterIcons} style={{ width: 20, height: 24 }} /> */
}
