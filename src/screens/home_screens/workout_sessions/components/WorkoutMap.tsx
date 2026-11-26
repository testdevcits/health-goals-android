import React, { memo, useRef, useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, {
  Marker,
  Polyline,
  UrlTile,
  type LatLng,
  type Region,
} from 'react-native-maps';
import { Navigation, Locate, Eye, EyeOff } from 'lucide-react-native';
import { AppText } from '../../../../components';
import { spacing } from '../../../../theme/spacing';
import { radius } from '../../../../theme/radius';
import { typography } from '../../../../theme/typography';

export interface WorkoutMapProps {
  coordinates: LatLng[];
  isTracking: boolean;
  isAutoPaused?: boolean;
  activityColor: string;
  colors: any;
}

const DEFAULT_DELTA = 0.005;

// Default initial fallback (e.g. New Delhi coordinates, or will center immediately on first coordinate)
const DEFAULT_COORDINATE: LatLng = {
  latitude: 28.6139,
  longitude: 77.209,
};

const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const WorkoutMap: React.FC<WorkoutMapProps> = ({
  coordinates,
  isTracking,
  isAutoPaused = false,
  activityColor,
  colors,
}) => {
  const mapRef = useRef<MapView | null>(null);
  const [isFollowUser, setIsFollowUser] = useState(true);
  const [showMap, setShowMap] = useState(true);

  const latestCoordinate = useMemo(() => {
    if (coordinates.length > 0) {
      return coordinates[coordinates.length - 1];
    }
    return DEFAULT_COORDINATE;
  }, [coordinates]);

  const initialRegion: Region = useMemo(
    () => ({
      latitude: latestCoordinate.latitude,
      longitude: latestCoordinate.longitude,
      latitudeDelta: DEFAULT_DELTA,
      longitudeDelta: DEFAULT_DELTA,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Auto-center whenever user location updates if follow-user is active
  useEffect(() => {
    if (isFollowUser && coordinates.length > 0 && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: latestCoordinate.latitude,
          longitude: latestCoordinate.longitude,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        },
        500,
      );
    }
  }, [coordinates.length, isFollowUser, latestCoordinate]);

  const handleCenter = () => {
    setIsFollowUser(true);
    if (mapRef.current && latestCoordinate) {
      mapRef.current.animateToRegion(
        {
          latitude: latestCoordinate.latitude,
          longitude: latestCoordinate.longitude,
          latitudeDelta: DEFAULT_DELTA,
          longitudeDelta: DEFAULT_DELTA,
        },
        500,
      );
    }
  };

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          borderRadius: radius.xl,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.cardBorder || colors.divider,
          marginVertical: spacing.md,
        },
        headerBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.base,
          paddingVertical: spacing.sm,
          backgroundColor: colors.surface,
          borderBottomWidth: showMap ? 1 : 0,
          borderBottomColor: colors.cardBorder || colors.divider,
        },
        headerTitleRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
        },
        headerActionRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        statusBadge: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: spacing.xs,
          paddingVertical: 2,
          borderRadius: radius.full,
          backgroundColor: isTracking
            ? colors.primaryLight
            : colors.surfaceSecondary,
        },
        statusDot: {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: isTracking ? colors.primary : colors.textSecondary,
        },
        mapWrapper: {
          width: '100%',
          height: 220,
          position: 'relative',
        },
        map: {
          ...StyleSheet.absoluteFill,
        },
        controlButton: {
          position: 'absolute',
          bottom: spacing.sm,
          right: spacing.sm,
          width: 40,
          height: 40,
          borderRadius: radius.full,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          shadowColor: colors.textPrimary,
          shadowOpacity: 0.15,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          borderWidth: 1,
          borderColor: colors.cardBorder || colors.divider,
        },
        markerPin: {
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: colors.white,
          borderWidth: 3,
          borderColor: activityColor || colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 3,
        },
        markerInner: {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: activityColor || colors.primary,
        },
        startPin: {
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: colors.success || '#10b981',
          borderWidth: 2,
          borderColor: colors.white,
        },
        attributionBadge: {
          position: 'absolute',
          bottom: 4,
          left: 6,
          backgroundColor: 'rgba(0,0,0,0.45)',
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4,
        },
        attributionText: {
          fontSize: 9,
          color: colors.white,
          fontFamily: typography.caption.fontFamily,
        },
      }),
    [colors, showMap, isTracking, activityColor],
  );

  return (
    <View style={dynamicStyles.container}>
      {/* Header Bar */}
      <View style={dynamicStyles.headerBar}>
        <View style={dynamicStyles.headerTitleRow}>
          <Navigation size={16} color={colors.primary} />
          <AppText variant="h3" style={{ fontSize: typography.body1.fontSize }}>
            GPS Route
          </AppText>
          <View style={dynamicStyles.statusBadge}>
            <View
              style={[
                dynamicStyles.statusDot,
                isAutoPaused && {
                  backgroundColor: colors.warning || '#f59e0b',
                },
              ]}
            />
            <AppText
              variant="caption"
              style={{
                fontSize: 10,
                color: isAutoPaused
                  ? colors.warning || '#f59e0b'
                  : isTracking
                  ? colors.primary
                  : colors.textSecondary,
              }}
            >
              {isAutoPaused
                ? 'Auto-Paused (No Motion)'
                : isTracking
                ? 'Live GPS'
                : 'OSM Ready'}
            </AppText>
          </View>
        </View>

        <View style={dynamicStyles.headerActionRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowMap(!showMap)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {showMap ? (
              <Eye size={18} color={colors.textSecondary} />
            ) : (
              <EyeOff size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Content View */}
      {showMap && (
        <View style={dynamicStyles.mapWrapper}>
          <MapView
            ref={mapRef}
            style={dynamicStyles.map}
            initialRegion={initialRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass
            onPanDrag={() => setIsFollowUser(false)}
            mapType={Platform.OS === 'android' ? 'none' : 'standard'}
          >
            {/* Free OpenStreetMap Tiles - No Google API Key Needed */}
            <UrlTile
              urlTemplate={OSM_TILE_URL}
              maximumZ={19}
              flipY={false}
              zIndex={-1}
            />

            {/* Polyline Route Track */}
            {coordinates.length > 1 && (
              <Polyline
                coordinates={coordinates}
                strokeColor={activityColor || colors.primary}
                strokeWidth={4}
                lineCap="round"
                lineJoin="round"
                zIndex={2}
              />
            )}

            {/* Start Marker */}
            {coordinates.length > 1 && (
              <Marker
                coordinate={coordinates[0]}
                title="Start"
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={3}
              >
                <View style={dynamicStyles.startPin} />
              </Marker>
            )}

            {/* Current Position Marker */}
            {coordinates.length > 0 && (
              <Marker
                coordinate={latestCoordinate}
                title="Current Position"
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={4}
              >
                <View style={dynamicStyles.markerPin}>
                  <View style={dynamicStyles.markerInner} />
                </View>
              </Marker>
            )}
          </MapView>

          {/* Attribution as required by OpenStreetMap */}
          <View style={dynamicStyles.attributionBadge}>
            <AppText style={dynamicStyles.attributionText}>
              © OpenStreetMap contributors
            </AppText>
          </View>

          {/* Re-center / Follow button */}
          <TouchableOpacity
            style={dynamicStyles.controlButton}
            activeOpacity={0.8}
            onPress={handleCenter}
          >
            <Locate
              size={18}
              color={isFollowUser ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(WorkoutMap);
