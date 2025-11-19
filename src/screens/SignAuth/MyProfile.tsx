import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import Head from "../../components/Head";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";




const MyProfile = () => {
  const [filePath, setFilePath] = useState({});
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const navigation = useNavigation();
  const { theme } = useTheme();

  const chooseFile = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (response.assets?.[0]) setFilePath(response.assets[0]);
    });
  };

  useEffect(() => {
    const fetchUserFromAPI = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          console.log("❌ No token found");
          return;
        }

        const response = await fetch("https://naushad.onrender.com/api/auth/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        console.log("📡 API User Response:", json);

        const userData = json.data || json.user || json;

        setUser(userData);

        // Store in AsyncStorage
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

      } catch (error) {
        console.log("❌ API Fetch Error:", error);
      }
    };

    fetchUserFromAPI();
  }, []);

  const openEditModal = (label, field) => {
    setEditLabel(label);
    setEditingField(field);
    setTempValue(user?.[field] || "");
    setEditModal(true);
  };

  const handleSaveField = async () => {
    if (!user || !editingField) return;
    const updatedUser = { ...user, [editingField]: tempValue };
    setUser(updatedUser);
    setEditModal(false);

    // Save to AsyncStorage
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        parsed.user = updatedUser;
        await AsyncStorage.setItem("userData", JSON.stringify(parsed));
      }
    } catch (err) {
      console.log("Error saving updated user:", err);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  const renderInfoRow = (icon, label, fieldKey, disabled = false) => (
    <TouchableOpacity
      style={styles.infoRow}
      activeOpacity={disabled ? 1 : 0.8}
      onPress={() => {
        if (!disabled) openEditModal(label, fieldKey);
      }}
    >
      <Icon
        name={icon}
        size={22}
        color={COLORS.primary}
        style={{ marginTop: hp("1%") }}
      />
      <View style={styles.infoTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{user?.[fieldKey] || "Not available"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={[styles.fixedHeader, { backgroundColor: theme.background }]}>
        <Head
          title="My Profile"
          rightComponent={
            <TouchableOpacity>
              <Text style={[styles.saveText, { color: theme.textPrimary }]}>
                Save
              </Text>
            </TouchableOpacity>
          }
        />
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: hp("10%"),
          paddingBottom: hp("5%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <TouchableOpacity onPress={() => setModal(true)}>
              <Image
                style={styles.profilePic}
                source={
                  user?.avatar && user?.avatar !== "" && user?.avatar !== "null"
                    ? { uri: user.avatar }
                    : user?.image && user?.image !== "" && user?.image !== "null"
                      ? { uri: user.image }
                      : require('../../assets/user.png')
                }
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cameraContainer} onPress={chooseFile}>
              <Icon name="camera" size={wp("5%")} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {user?.fullName || "Your Name"}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || "yourmail@email.com"}
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderInfoRow("person-outline", "Full Name", "fullName")}
          {renderInfoRow("mail-outline", "Email", "email", true)}
          {renderInfoRow("male-female-outline", "Gender", "gender")}
          {renderInfoRow("call-outline", "Phone", "phone")}
          {renderInfoRow("location-outline", "Address", "address")}
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal visible={modal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.closeArea}
            onPress={() => setModal(false)}
          >
            <Image
              style={styles.fullImage}
              resizeMode="contain"
              source={
                filePath.uri
                  ? { uri: filePath.uri }
                  : require("../../assets/user.png")
              }
            />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Edit Field Popup */}
      <Modal visible={editModal} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>Edit {editLabel}</Text>
            <TextInput
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={`Enter ${editLabel}`}
              placeholderTextColor="#aaa"
              style={styles.popupInput}
            />

            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveField}>
                <Text style={styles.saveTextBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
  },
  saveText: {
    fontSize: wp("4%"),
    fontWeight: "700"
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  // Profile Section
  profileSection: {
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  profileImageWrapper: {
    width: wp("30%"),
    height: wp("30%"),
    borderRadius: wp("15%"),
    overflow: "hidden",
    borderWidth: 3,
    borderColor: COLORS.primary,
    elevation: 5,
    backgroundColor: "#fff",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: wp("15%"),
  },
  cameraContainer: {
    position: "absolute",
    bottom: 7,
    right: 7,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    elevation: 5,
  },
  userName: {
    fontSize: wp("5%"),
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: hp("1%"),
  },
  userEmail: {
    fontSize: wp("3.8%"),
    color: "#666",
    marginTop: 2,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: wp("4%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    marginHorizontal: wp("5%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: hp("1.5%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: hp("1%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  infoTextContainer: { marginLeft: wp("3%"), flex: 1 },
  label: {
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: COLORS.primary,
  },
  value: {
    fontSize: wp("4%"),
    color: "#333",
    marginTop: 2,
  },

  // Image Modal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  fullImage: {
    width: wp("90%"),
    height: hp("70%"),
    borderRadius: 10,
  },

  // Edit Popup
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: wp("85%"),
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: wp("6%"),
    elevation: 10,
  },
  popupTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: hp("2%"),
    textAlign: "center",
  },
  popupInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: wp("3%"),
    fontSize: wp("3.8%"),
    color: "#000",
  },
  popupButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("3%"),
  },
  cancelBtn: {
    backgroundColor: "#ccc",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("6%"),
    borderRadius: 8,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("6%"),
    borderRadius: 8,
  },
  cancelText: { color: "#000", fontWeight: "600" },
  saveTextBtn: { color: "#fff", fontWeight: "600" },
});

export default MyProfile;
