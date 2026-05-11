import React from "react";
import { Image, Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

// Imports de estilo
import { authStyles as styles } from "../styles/auth_styles";

interface AuthHeaderProps {
    title: string;
    subtitle: string;
    email?: string;
}

export default function AuthHeader({ title, subtitle, email }: AuthHeaderProps) {
    // Substitui {email} no subtitle se email for fornecido
    const processedSubtitle = email ? subtitle.replace("{email}", email) : subtitle;

    return (
        <Animated.View
            entering={FadeInUp.delay(100).duration(600)}
            style={styles.header}
        >
            <Image
                source={require("../assets/images/icon.png")}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.brandName}>Quase Chef!</Text>

            <Text style={styles.welcomeTitle}>{title}</Text>
            <Text style={styles.welcomeSubtitle}>
                {processedSubtitle}
            </Text>
        </Animated.View>
    );
}