import "react-native-get-random-values";
import axios from "axios";
import React, { useEffect } from "react";
import { View, Text, Button, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { usePlantListStore } from "../../store/plantListStore";
import { IPlantDetails, IPlantGuide, SunlightOptionsEnum, WateringOptionsEnum } from "../../models/plantModels";
import Spinner from "react-native-loading-spinner-overlay";
import { apiKey } from "../../utils/constants";
import Toast from "react-native-toast-message";

const HomeScreenDetails = (props: any) => {
    const addPlant = usePlantListStore(state => state.addPlant);
    const getPlantDetail = usePlantListStore(state => state.getPlantDetail);
    const adPlantDetail = usePlantListStore(state => state.addPlantDetailsCache);
    const getPlantGuide = usePlantListStore(state => state.getPlantGuide);
    const addPlantGuide = usePlantListStore(state => state.addPlantGuidesCache);
    const deletePlant = usePlantListStore(state => state.deletePlant);
    const myPlants = usePlantListStore(state => state.plants);
    const [plantDetails, setPlantDetails] = React.useState<IPlantDetails>();
    const [plantGuide, setPlantGuide] = React.useState<IPlantGuide>();
    const { id } = props.route.params;
    const [loading, setLoading] = React.useState(false);

    const hasMyPlant = myPlants.findIndex(plant => plant.id === id) !== -1;

    const handleAddPlant = () => {
        addPlant(plantDetails!);

        Toast.show({
            type: "success",
            text1: "Added new plant 🌱",
        });
    };

    const handleDeletePlant = () => {
        deletePlant(plantDetails!.id!);

        Toast.show({
            type: "error",
            text1: "Deleted plant 🌱",
        });
    };

    useEffect(() => {
        if (hasMyPlant && plantDetails) {
            props.navigation.setOptions({
                headerRight: () => <Button onPress={handleDeletePlant} title="Delete" color={"#CC4444"} />,
            });
        } else {
            props.navigation.setOptions({
                headerRight: undefined,
            });
        }
    }, [props.navigation, addPlant, plantDetails, hasMyPlant]);

    useEffect(() => {
        const getData = async () => {
            const detailsFromCache = getPlantDetail(id);
            const guideFromCache = getPlantGuide(id);

            if (detailsFromCache) {
                setPlantDetails(detailsFromCache);
            } else {
                const result: any = await axios.get(`https://perenual.com/api/species/details/${id}?key=${apiKey}`);
                setPlantDetails(result.data);
                adPlantDetail(result.data);
            }

            if (guideFromCache) {
                setPlantGuide(guideFromCache);
            } else {
                const result: any = await axios.get(
                    `http://perenual.com/api/species-care-guide-list?species_id=${id}&key=${apiKey}`
                );
                setPlantGuide(result.data.data[0]);
                addPlantGuide(result.data.data[0]);
            }
        };

        getData();
    }, []);

    if (!plantDetails) {
        return <Spinner visible={true} textContent={"Loading..."} />;
    }

    const waterIcon =
        plantDetails.watering && plantDetails.watering.toLowerCase() === WateringOptionsEnum.Frequent
            ? require("../../components/icons/svgtopng/waterFrequentBig.png")
            : plantDetails.watering.toLowerCase() === WateringOptionsEnum.Average
            ? require("../../components/icons/svgtopng/waterAverageBig.png")
            : require("../../components/icons/svgtopng/waterRareBig.png");

    const sunIcon =
        plantDetails.sunlight &&
        plantDetails.sunlight.findIndex(value => value.toLowerCase() === SunlightOptionsEnum.FullSun) !== -1
            ? require("../../components/icons/svgtopng/fullSunBig.png")
            : plantDetails.sunlight.findIndex(value => value.toLowerCase() === SunlightOptionsEnum.PartShade) !== -1
            ? require("../../components/icons/svgtopng/partShadeBig.png")
            : require("../../components/icons/svgtopng/filteredSunBig.png");

    return (
        <>
            <ScrollView style={styles.container}>
                <Spinner visible={loading} textContent={"Loading..."} />
                <Image
                    source={{
                        uri: plantDetails?.default_image!.regular_url,
                    }}
                    style={{ width: "100%", height: 200 }}
                />
                <View style={styles.content}>
                    <Text style={styles.title}>{plantDetails.common_name}</Text>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignContent: "center",
                            gap: 10,
                            alignItems: "center",
                            padding: 14,
                            paddingBottom: 0,
                        }}
                    >
                        <Image source={require("../../components/icons/svgtopng/sunBig.png")} />
                        <Image source={sunIcon} />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            paddingBottom: 14,
                            paddingLeft: 75,
                        }}
                    >
                        <Image source={require("../../components/icons/svgtopng/info.png")} />
                        <Text style={{ fontSize: 12, opacity: 0.5 }}>Performs best in full sun to light shade</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignContent: "center",
                            gap: 10,
                            alignItems: "center",
                            padding: 14,
                            paddingBottom: 0,
                        }}
                    >
                        <Image source={require("../../components/icons/svgtopng/dropletBig.png")} />
                        <Image source={waterIcon} />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            paddingBottom: 14,
                            paddingLeft: 75,
                        }}
                    >
                        <Image source={require("../../components/icons/svgtopng/info.png")} />
                        <Text style={{ fontSize: 12, opacity: 0.5 }}>Highly drought tolerant once established</Text>
                    </View>
                    <Text style={styles.title}> About</Text>
                    <Text style={styles.textBlock}>{plantDetails.description}</Text>

                    <Text style={styles.title}> Guides</Text>
                    {plantGuide?.section &&
                        plantGuide?.section.map((section: any, index: number) => (
                            <>
                                <Text style={styles.title2} key={`${section.type}`}>
                                    {section.type}
                                </Text>
                                <Text style={styles.textBlock} key={`${section.type}-description`}>
                                    {section.description}
                                </Text>
                            </>
                        ))}
                </View>
            </ScrollView>
            {!hasMyPlant && (
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        addPlant(plantDetails);

                        Toast.show({
                            type: "success",
                            text1: "Added new plant 🌱",
                        });
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.actionButton}>
                        <Text style={styles.actionText}>Add</Text>
                        <Image
                            style={styles.icon}
                            source={require("../../components/icons/svgtopng/whitePlusBig.png")}
                        />
                    </View>
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        flexDirection: "column",
    },
    section: {
        padding: 16,
        width: "100%",
        borderRadius: 16,
        backgroundColor: "#EFFFF0",
        borderColor: "#6FC2FF",
        borderWidth: 1,
        borderStyle: "solid",
        marginVertical: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
    },
    title2: {
        fontSize: 24,
        fontWeight: "bold",
        paddingLeft: 16,
    },
    content: {
        flex: 1,
        flexDirection: "column",
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
        paddingBottom: 16,
    },
    textBlock: {
        fontSize: 14,
        padding: 8,
    },
    action: {
        flex: 0.35,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",

        position: "absolute",
        bottom: 20,
    },
    icon: {
        height: 18,
        width: 18,
    },
    actionButton: {
        height: 80,
        width: "80%",
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center",
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
    actionText: {
        fontWeight: "bold",
        fontSize: 28,
        color: "white",
    },
});

export default HomeScreenDetails;
