import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppButton, AppText } from '../../../../components';
import { useTheme } from '../../../../theme/useTheme';
import AppIcon from '../../../../assets/appicon/AppIcon';
import type { DailyValue, HealthReportTab } from '../useHealthReports';

interface HealthReportPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  from: Date;
  to: Date;
  activeTab: HealthReportTab;
  history: DailyValue[];
  totalCoins: number;
  onDownloadPdf: () => void;
  onShare: () => void;
}

export const HealthReportPreviewModal: React.FC<HealthReportPreviewModalProps> = ({
  visible,
  onClose,
  from,
  to,
  activeTab,
  history,
  totalCoins,
  onDownloadPdf,
  onShare,
}) => {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const total = history.reduce((sum, item) => sum + item.value, 0);
  const avg = history.length ? Math.round(total / history.length) : 0;
  const max = history.length ? Math.max(...history.map(item => item.value)) : 0;
  const activeDays = history.filter(item => item.value > 0).length;
  const unit = history[0]?.unit || (activeTab === 'Steps' ? 'steps' : 'mins');

  const formattedTotal =
    activeTab === 'Sleep'
      ? `${Math.floor(total / 60)}h ${Math.round(total % 60)}m`
      : `${total.toLocaleString()} ${unit}`;

  const formattedAvg =
    activeTab === 'Sleep'
      ? `${Math.floor(avg / 60)}h ${Math.round(avg % 60)}m`
      : `${avg.toLocaleString()} ${unit}`;

  const formattedMax =
    activeTab === 'Sleep'
      ? `${Math.floor(max / 60)}h ${Math.round(max % 60)}m`
      : `${max.toLocaleString()} ${unit}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <AppText variant="subtitle1" bold>
                Health Report Preview
              </AppText>
              <AppText variant="caption" secondary>
                {activeTab} • {from.toLocaleDateString()} – {to.toLocaleDateString()}
              </AppText>
            </View>
            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: colors.backgroundSecondary },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close report preview"
            >
              <AppIcon name="X" size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Document Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Paper Document Container */}
            <View
              style={[
                styles.documentPaper,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Document Banner */}
              <View
                style={[
                  styles.documentBanner,
                  { borderBottomColor: colors.primary },
                ]}
              >
                <AppText variant="h3" bold style={{ color: colors.primary }}>
                  VITALITY
                </AppText>
                <AppText variant="caption" secondary>
                  Official Health & Performance Summary
                </AppText>
              </View>

              {/* Meta information row */}
              <View
                style={[
                  styles.metaRow,
                  { backgroundColor: colors.backgroundSecondary },
                ]}
              >
                <View>
                  <AppText variant="caption" bold>
                    Metric: {activeTab}
                  </AppText>
                  <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                    Period: {from.toLocaleDateString()} – {to.toLocaleDateString()}
                  </AppText>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                    Generated: {new Date().toLocaleDateString()}
                  </AppText>
                </View>
              </View>

              {/* KPI Cards Grid */}
              <View style={styles.kpiGrid}>
                <View
                  style={[
                    styles.kpiCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <AppText variant="subtitle1" bold primary>
                    {formattedTotal}
                  </AppText>
                  <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                    Total {activeTab}
                  </AppText>
                </View>
                <View
                  style={[
                    styles.kpiCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <AppText variant="subtitle1" bold>
                    {formattedAvg}
                  </AppText>
                  <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                    Daily Average
                  </AppText>
                </View>
                <View
                  style={[
                    styles.kpiCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <AppText variant="subtitle1" bold>
                    {formattedMax}
                  </AppText>
                  <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                    Best Day
                  </AppText>
                </View>
                <View
                  style={[
                    styles.kpiCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <AppText variant="subtitle1" bold>
                    {activeDays} / {history.length}
                  </AppText>
                  <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                    Days Recorded
                  </AppText>
                </View>
                <View
                  style={[
                    styles.kpiCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <AppText variant="subtitle1" bold style={{ color: colors.warning }}>
                    {totalCoins}
                  </AppText>
                  <AppText variant="caption" secondary style={{ fontSize: 11 }}>
                    Coins Earned
                  </AppText>
                </View>
              </View>

              {/* Daily Breakdown Table */}
              <AppText
                variant="label"
                bold
                style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
              >
                Daily Breakdown
              </AppText>
              <View
                style={[
                  styles.table,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.tableRow,
                    styles.tableHeader,
                    {
                      backgroundColor: colors.backgroundSecondary,
                      borderBottomColor: colors.border,
                    },
                  ]}
                >
                  <AppText variant="caption" bold style={{ flex: 1.2 }}>
                    Date
                  </AppText>
                  <AppText
                    variant="caption"
                    bold
                    style={{ flex: 1, textAlign: 'right' }}
                  >
                    Recorded
                  </AppText>
                  <AppText
                    variant="caption"
                    bold
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    Status
                  </AppText>
                </View>
                {history.map(item => {
                  let dayName = '';
                  try {
                    const d = new Date(`${item.date}T12:00:00Z`);
                    dayName = d.toLocaleDateString('en-US', {
                      weekday: 'short',
                    });
                  } catch {
                    dayName = '';
                  }
                  const valStr =
                    activeTab === 'Sleep'
                      ? `${Math.floor(item.value / 60)}h ${Math.round(
                          item.value % 60,
                        )}m`
                      : `${item.value.toLocaleString()} ${unit}`;

                  const isGoal =
                    activeTab === 'Steps'
                      ? item.value >= 10000
                      : item.value > 0;

                  return (
                    <View
                      key={item.date}
                      style={[
                        styles.tableRow,
                        { borderBottomColor: colors.border },
                      ]}
                    >
                      <View style={{ flex: 1.2 }}>
                        <AppText variant="caption" bold>
                          {item.date}
                        </AppText>
                        <AppText
                          variant="caption"
                          secondary
                          style={{ fontSize: 10 }}
                        >
                          {dayName}
                        </AppText>
                      </View>
                      <AppText
                        variant="caption"
                        bold
                        style={{ flex: 1, textAlign: 'right' }}
                      >
                        {valStr}
                      </AppText>
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <View
                          style={[
                            styles.statusPill,
                            {
                              backgroundColor: isGoal
                                ? `${colors.primary}1F`
                                : colors.backgroundSecondary,
                              borderColor: isGoal ? colors.primary : colors.border,
                            },
                          ]}
                        >
                          <AppText
                            variant="caption"
                            bold={isGoal}
                            style={{
                              fontSize: 10,
                              color: isGoal
                                ? colors.primary
                                : colors.textTertiary,
                            }}
                          >
                            {isGoal ? 'Goal Met' : 'Recorded'}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Disclaimer */}
              <AppText
                variant="caption"
                secondary
                style={[styles.disclaimer, { color: colors.textTertiary }]}
              >
                Generated by Vitality Health App. For fitness and personal
                wellness tracking only. Does not replace professional medical
                advice.
              </AppText>
            </View>
          </ScrollView>

          {/* Bottom Action Buttons */}
          <View
            style={[
              styles.actions,
              { borderTopColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <AppButton
              title="Share"
              variant="ghost"
              onPress={onShare}
              style={[
                styles.actionButton,
                { backgroundColor: colors.primaryLight },
              ]}
            />
            <AppButton
              title="Download PDF"
              onPress={onDownloadPdf}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    height: '92%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  documentPaper: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  documentBanner: {
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    minWidth: '46%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  table: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableHeader: {
    paddingVertical: 10,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  disclaimer: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 14,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
