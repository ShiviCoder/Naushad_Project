import { useState } from "react";
import { Animated, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const RadioButton = ({ type = "status", selected, onSelect, labels = [] }) => {
  // ✅ Status toggle (Accepted / Pending)
  if (type === "status") {
    const [isAccepted, setIsAccepted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const AcceptedOffset = useState(new Animated.Value(0))[0];
    const PendingOffset = useState(new Animated.Value(0))[0];

    const thumbSize = wp("3.5%");
    const trackWidth = wp("12%");
    const trackHeight = hp("3%");
    const padding = wp("1.5%");

    const acceptTranslateX = AcceptedOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, trackWidth - thumbSize - padding],
    });

    const pendingTranslateX = PendingOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, trackWidth - thumbSize - padding],
    });

    const toggleSwitchAccepted = () => {
      Animated.timing(AcceptedOffset, {
        toValue: isAccepted ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setIsAccepted(!isAccepted);
    };

    const toggleSwitchPending = () => {
      Animated.timing(PendingOffset, {
        toValue: isPending ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      setIsPending(!isPending);
    };

    return (
      <View style={styles.checkContainer}>
        {/* Accepted */}
        <View style={styles.checkBox}>
          <Text style={{ fontSize: wp("3.5%") }}>Accepted</Text>
          <TouchableOpacity activeOpacity={1} onPress={toggleSwitchAccepted}>
            <View
              style={[
                styles.track,
                {
                  width: trackWidth,
                  height: trackHeight,
                  backgroundColor: isAccepted ? "#2196F3" : "#ccc",
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
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Pending */}
        <View style={styles.checkBox}>
          <Text style={{ fontSize: wp("3.5%") }}>Pending</Text>
          <TouchableOpacity activeOpacity={1} onPress={toggleSwitchPending}>
            <View
              style={[
                styles.track,
                {
                  width: trackWidth,
                  height: trackHeight,
                  backgroundColor: isPending ? "#2196F3" : "#ccc",
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
    const padding = wp("1.5%");

    const translateX = Offset.interpolate({
      inputRange: [0, 1],
      outputRange: [padding, trackWidth - thumbSize - padding],
    });

    const toggleSwitch = () => {
      Animated.timing(Offset, {
        toValue: isOn ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
      const newValue = !isOn;
      setIsOn(newValue);
      if (onSelect) onSelect(newValue); // true = Dark, false = Light
    };

    return (
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, { fontSize: wp("3.5%") }]}>{labels[0] || "Off"}</Text>
        <TouchableOpacity activeOpacity={1} onPress={toggleSwitch}>
          <View
            style={[
              styles.track,
              {
                width: trackWidth,
                height: trackHeight,
                backgroundColor: isOn ? "#2196F3" : "#ccc",
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
                  transform: [{ translateX }],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
        <Text style={[styles.toggleLabel, { fontSize: wp("3.5%") }]}>{labels[1] || "On"}</Text>
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
    backgroundColor: "#fff",
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
  toggleLabel: {
    fontWeight: "500",
    color: "#333",
  },
});

export default RadioButton;