import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Rect,
} from 'react-native-svg';

interface FitnessAvatarProps {
  height?: number;
  width?: number;
  gender?: 'male' | 'female' | string;
}

const FitnessAvatar: React.FC<FitnessAvatarProps> = ({
  height = 240,
  width = 130,
}) => {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 130 240"
        fill="none"
      >
        {/* Shadow under feet */}
        <Ellipse
          cx="65"
          cy="234"
          rx="38"
          ry="5"
          fill="#1E293B"
          opacity="0.15"
        />

        {/* Shoes */}
        <G id="shoes">
          {/* Left Shoe */}
          <Path
            d="M48 226 C44 226, 36 228, 36 233 C36 235, 42 236, 54 236 C57 236, 58 232, 57 228 Z"
            fill="#78350F"
          />
          {/* Right Shoe */}
          <Path
            d="M82 226 C86 226, 94 228, 94 233 C94 235, 88 236, 76 236 C73 236, 72 232, 73 228 Z"
            fill="#78350F"
          />
        </G>

        {/* Pants / Legs */}
        <G id="legs">
          {/* Left Leg */}
          <Path
            d="M49 140 L45 228 L56 228 L62 144 Z"
            fill="#1E3A8A"
          />
          {/* Right Leg */}
          <Path
            d="M81 140 L85 228 L74 228 L68 144 Z"
            fill="#1E3A8A"
          />
        </G>

        {/* Torso / Blazer Jacket */}
        <G id="torso">
          {/* Jacket Body */}
          <Path
            d="M40 76 L90 76 L95 146 L35 146 Z"
            fill="#0D9488"
          />
          {/* Shirt / Tie Inlay */}
          <Path
            d="M58 76 L65 110 L72 76 Z"
            fill="#F8FAFC"
          />
          {/* Tie */}
          <Path
            d="M63 86 L65 120 L67 86 Z"
            fill="#1E293B"
          />
          {/* Blazer Lapels */}
          <Path
            d="M40 76 L58 116 L54 116 L38 88 Z"
            fill="#0F766E"
          />
          <Path
            d="M90 76 L72 116 L76 116 L92 88 Z"
            fill="#0F766E"
          />
        </G>

        {/* Crossed Arms */}
        <G id="arms">
          {/* Left Upper Arm */}
          <Path
            d="M38 78 L26 112 L44 126 L48 110 Z"
            fill="#0D9488"
          />
          {/* Right Upper Arm */}
          <Path
            d="M92 78 L104 112 L86 126 L82 110 Z"
            fill="#0D9488"
          />
          {/* Crossed Forearms */}
          <Path
            d="M32 114 Q65 130 98 114 L94 126 Q65 142 36 126 Z"
            fill="#0F766E"
          />
          {/* Hands tucked */}
          <Circle cx="35" cy="120" r="5" fill="#FBCFE8" />
          <Circle cx="95" cy="120" r="5" fill="#FBCFE8" />
        </G>

        {/* Neck */}
        <Rect x="60" y="66" width="10" height="12" rx="3" fill="#FBCFE8" />

        {/* Head & Hair */}
        <G id="head">
          {/* Face */}
          <Ellipse cx="65" cy="52" rx="14" ry="17" fill="#FBCFE8" />
          {/* Ears */}
          <Circle cx="50" cy="52" r="3.5" fill="#FBCFE8" />
          <Circle cx="80" cy="52" r="3.5" fill="#FBCFE8" />
          {/* Hair */}
          <Path
            d="M51 46 C51 34, 60 30, 68 30 C76 30, 81 35, 80 44 C77 39, 71 37, 65 37 C58 37, 53 41, 51 46 Z"
            fill="#78350F"
          />
          {/* Eyes */}
          <Circle cx="60" cy="50" r="1.5" fill="#1E293B" />
          <Circle cx="70" cy="50" r="1.5" fill="#1E293B" />
          {/* Smile */}
          <Path
            d="M61 58 Q65 62 69 58"
            stroke="#991B1B"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
};

export default memo(FitnessAvatar);
