import { StyleSheet, Platform } from "react-native";
import { Colors, Fonts, FontSizes, Spacing, Radius, Shadows } from "../constants/theme";

export const favStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: Spacing.xl + Spacing.lg,
        paddingHorizontal: Spacing.lg,
        backgroundColor: Colors.background,
        alignItems: 'center', // Centraliza o conteúdo do header em telas largas
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        width: '100%',
        maxWidth: 800, // Trava a largura em telas grandes
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.large,
        color: Colors.dark,
    },
    tabContainer: {
        flexDirection: 'row',
        gap: Spacing.lg,
        marginBottom: Spacing.md,
        width: '100%',
        maxWidth: 800,
    },
    tabItem: {
        paddingBottom: Spacing.xs,
    },
    tabActive: {
        borderBottomWidth: 3,
        borderBottomColor: Colors.primary,
    },
    tabText: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
        color: Colors.subtitle,
    },
    tabTextActive: {
        color: Colors.dark,
    },
    infoBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginVertical: Spacing.md,
        width: '100%',
        maxWidth: 800,
        alignSelf: 'center',
    },
    infoText: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    listContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
        alignSelf: 'center', // Centraliza a lista na tela
        width: '100%',
        maxWidth: 800,
    },
    card: {
        flex: 1, // Faz o card crescer conforme o espaço disponível
        marginBottom: Spacing.lg,
        maxWidth: '48%', // Garante que caibam 2 por linha com respiro
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1, // Mantém quadrado perfeito
        borderRadius: Radius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
        backgroundColor: Colors.light,
        ...Platform.select({
            ios: Shadows.sm,
            android: Shadows.sm,
        }),
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartIcon: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        backgroundColor: Colors.light,
        borderRadius: Radius.md,
        padding: Spacing.xs + 1,
        ...Shadows.sm,
    },
    recipeName: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium - 2,
        color: Colors.dark,
        lineHeight: 20,
    },
    recipeDetail: {
        fontFamily: Fonts.regular,
        fontSize: FontSizes.small,
        color: Colors.subtitle,
        marginTop: 2,
    }
});