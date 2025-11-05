import React, { useState } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useTheme } from "../context/ThemeContext";
import COLORS from "../utils/Colors";

const RadioButton = ({ type = "status", selected, onSelect, labels = [] }) => {
  const { theme, toggleTheme } = useTheme();

  // ✅ Status toggle (Accepted / Pending)
  if (type === "status") {
    const [isAccepted, setIsAccepted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const AcceptedOffset = useState(new Animated.Value(0))[0];
    const PendingOffset = useState(new Animated.Value(0))[0];

    const thumbSize = wp("3.5%");
    const trackWidth = wp("12%");
    const trackHeight = hp("3%");
    const padding = wp("1%");

    const acceptTranslateX = AcceptedOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, trackWidth - thumbSize - padding * 2],
    });

    const pendingTranslateX = PendingOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, trackWidth - thumbSize - padding * 2],
    });

    const toggleSwitchAccepted = () => {
      const newValue = !isAccepted;
      setIsAccepted(newValue);
      setIsPending(false);
      Animated.timing(AcceptedOffset, {
        toValue: newValue ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(PendingOffset, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      if (onSelect) onSelect(newValue ? "accept" : "all");
    };

    const toggleSwitchPending = () => {
      const newValue = !isPending;
      setIsPending(newValue);
      setIsAccepted(false);
      Animated.timing(PendingOffset, {
        toValue: newValue ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(AcceptedOffset, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      if (onSelect) onSelect(newValue ? "pending" : "all");
    };

    const primary = COLORS.primary;

    return (
      <View style={styles.checkContainer}>
        {/* ✅ Accepted */}
        <View style={styles.checkBox}>
          <Text style={{ fontSize: wp("3.5%"), color: primary }}>
            {labels[0] || "Accepted"}
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleSwitchAccepted}>
            <View
              style={[
                styles.track,
                {
                  width: trackWidth,
                  height: trackHeight,
                  backgroundColor: isAccepted ? primary : theme.background,
                  borderColor: primary,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.thumb,
                  {
                    width: thumbSize,
                    height: thumbSize,
                    borderRadius: thumbSize / 2,
                    transform: [{ translateX: acceptTranslateX }],
                    backgroundColor: isAccepted ? theme.background : primary,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* ✅ Pending */}
        <View style={styles.checkBox}>
          <Text style={{ fontSize: wp("3.5%"), color: primary }}>
            {labels[1] || "Pending"}
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleSwitchPending}>
            <View
              style={[
                styles.track,
                {
                  width: trackWidth,
                  height: trackHeight,
                  backgroundColor: isPending ? primary : theme.background,
                  borderColor: primary,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.thumb,
                  {
                    width: thumbSize,
                    height: thumbSize,
                    borderRadius: thumbSize / 2,
                    transform: [{ translateX: pendingTranslateX }],
                    backgroundColor: isPending ? theme.background : primary,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  // ✅ Theme toggle (Light / Dark)
  if (type === "toggle") {
    const [isOn, setIsOn] = useState(selected === "Dark");
    const Offset = useState(new Animated.Value(isOn ? 1 : 0))[0];

    const thumbSize = wp("3%");
    const trackWidth = wp("10%");
    const trackHeight = hp("3%");
    const padding = wp("1%");

    const translateX = Offset.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, trackWidth - thumbSize - padding * 1.5],
    });

    const toggleSwitch = () => {
      const newValue = !isOn;
      setIsOn(newValue);

      Animated.timing(Offset, {
        toValue: newValue ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();

      toggleTheme(newValue ? "Dark" : "Light");
      if (onSelect) onSelect(newValue); // true = Dark, false = Light
    };

    // 🔹 Updated colors
    const inactiveColor = theme.background === "#fff" ? "#000" : "#fff"; // black in light, white in dark
    const activeColor = theme.primary; // green

    return (
      <View style={styles.toggleContainer}>
        <Text style={{ color: inactiveColor }}>{labels[0] || "Light"}</Text>
        <TouchableOpacity activeOpacity={1} onPress={toggleSwitch}>
          <View
            style={[
              styles.track,
              {
                width: trackWidth,
                height: trackHeight,
                backgroundColor: isOn ? COLORS.primary :  theme.background ,
                borderColor: COLORS.primary,
                borderWidth: 1.5,

              },
            ]}
          >
            <Animated.View
              style={[
                styles.thumb,
                {
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: thumbSize / 1,
                  transform: [{ translateX: translateX }],
                  backgroundColor: isOn ? theme.background : COLORS.primary,
                  
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        <Text style={{ color: inactiveColor }}>{labels[1] || "Dark"}</Text>
      </View>
    );
  }

  if (type === "gender") {
    const [isMale, setIsMale] = useState(selected === "Male");
    const Offset = useState(new Animated.Value(isMale ? 0 : 1))[0];

    const thumbSize = wp("3.5%");
    const trackWidth = wp("12%");
    const trackHeight = hp("3%");
    const padding = wp("1%");


    const translateX = Offset.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, trackWidth - thumbSize - padding * 1.5],
    });

    const toggleGender = () => {
      const newValue = !isMale;
      setIsMale(newValue);

      Animated.timing(Offset, {
        toValue: newValue ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();

      if (onSelect) onSelect(newValue ? "Male" : "Female");
    };

    const maleColor = COLORS.primary;
    const femaleColor = COLORS.primary;

    return (
      <View style={styles.genderToggleContainer}>
        <Text
          style={[
            styles.genderLabel,
            { color: isMale ? maleColor : theme.textPrimary },
          ]}
        >
          Male
        </Text>

        <TouchableOpacity activeOpacity={0.8} onPress={toggleGender}>
          <View
            style={[
              styles.track,
              {
                width: trackWidth,
                height: trackHeight,
                backgroundColor: isMale ? theme.background : COLORS.primary,
                borderColor: COLORS.primary,
                borderWidth: 1.5,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.thumb,
                {
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: thumbSize / 1,
                  transform: [{ translateX: translateX }],
                  backgroundColor: isMale ? COLORS.primary : theme.background,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        <Text
          style={[
            styles.genderLabel,
            { color: !isMale ? femaleColor : theme.textPrimary },
          ]}
        >
          Female
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  checkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    marginVertical: hp("1%"),
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  track: {
    borderRadius: 20,
    justifyContent: "center",
  },
  thumb: {
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    marginTop: hp("1%"),
  },
  genderToggleContainer: {
    marginVertical: hp("0.5%"),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%')
  },
  genderLabel: {
    fontWeight: "600",
    fontSize: wp("3.5%"),
  },
});

export default RadioButton;