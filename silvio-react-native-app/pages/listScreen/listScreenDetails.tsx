import axios from "axios";
import React, { useEffect } from "react";
import { View, Text, Button, ScrollView, StyleSheet, Image } from "react-native";
import { usePlantListStore } from "../../store/plantListStore";
import { IPlantDetails, IPlantGuide } from "../../models/plantModels";
import Spinner from "react-native-loading-spinner-overlay";
import WebView from "react-native-webview";
import { apiKey } from "../../utils/constants";

const ListScreenDetails = (props: any) => {
    const addPlant = usePlantListStore(state => state.addPlant);
    const getPlantDetail = usePlantListStore(state => state.getPlantDetail);
    const adPlantDetail = usePlantListStore(state => state.addPlantDetailsCache);
    const getPlantGuide = usePlantListStore(state => state.getPlantGuide);
    const addPlantGuide = usePlantListStore(state => state.addPlantGuidesCache);
    const [plantDetails, setPlantDetails] = React.useState<IPlantDetails>();
    const [plantGuide, setPlantGuide] = React.useState<IPlantGuide>();
    const { id } = props.route.params;

    const handleAddPlant = () => {
        addPlant(plantDetails!);
    };

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => <Button onPress={handleAddPlant} title="Add" />,
        });
    }, [props.navigation, addPlant, plantDetails]);

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
                setPlantGuide(result.data);
                addPlantGuide(result.data);
            }
        };

        getData();
    }, []);

    if (!plantDetails) {
        return <Spinner visible={true} textContent={"Loading..."} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{
                    uri: plantDetails?.default_image!.small_url,
                }}
                style={{ width: 200, height: 200 }}
            />
            <Text style={styles.section}>{plantDetails.common_name}</Text>
            <Text style={styles.section}>{plantDetails.description}</Text>
            {/* {plantDetails.hardiness_location.full_iframe && (
                <WebView source={{ html: plantDetails.hardiness_location.full_iframe }} style={{ marginTop: 20 }} />
            )} */}
            <Text style={styles.section}>{plantDetails.sunlight}</Text>
            <Text style={styles.section}>{plantDetails.watering}</Text>

            <Text style={styles.section}>{JSON.stringify(plantGuide)}</Text>

            {plantGuide?.section &&
                plantGuide?.section.map((section: any, index: number) => (
                    <Text key={index} style={styles.section}>
                        {section.title}
                        {section.description}
                    </Text>
                ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
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
});

export default ListScreenDetails;
