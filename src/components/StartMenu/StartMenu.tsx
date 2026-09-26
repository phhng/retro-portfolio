import React from "react";
import { useWindowDimensions, Text, View } from "react-native";

export default function StartMenu() {
    const { width } = useWindowDimensions();
    return (
        // Check if mobile device
        (width < 768) ? 
        (
            <View>

            </View>
        )
         : 
        (
            <View>
                <Text>Start Menu is open</Text>
            </View>
        )
    );
}