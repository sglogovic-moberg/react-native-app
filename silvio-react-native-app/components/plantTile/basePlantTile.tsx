import React from "react";
import { IBasePlant, SunlightOptionsEnum, WateringOptionsEnum } from "../../models/plantModels";
import { Button, TouchableOpacity, View, Text, Image, StyleSheet, Dimensions, Touchable } from "react-native";
import { IWateredPlantInfo, usePlantListStore } from "../../store/plantListStore";
import { DateTime } from "luxon";
import Toast from "react-native-toast-message";

export interface IBasePlantTileProps {
    plant: IBasePlant;
    wateredPlant?: IWateredPlantInfo;
    navigation?: any;
}

// Gap stuff
const { width } = Dimensions.get("window");
const gap = 12;
const itemPerRow = 2;
const totalGapSize = (itemPerRow - 1) * gap;
const windowWidth = width;
const childWidth = (windowWidth - totalGapSize - 48) / itemPerRow;

const BasePlantTile = (props: IBasePlantTileProps) => {
    const waterPlant = usePlantListStore(state => state.waterPlant);
    const hasImage = props.plant.default_image?.small_url ? true : false;
    const hasWateredPlant = props.wateredPlant ? true : false;
    const needsWatering = props.wateredPlant && DateTime.now().diff(props.wateredPlant?.nextWatering).milliseconds > 0;

    return (
        <View>
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
                            height={150}
                            width={childWidth}
                        />
                    )}
                    <View style={styles.content}>
                        <Text style={styles.title}>{props.plant.common_name}</Text>
                        <Text
                            style={
                                hasWateredPlant
                                    ? needsWatering
                                        ? styles.needsWatering
                                        : styles.watered
                                    : styles.notWatered
                            }
                        >
                            {props.wateredPlant
                                ? "Next watering: " +
                                  // @ts-ignore
                                  DateTime.fromISO(props.wateredPlant.nextWatering).diffNow(["day", "hours"]).days +
                                  " days"
                                : "Not watered yet"}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.waterButtonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        waterPlant(props.plant.id);

                        Toast.show({
                            type: "success",
                            text1: "Plant watered 💧",
                        });
                    }}
                    style={styles.waterButton}
                >
                    <Text style={styles.waterText}>Water</Text>
                    <Image source={require("../icons/svgtopng/wateringNew2.png")} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: gap / 2,
        minWidth: childWidth,
        maxWidth: childWidth,

        flexDirection: "row",
        backgroundColor: "#FBFBFB",
        height: 240,
        borderRadius: 16,

        elevation: 5,
        marginVertical: 0,
    },
    touchable1: {
        height: "100%",
        width: "100%",
    },
    image: {
        width: "100%",
        height: 150,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    content: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 12,
    },
    title: {
        fontWeight: "bold",
        fontSize: 12,
        color: "#000",
        paddingBottom: 8,
        height: 40,
    },
    icons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    watered: {
        backgroundColor: "#99C8FF",
        padding: 8,
        borderRadius: 8,
        fontSize: 12,
    },
    notWatered: {
        padding: 8,
        borderRadius: 8,
        fontSize: 12,
    },
    needsWatering: {
        backgroundColor: "#FF7373",
        padding: 8,
        borderRadius: 8,
        fontSize: 12,
    },
    waterButton: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        borderColor: "#6FC2FF",
        borderWidth: 2,
        borderStyle: "solid",
        flexDirection: "row",
        justifyContent: "space-evenly",

        height: 48,
        width: childWidth,
        elevation: 5,
    },
    waterButtonContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 16,
    },
    waterText: {
        fontSize: 18,
        color: "#6FC2FF",
    },
});

export default BasePlantTile;

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
