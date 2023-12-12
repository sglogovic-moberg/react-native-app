import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function App() {
    const [displayText, setDisplayText] = useState(false);
    const onPress = () => {
        setDisplayText(!displayText);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Test text 123</Text>
            <Pressable onPress={onPress}>
                <Text>Test gumb</Text>
            </Pressable>
            {displayText && (
                <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(500)}>
                    <Text>Test display text</Text>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: "500",
        fontSize: 20,
        paddingLeft: "20%",
    },
});
