
import { StyleSheet } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        minHeight: 66,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerButton: {
        width: 38,
        height: 38,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        minWidth: 0,
        gap: 1,
    },
    notificationDot: {
        position: 'absolute',
        top: 7,
        right: 8,
        width: 7,
        height: 7,
        borderRadius: radius.full,
        backgroundColor: '#F59E0B',
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#08BDA7',
    },
    avatarText: {
        color: '#FFFFFF',
    },
    scrollContent: {
        padding: spacing.base,
        paddingBottom: spacing.xl,
    },
    heroCard: {
        height: 157,
        backgroundColor: '#F15F63',
        borderRadius: radius.xl,
        padding: spacing.base,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginBottom: spacing.lg,
    },
    heroCircle: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: radius.full,
        backgroundColor: 'rgba(255,255,255,0.12)',
        right: -30,
        top: -50,
    },
    runnerEmoji: {
        fontSize: 39,
        lineHeight: 48,
        marginBottom: spacing.xs,
    },
    heroTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        lineHeight: 28,
    },
    heroSubtitle: {
        color: '#FFFFFF',
        marginTop: 2,
    },
    infoCard: {
        borderRadius: radius.lg,
        padding: spacing.base,
        elevation: 3,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.045,
        shadowRadius: 8,
    },
    description: {
        marginTop: spacing.xs,
        lineHeight: 20,
    },
    calculationTitle: {
        marginTop: spacing.base,
        marginBottom: spacing.xs,
    },
    rateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E9EDF2',
        gap: spacing.sm,
    },
    lastRateRow: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 1,
    },
    chartHeading: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: spacing.sm,
    },
    chartCard: {
        borderRadius: radius.lg,
        paddingHorizontal: spacing.base,
        paddingTop: spacing.base,
        paddingBottom: spacing.sm,
        elevation: 2,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 7,
    },
    chart: {
        height: 115,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5EAF0',
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: 0,
    },
    barTrack: {
        height: 100,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '42%',
        minWidth: 5,
        maxWidth: 22,
        borderTopLeftRadius: radius.full,
        borderTopRightRadius: radius.full,
    },
    dayLabel: {
        fontSize: 9,
        lineHeight: 13,
        marginTop: 5,
        marginBottom: 1,
    },
    bottomBar: {
        flexDirection: 'row',
        paddingTop: spacing.sm,
        paddingBottom: spacing.xs,
        paddingHorizontal: spacing.xs,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    activeIndicator: {
        width: 22,
        height: 3,
        borderRadius: radius.full,
        marginTop: 2,
    },
});

export default styles