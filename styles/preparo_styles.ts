import { StyleSheet } from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadows, FontSizes } from '../constants/theme';

export const preparoStyles = StyleSheet.create({
    // --- CONTAINER PRINCIPAL ---
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // --- HEADER E PROGRESSO ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Spacing.xl + 10,
        paddingHorizontal: Spacing.sm,
        paddingBottom: Spacing.lg,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: Radius.full,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.md,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: FontSizes.large,
        fontFamily: Fonts.bold,
        color: Colors.dark,
        marginRight: Spacing.xl + 10,
    },
    progressContainer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    progressStep: {
        flex: 1,
        height: 6,
        borderRadius: Radius.full,
    },
    progressActive: {
        backgroundColor: Colors.primary
    },
    progressInactive: {
        backgroundColor: Colors.primary + '20'
    },

    // --- CARD DE INSTRUÇÕES (PASSO A PASSO) ---
    stepCard: {
        backgroundColor: Colors.light,
        borderRadius: Radius.xl * 2,
        padding: Spacing.xl,
        marginHorizontal: Spacing.md,
        alignItems: 'center',
        ...Shadows.lg,
    },
    stepIndicator: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small,
        textTransform: 'uppercase',
        marginBottom: Spacing.lg,
    },
    stepTitle: {
        fontSize: FontSizes.title,
        fontFamily: Fonts.bold,
        color: Colors.dark,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    stepDescription: {
        fontSize: FontSizes.medium,
        fontFamily: Fonts.regular,
        lineHeight: Spacing.lg,
        color: Colors.subtitle,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },

    // --- CRONÔMETRO (TIMER) ---
    timerInternalWrapper: {
        alignItems: 'center',
        width: '100%',
        marginTop: Spacing.md,
    },
    outerCircle: {
        width: 160,
        height: 160,
        borderRadius: Radius.full,
        borderWidth: 6,
        borderColor: Colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        width: 140,
        height: 140,
        borderRadius: Radius.full,
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: FontSizes.title,
        fontFamily: Fonts.bold,
        color: Colors.primary,
    },
    timerSubtext: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.bold,
        color: Colors.subtext,
        textTransform: 'uppercase',
    },
    timerActionsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
    },
    btnTimerReset: {
        flex: 1,
        height: 52,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        ...Shadows.md,
    },
    btnTimerResetText: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small
    },
    btnTimerControl: {
        flex: 1.5,
        height: 52,
        backgroundColor: Colors.primary,
        borderRadius: Radius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        ...Shadows.md,
    },
    btnTimerControlText: {
        color: Colors.light,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small + 3
    },

    // --- DICA DO CHEF ---
    dicaBox: {
        flexDirection: 'row',
        backgroundColor: Colors.primary + '10',
        borderWidth: 1,
        borderColor: Colors.primary + '50',
        borderEndEndRadius: Radius.xl * 2,
        borderStartEndRadius: Radius.xl * 2,
        borderTopStartRadius: Radius.xl * 2,
        padding: Spacing.md,
        marginHorizontal: Spacing.md,
        marginVertical: Spacing.lg,
        gap: Spacing.md,
    },
    dicaIconCircle: {
        width: 32,
        height: 32,
        borderRadius: Radius.full,
        backgroundColor: Colors.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dicaTitle: {
        fontSize: FontSizes.small + 1,
        fontFamily: Fonts.bold,
        color: Colors.primary,
        marginBottom: Spacing.xs,
    },
    dicaText: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.regular,
        color: Colors.subtitle,
        lineHeight: Spacing.md,
    },

    // --- FOOTER (NAVEGAÇÃO DE PASSOS) ---
    footer: {
        backgroundColor: Colors.light + '80',
        flexDirection: 'row',
        padding: Spacing.md,
        paddingBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    btnAcao: {
        flex: 1,
        height: 55,
        borderRadius: Radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnLaranja: {
        backgroundColor: Colors.primary,
        ...Shadows.md
    },
    btnBorda: {
        borderWidth: 2,
        borderColor: Colors.primary
    },
    btnAcaoTexto: {
        fontFamily: Fonts.bold,
        fontSize: FontSizes.medium,
    },

    // --- TELA DE SUCESSO (CONCLUÍDO) ---
    containerSucesso: {
        flexGrow: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xl + 10,
    },
    badgeWrapper: {
        position: 'relative',
    },
    successBadge: {
        width: 100,
        height: 100,
        backgroundColor: Colors.primary + '15',
        borderRadius: Radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    congratsTitle: {
        fontSize: FontSizes.title + 5,
        fontFamily: Fonts.bold,
        color: Colors.primary,
        textAlign: 'center',
        marginTop: Spacing.md + 2,
    },
    congratsSub: {
        fontSize: FontSizes.small + 2,
        fontFamily: Fonts.regular,
        color: Colors.subtitle,
        textAlign: 'center',
        marginBottom: Spacing.xl + 10,
    },
    successCard: {
        width: '100%',
        backgroundColor: Colors.light,
        borderBottomEndRadius: Radius.xl * 3,
        borderTopEndRadius: Radius.xl * 3,
        borderTopStartRadius: Radius.xl * 3,
        overflow: 'hidden',
        ...Shadows.lg,
        marginBottom: Spacing.xl,
    },
    successImage: {
        width: '100%',
        height: 220
    },
    successInfo: {
        padding: Spacing.md + 5,
        alignItems: 'center'
    },
    preparouLabel: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.bold,
        color: Colors.subtext,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.xs + 2
    },
    sucessRecipeTitle: {
        fontSize: FontSizes.title,
        fontFamily: Fonts.bold,
        color: Colors.dark
    },
    successActions: {
        flexDirection: 'row',
        width: '100%',
        gap: Spacing.sm,
        marginBottom: Spacing.lg
    },
    btnOutline: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.primary,
        paddingVertical: Spacing.sm + 4,
        borderRadius: Radius.full,
        gap: Spacing.xs,
        backgroundColor: Colors.light,
        ...Shadows.lg
    },
    btnOutlineActive: {
        borderColor: Colors.errorDark,
        backgroundColor: "#FFF5F5",
    },
    btnOutlineText: {
        color: Colors.primary,
        fontFamily: Fonts.bold,
        fontSize: FontSizes.small + 2
    },
    btnVoltarInico: {
        backgroundColor: Colors.primary,
        width: '100%',
        height: 52,
        borderRadius: Radius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.lg,
    }
});