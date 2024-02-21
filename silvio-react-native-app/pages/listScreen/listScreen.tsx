import React, { useEffect, useMemo, useRef } from "react";
import {
    Button,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
} from "react-native";
import { debounce } from "throttle-debounce";

import axios from "axios";
import { usePlantListStore } from "../../store/plantListStore";
import Spinner from "react-native-loading-spinner-overlay";
import { apiKey } from "../../utils/constants";
import { initialListCache } from "./listScreen.cache";
import ListPlantTile from "../../components/plantTile/listPlantTile";

interface IPageResult {
    to: number;
    per_page: number;
    current_page: number;
    from: number;
    last_page: number;
    total: number;
}

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

const ListScreen = (props: any) => {
    const scrollRef = useRef<ScrollView>();
    const [text, onChangeText] = React.useState("");
    const [results, setResults] = React.useState<any[]>([]);
    const [pageResult, setPageResult] = React.useState<IPageResult>({
        to: 0,
        per_page: 0,
        current_page: 0,
        from: 0,
        last_page: 0,
        total: 0,
    });
    const [loading, setLoading] = React.useState(false);
    const addPlant = usePlantListStore(state => state.addPlant);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            // const result: any = await axios.get(`https://perenual.com/api/species-list?key=${apiKey}`);
            const result = {
                data: initialListCache,
            };
            setPageResult({
                to: result.data.to,
                per_page: result.data.per_page,
                current_page: result.data.current_page,
                from: result.data.from,
                last_page: result.data.last_page,
                total: result.data.total,
            });
            setResults(result.data.data);
            setLoading(false);
        };

        getData();
    }, []);

    const searchOptions = async (value: string) => {
        // setLoading(true);
        const result: any = await axios.get(`https://perenual.com/api/species-list?key=${apiKey}&q=${value}`);
        setPageResult({
            to: result.data.to,
            per_page: result.data.per_page,
            current_page: result.data.current_page,
            from: result.data.from,
            last_page: result.data.last_page,
            total: result.data.total,
        });
        setResults(result.data.data);
        // setLoading(false);

        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    };

    const debouncedGetSearchResults = useMemo(
        () =>
            debounce(300, async (value: string) => {
                const results = await searchOptions(value);
            }),
        []
    );

    useEffect(() => {
        if (text) {
            if (text.length > 2) {
                debouncedGetSearchResults(text);
            }
        }
    }, [text]);

    const debouncedGetMoreResults = useMemo(
        () =>
            debounce(300, async (page: number, value: string, results: any[]) => {
                await getMoreResults(page, value, results);
            }),
        []
    );

    const getMoreResults = async (page: number, value: string, results: any[]) => {
        setLoading(true);
        const result: any = await axios.get(
            `https://perenual.com/api/species-list?key=${apiKey}&page=${page}${value.length > 2 ? `&q=${value}` : ""}`
        );
        setPageResult({
            to: result.data.to,
            per_page: result.data.per_page,
            current_page: result.data.current_page,
            from: result.data.from,
            last_page: result.data.last_page,
            total: result.data.total,
        });

        setResults(results.concat(result.data.data));

        console.log(results.concat(result.data.data).map((result: any) => result.common_name));
        setLoading(false);
    };

    const scrollNearBottom = async () => {
        debouncedGetMoreResults(pageResult.current_page + 1, text, results);
    };

    return (
        <SafeAreaView>
            <Spinner visible={loading} textContent={"Loading..."} />
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    underlineColorAndroid="transparent"
                    placeholder="Search"
                />
                <Image style={styles.searchIcon} source={require("../../components/icons/svgtopng/search.png")} />
            </View>

            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        scrollNearBottom();
                    }
                }}
                scrollEventThrottle={400}
                scrollEnabled={!loading}
                // @ts-ignore
                ref={scrollRef}
            >
                {results.map((result: any, index) => {
                    const hasImage = result.default_image?.thumbnail ? true : false;
                    return (
                        <ListPlantTile navigation={props.navigation} plant={result} />
                        // <>
                        //     <TouchableOpacity
                        //         onPress={() => props.navigation.navigate("Details", { screen: "List", id: result.id })}
                        //         key={result.id}
                        //     >
                        //         <Text>
                        //             {result.common_name} - {result.cycle} - {result.watering} -{" "}
                        //             {JSON.stringify(result.sunlight)}
                        //         </Text>
                        //         {hasImage && (
                        //             <Image
                        //                 source={{
                        //                     uri: result.default_image.thumbnail,
                        //                 }}
                        //                 style={{ width: 50, height: 50 }}
                        //             />
                        //         )}
                        //     </TouchableOpacity>
                        //     <TouchableOpacity>
                        //         <Button
                        //             title="+"
                        //             onPress={() => {
                        //                 addPlant(result);
                        //             }}
                        //         />
                        //     </TouchableOpacity>
                        // </>
                    );
                })}
            </ScrollView>
            <View>
                <Text></Text>
            </View>
        </SafeAreaView>
    );
};

export default ListScreen;

const styles = StyleSheet.create({
    searchSection: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",

        height: 50,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 10,
        marginRight: 10,

        borderWidth: 1,
        paddingLeft: 24,
        paddingTop: 25,
        paddingRight: 14,
        paddingBottom: 25,
        borderRadius: 20,
        borderStyle: "solid",
        borderColor: "#3A210E",
    },
    searchIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        height: 50,
    },
});
