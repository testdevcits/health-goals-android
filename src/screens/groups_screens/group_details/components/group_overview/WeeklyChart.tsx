import React, { memo } from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../../components';
import { Member, formatSteps } from '../../constants';

interface WeeklyChartProps {
  styles: any;
  members: Member[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = memo(
  ({ styles, members }) => {
    const topMembers = [...members]
      .sort((first, second) => second.steps - first.steps)
      .slice(0, 7);
    const maxSteps = Math.max(...topMembers.map(member => member.steps), 0);
    const axisValues = [maxSteps, Math.round(maxSteps / 2), 0];
    const compactSteps = (steps: number) =>
      steps >= 1000 ? `${(steps / 1000).toFixed(1)}k` : String(steps);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <AppText variant="subtitle1">Member steps</AppText>
          <View style={styles.weekBadge}>
            <AppText variant="caption" primary bold>
              Last 7 days
            </AppText>
          </View>
        </View>
        <View style={styles.chartCard}>
          {topMembers.length ? (
            <>
              <AppText variant="caption" secondary style={styles.chartCaption}>
                Steps by member · top {topMembers.length}
              </AppText>
              <View style={styles.chartBody}>
                <View style={styles.chartYAxis}>
                  {axisValues.map((value, index) => (
                    <AppText
                      key={`${value}-${index}`}
                      variant="caption"
                      secondary
                    >
                      {compactSteps(value)}
                    </AppText>
                  ))}
                </View>
                <View style={styles.chartPlot}>
                  <View style={[styles.chartGridLine, { top: '12%' }]} />
                  <View style={[styles.chartGridLine, { top: '56%' }]} />
                  <View style={[styles.chartGridLine, { bottom: 0 }]} />
                  <View style={styles.chartBars}>
                    {topMembers.map(member => {
                      const barHeight = maxSteps
                        ? Math.max(3, (member.steps / maxSteps) * 100)
                        : 0;
                      return (
                        <View
                          key={member.id}
                          accessibilityRole="image"
                          accessibilityLabel={`${member.name}: ${formatSteps(
                            member.steps,
                          )} steps in the last 7 days`}
                          style={styles.chartColumn}
                        >
                          <AppText
                            variant="caption"
                            primary
                            bold
                            center
                            numberOfLines={1}
                            style={[
                              styles.chartValue,
                              { bottom: `${barHeight}%` },
                            ]}
                          >
                            {compactSteps(member.steps)}
                          </AppText>
                          <View
                            style={[
                              styles.chartBar,
                              {
                                height: `${barHeight}%` as any,
                                backgroundColor: member.color,
                              },
                            ]}
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
              <View style={styles.chartLabels}>
                <View style={styles.chartAxisSpacer} />
                {topMembers.map(member => (
                  <AppText
                    key={member.id}
                    variant="caption"
                    secondary
                    center
                    numberOfLines={1}
                    style={styles.chartMemberLabel}
                  >
                    {member.name.split(/\s+/)[0]}
                  </AppText>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.chartEmpty}>
              <AppText variant="body2" secondary center>
                Member step totals will appear here after activity syncs.
              </AppText>
            </View>
          )}
        </View>
      </View>
    );
  },
);

export default WeeklyChart;
