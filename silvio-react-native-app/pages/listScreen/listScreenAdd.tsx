import React from "react";
import { Text, View } from "react-native";
import { useTimerListStore } from "../../store/timerListStore";
// import { debounce } from "throttle-debounce";

const ListScreenAdd = (props: any) => {
    const timers = useTimerListStore(state => state.timers);
    const addTimers = useTimerListStore(state => state.addTimer);

    // const addTimers = useTimerListStore(state => state.addTimer);
    // https://perenual.com/api/species-list?key=${apiKey}
    return (
        <View>
            <Text>Search plants</Text>
        </View>
    );
};

export default ListScreenAdd;
