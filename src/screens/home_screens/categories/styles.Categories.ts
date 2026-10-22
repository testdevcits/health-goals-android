import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.md,
        gap: spacing.sm,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        minWidth: 0,
        gap: 1,
    },
    notificationButton: {
        width: 38,
        height: 38,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationDot: {
        position: 'absolute',
        top: 7,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: radius.full,
        backgroundColor: '#F59E0B',
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0BBDA6',
    },
    avatarText: {
        color: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: spacing.base,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    rowSeparator: {
        height: spacing.md,
    },
    categoryCard: {
        flex: 1,
        minWidth: 0,
        minHeight: 80,
        borderRadius: radius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        elevation: 2,
        shadowColor: '#172033',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.045,
        shadowRadius: 7,
    },
    emojiBox: {
        width: 42,
        height: 42,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    emoji: {
        fontSize: 23,
        lineHeight: 29,
    },
    categoryText: {
        flex: 1,
        minWidth: 0,
        justifyContent: 'center',
        gap: 2,
    },
    categoryTitle: {
        fontSize: 14,
        lineHeight: 18,
    },
    categorySubtitle: {
        fontSize: 11,
        lineHeight: 14,
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
        gap: 1,
    },
    activeIndicator: {
        width: 22,
        height: 3,
        borderRadius: radius.full,
        marginTop: 2,
    },
});


export default styles