import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Contact = {
  id: string;
  name: string;
  phone: string;
};

type EmergencyRequest = {
  id: string;
  type: string;
  location: string;
  coordinates: string;
  time: string;
  status: "Recorded" | "Active";
};

const REQUEST_KEY = "resqnet_emergency_requests";

export default function EmergencyScreen() {
  const router = useRouter();

  const [locationText, setLocationText] = useState(
    "Getting current location..."
  );

  const [coordinates, setCoordinates] = useState("");
  const [contactCount, setContactCount] = useState(0);
  const [requestActive, setRequestActive] = useState(false);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);

  useEffect(() => {
    getLocation();
    loadContacts();
    loadRequests();
  }, []);

  // GET CURRENT LOCATION
  const getLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationText("Location permission denied");
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      const address =
        await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

      if (address.length > 0) {
        const place = address[0];

        const readableAddress = [
          place.name,
          place.street,
          place.district,
          place.city,
          place.region,
          place.postalCode,
          place.country,
        ]
          .filter(Boolean)
          .filter(
            (value, index, array) =>
              array.indexOf(value) === index
          )
          .join(", ");

        setLocationText(
          readableAddress || "Address detected"
        );
      } else {
        setLocationText("Address not available");
      }

      setCoordinates(
        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      );
    } catch (error) {
      console.log("Location error:", error);
      setLocationText("Unable to get location");
      setCoordinates("");
    }
  };

  // LOAD CONTACTS
  const loadContacts = async () => {
    try {
      const savedContacts =
        await AsyncStorage.getItem("resqnet_contacts");

      if (savedContacts) {
        const contacts: Contact[] =
          JSON.parse(savedContacts);

        setContactCount(contacts.length);
      }
    } catch (error) {
      console.log("Contact loading error:", error);
    }
  };

  // LOAD EMERGENCY REQUESTS
  const loadRequests = async () => {
    try {
      const savedRequests =
        await AsyncStorage.getItem(REQUEST_KEY);

      if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
      }
    } catch (error) {
      console.log("Request loading error:", error);
    }
  };

  // SOS CONFIRMATION
  const handleSOS = () => {
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to activate the emergency assistance request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Activate SOS",
          style: "destructive",
          onPress: activateSOS,
        },
      ]
    );
  };

  // ACTIVATE SOS
  const activateSOS = async () => {
    const newRequest: EmergencyRequest = {
      id: Date.now().toString(),
      type: "Emergency SOS",
      location: locationText,
      coordinates: coordinates,
      time: new Date().toLocaleString(),
      status: "Active",
    };

    const updatedRequests = [
      newRequest,
      ...requests,
    ].slice(0, 10);

    try {
      await AsyncStorage.setItem(
        REQUEST_KEY,
        JSON.stringify(updatedRequests)
      );

      setRequests(updatedRequests);
      setRequestActive(true);

      Alert.alert(
        "SOS Activated",
        "Emergency assistance request has been recorded with your current location.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.log("SOS save error:", error);

      Alert.alert(
        "Error",
        "Unable to save emergency request."
      );
    }
  };

  // SERVICE ACTION
  const handleService = (service: string) => {
    Alert.alert(
      service,
      `${service} has been selected for this emergency request.`,
      [
        {
          text: "OK",
        },
      ]
    );
  };

  // CLEAR ACTIVE REQUEST
  const clearActiveRequest = () => {
    Alert.alert(
      "Close Emergency Request",
      "Do you want to mark the current emergency request as completed?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Complete",
          onPress: async () => {
            setRequestActive(false);

            const updatedRequests =
              requests.map((item, index) =>
                index === 0
                  ? {
                      ...item,
                      status: "Recorded" as const,
                    }
                  : item
              );

            setRequests(updatedRequests);

            await AsyncStorage.setItem(
              REQUEST_KEY,
              JSON.stringify(updatedRequests)
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* HEADER */}
        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Text style={styles.backButton}>
              ‹
            </Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.logo}>
              ResQNet
            </Text>

            <Text style={styles.subtitle}>
              Emergency Center
            </Text>
          </View>

          <View style={styles.demoBadge}>
            <View style={styles.demoDot} />

            <Text style={styles.demoText}>
              DEMO
            </Text>
          </View>

        </View>

        {/* TITLE */}
        <View style={styles.titleSection}>

          <Text style={styles.title}>
            Emergency Assistance
          </Text>

          <Text style={styles.description}>
            Quickly create and manage an emergency assistance request.
          </Text>

        </View>

        {/* DEMO MODE NOTICE */}
        <View style={styles.demoCard}>

          <View style={styles.demoIcon}>
            <Text style={styles.demoIconText}>
              i
            </Text>
          </View>

          <View style={styles.demoInfo}>
            <Text style={styles.demoTitle}>
              Prototype Demo Mode
            </Text>

            <Text style={styles.demoDescription}>
              Emergency requests are currently stored locally on this device.
            </Text>
          </View>

        </View>

        {/* SOS CARD */}
        <View style={styles.sosCard}>

          <View style={styles.sosTopRow}>

            <View>
              <Text style={styles.sosHeading}>
                Emergency SOS
              </Text>

              <Text style={styles.sosDescription}>
                Include your current location
              </Text>
            </View>

            <View
              style={[
                styles.requestBadge,
                requestActive &&
                  styles.requestBadgeActive,
              ]}
            >
              <Text
                style={[
                  styles.requestBadgeText,
                  requestActive &&
                    styles.requestBadgeTextActive,
                ]}
              >
                {requestActive
                  ? "ACTIVE"
                  : "READY"}
              </Text>
            </View>

          </View>

          <TouchableOpacity
            style={[
              styles.sosButton,
              requestActive &&
                styles.sosButtonActive,
            ]}
            activeOpacity={0.8}
            onPress={handleSOS}
          >

            <Text style={styles.sosIcon}>
              !
            </Text>

            <Text style={styles.sosText}>
              {requestActive ? "ACTIVE" : "SOS"}
            </Text>

            <Text style={styles.sosSmall}>
              {requestActive
                ? "REQUEST ACTIVE"
                : "EMERGENCY"}
            </Text>

          </TouchableOpacity>

          <Text style={styles.sosNote}>
            Tap only when emergency assistance is required.
          </Text>

          {requestActive && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={clearActiveRequest}
            >
              <Text style={styles.completeText}>
                Mark Request Completed
              </Text>
            </TouchableOpacity>
          )}

        </View>

        {/* QUICK STATUS */}
        <View style={styles.quickRow}>

          <View style={styles.quickCard}>
            <Text style={styles.quickIcon}>
              📍
            </Text>

            <Text style={styles.quickNumber}>
              {coordinates
                ? "ON"
                : "--"}
            </Text>

            <Text style={styles.quickLabel}>
              Location
            </Text>
          </View>

          <View style={styles.quickCard}>
            <Text style={styles.quickIcon}>
              👥
            </Text>

            <Text style={styles.quickNumber}>
              {contactCount}
            </Text>

            <Text style={styles.quickLabel}>
              Contacts
            </Text>
          </View>

          <View style={styles.quickCard}>
            <Text style={styles.quickIcon}>
              📋
            </Text>

            <Text style={styles.quickNumber}>
              {requests.length}
            </Text>

            <Text style={styles.quickLabel}>
              Requests
            </Text>
          </View>

        </View>

        {/* LOCATION */}
        <View style={styles.infoCard}>

          <View style={styles.infoIcon}>
            <Text style={styles.emoji}>
              📍
            </Text>
          </View>

          <View style={styles.infoContent}>

            <Text style={styles.infoLabel}>
              CURRENT LOCATION
            </Text>

            <Text style={styles.infoValue}>
              {locationText}
            </Text>

            {coordinates !== "" && (
              <Text style={styles.coordinates}>
                {coordinates}
              </Text>
            )}

          </View>

          <TouchableOpacity
            onPress={getLocation}
            style={styles.refreshButton}
          >
            <Text style={styles.refresh}>
              ↻
            </Text>
          </TouchableOpacity>

        </View>

        {/* CONTACTS */}
        <View style={styles.contactCard}>

          <View style={styles.infoIcon}>
            <Text style={styles.emoji}>
              👥
            </Text>
          </View>

          <View style={styles.infoContent}>

            <Text style={styles.infoLabel}>
              EMERGENCY CONTACTS
            </Text>

            <Text style={styles.infoValue}>
              {contactCount} trusted contact
              {contactCount === 1 ? "" : "s"}
            </Text>

            <Text style={styles.smallText}>
              Saved on this device
            </Text>

          </View>

          <TouchableOpacity
            style={styles.manageButton}
            onPress={() =>
              router.push("/contacts")
            }
          >
            <Text style={styles.manageText}>
              Manage
            </Text>
          </TouchableOpacity>

        </View>

        {/* SERVICES */}
        <View style={styles.sectionHeader}>

          <View>
            <Text style={styles.sectionTitle}>
              Emergency Services
            </Text>

            <Text style={styles.sectionSub}>
              Select the assistance category
            </Text>
          </View>

        </View>

        {/* MEDICAL */}
        <TouchableOpacity
          style={styles.serviceCard}
          activeOpacity={0.8}
          onPress={() =>
            handleService("Medical Assistance")
          }
        >

          <View style={styles.serviceIcon}>
            <Text style={styles.serviceEmoji}>
              🏥
            </Text>
          </View>

          <View style={styles.serviceInfo}>

            <Text style={styles.serviceTitle}>
              Medical Assistance
            </Text>

            <Text style={styles.serviceSub}>
              Medical emergency support
            </Text>

          </View>

          <Text style={styles.serviceArrow}>
            ›
          </Text>

        </TouchableOpacity>

        {/* FIRE */}
        <TouchableOpacity
          style={styles.serviceCard}
          activeOpacity={0.8}
          onPress={() =>
            handleService("Fire Emergency")
          }
        >

          <View style={styles.serviceIcon}>
            <Text style={styles.serviceEmoji}>
              🔥
            </Text>
          </View>

          <View style={styles.serviceInfo}>

            <Text style={styles.serviceTitle}>
              Fire Emergency
            </Text>

            <Text style={styles.serviceSub}>
              Fire and rescue assistance
            </Text>

          </View>

          <Text style={styles.serviceArrow}>
            ›
          </Text>

        </TouchableOpacity>

        {/* POLICE */}
        <TouchableOpacity
          style={styles.serviceCard}
          activeOpacity={0.8}
          onPress={() =>
            handleService("Police Assistance")
          }
        >

          <View style={styles.serviceIcon}>
            <Text style={styles.serviceEmoji}>
              🚓
            </Text>
          </View>

          <View style={styles.serviceInfo}>

            <Text style={styles.serviceTitle}>
              Police Assistance
            </Text>

            <Text style={styles.serviceSub}>
              Safety and security assistance
            </Text>

          </View>

          <Text style={styles.serviceArrow}>
            ›
          </Text>

        </TouchableOpacity>

        {/* REQUEST HISTORY */}
        <View style={styles.sectionHeader}>

          <View>
            <Text style={styles.sectionTitle}>
              Emergency Request History
            </Text>

            <Text style={styles.sectionSub}>
              Recent requests recorded by ResQNet
            </Text>
          </View>

        </View>

        {requests.length === 0 ? (
          <View style={styles.emptyCard}>

            <Text style={styles.emptyIcon}>
              📋
            </Text>

            <Text style={styles.emptyTitle}>
              No emergency requests
            </Text>

            <Text style={styles.emptyText}>
              Your emergency requests will appear here.
            </Text>

          </View>
        ) : (
          requests.slice(0, 3).map((request) => (
            <View
              key={request.id}
              style={styles.historyCard}
            >

              <View style={styles.historyIcon}>
                <Text style={styles.historyEmoji}>
                  🚨
                </Text>
              </View>

              <View style={styles.historyContent}>

                <Text style={styles.historyTitle}>
                  {request.type}
                </Text>

                <Text style={styles.historyLocation}>
                  {request.location}
                </Text>

                <Text style={styles.historyTime}>
                  {request.time}
                </Text>

              </View>

              <View
                style={[
                  styles.historyStatus,
                  request.status === "Active" &&
                    styles.historyStatusActive,
                ]}
              >
                <Text
                  style={[
                    styles.historyStatusText,
                    request.status === "Active" &&
                      styles.historyStatusTextActive,
                  ]}
                >
                  {request.status}
                </Text>
              </View>

            </View>
          ))
        )}

        {/* SYSTEM STATUS */}
        <View
          style={[
            styles.statusCard,
            requestActive &&
              styles.statusCardActive,
          ]}
        >

          <View
            style={[
              styles.statusCircle,
              requestActive &&
                styles.statusCircleActive,
            ]}
          >
            <Text style={styles.statusEmoji}>
              {requestActive ? "✓" : "i"}
            </Text>
          </View>

          <View style={styles.statusContent}>

            <Text style={styles.statusTitle}>
              {requestActive
                ? "Emergency Request Active"
                : "Emergency System Ready"}
            </Text>

            <Text style={styles.statusSub}>
              {requestActive
                ? "Your request has been recorded with the current location."
                : "Location services and emergency assistance are ready."}
            </Text>

          </View>

        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>
          ResQNet Smart Emergency Assistance Platform
        </Text>

      </ScrollView>

      {/* BOTTOM BUTTON */}
      <View style={styles.bottomBar}>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() =>
            router.push("/")
          }
        >

          <Text style={styles.homeIcon}>
            ⌂
          </Text>

          <Text style={styles.homeText}>
            Back to Home
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    backgroundColor: "#102A43",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "300",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "800",
  },

  subtitle: {
    color: "#BFD7EA",
    fontSize: 12,
    marginTop: 2,
  },

  demoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#193B59",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
  },

  demoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#F6C344",
    marginRight: 5,
  },

  demoText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 14,
  },

  title: {
    color: "#102A43",
    fontSize: 23,
    fontWeight: "800",
  },

  description: {
    color: "#627D98",
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },

  demoCard: {
    marginHorizontal: 18,
    marginBottom: 12,
    backgroundColor: "#FFF8E1",
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  demoIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#F6C344",
    justifyContent: "center",
    alignItems: "center",
  },

  demoIconText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  demoInfo: {
    flex: 1,
    marginLeft: 10,
  },

  demoTitle: {
    color: "#7A5A00",
    fontSize: 12,
    fontWeight: "800",
  },

  demoDescription: {
    color: "#8A6D1D",
    fontSize: 10,
    marginTop: 3,
    lineHeight: 14,
  },

  sosCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },

  sosTopRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sosHeading: {
    color: "#102A43",
    fontSize: 19,
    fontWeight: "800",
  },

  sosDescription: {
    color: "#829AB1",
    fontSize: 11,
    marginTop: 4,
  },

  requestBadge: {
    backgroundColor: "#E7F0F7",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  requestBadgeActive: {
    backgroundColor: "#E7F7ED",
  },

  requestBadgeText: {
    color: "#486581",
    fontSize: 9,
    fontWeight: "900",
  },

  requestBadgeTextActive: {
    color: "#18794E",
  },

  sosButton: {
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: "#D92D20",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    elevation: 8,
  },

  sosButtonActive: {
    backgroundColor: "#B42318",
  },

  sosIcon: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 1,
  },

  sosSmall: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 2,
  },

  sosNote: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 14,
    textAlign: "center",
  },

  completeButton: {
    marginTop: 13,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#E7F7ED",
  },

  completeText: {
    color: "#18794E",
    fontSize: 10,
    fontWeight: "800",
  },

  quickRow: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: 12,
    gap: 9,
  },

  quickCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 13,
    alignItems: "center",
  },

  quickIcon: {
    fontSize: 18,
  },

  quickNumber: {
    color: "#102A43",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 3,
  },

  quickLabel: {
    color: "#829AB1",
    fontSize: 9,
    marginTop: 2,
  },

  infoCard: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  contactCard: {
    marginHorizontal: 18,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E8F1F8",
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 21,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    color: "#829AB1",
    fontSize: 9,
    fontWeight: "800",
  },

  infoValue: {
    color: "#243B53",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  coordinates: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 3,
  },

  smallText: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 3,
  },

  refreshButton: {
    padding: 5,
  },

  refresh: {
    color: "#486581",
    fontSize: 25,
    fontWeight: "700",
  },

  manageButton: {
    backgroundColor: "#E8F1F8",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },

  manageText: {
    color: "#102A43",
    fontSize: 10,
    fontWeight: "800",
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 11,
  },

  sectionTitle: {
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
  },

  sectionSub: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 3,
  },

  serviceCard: {
    marginHorizontal: 18,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },

  serviceIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#EEF4F8",
    justifyContent: "center",
    alignItems: "center",
  },

  serviceEmoji: {
    fontSize: 22,
  },

  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },

  serviceTitle: {
    color: "#102A43",
    fontSize: 14,
    fontWeight: "800",
  },

  serviceSub: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 3,
  },

  serviceArrow: {
    color: "#627D98",
    fontSize: 25,
  },

  emptyCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 28,
  },

  emptyTitle: {
    color: "#243B53",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 7,
  },

  emptyText: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 4,
  },

  historyCard: {
    marginHorizontal: 18,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF0EF",
    justifyContent: "center",
    alignItems: "center",
  },

  historyEmoji: {
    fontSize: 19,
  },

  historyContent: {
    flex: 1,
    marginLeft: 11,
  },

  historyTitle: {
    color: "#102A43",
    fontSize: 12,
    fontWeight: "800",
  },

  historyLocation: {
    color: "#627D98",
    fontSize: 10,
    marginTop: 3,
  },

  historyTime: {
    color: "#9FB3C8",
    fontSize: 9,
    marginTop: 3,
  },

  historyStatus: {
    backgroundColor: "#EEF2F6",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
  },

  historyStatusActive: {
    backgroundColor: "#E7F7ED",
  },

  historyStatusText: {
    color: "#627D98",
    fontSize: 8,
    fontWeight: "900",
  },

  historyStatusTextActive: {
    color: "#18794E",
  },

  statusCard: {
    marginHorizontal: 18,
    marginTop: 15,
    backgroundColor: "#EEF6FF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  statusCardActive: {
    backgroundColor: "#E7F7ED",
  },

  statusCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#D9EAF7",
    justifyContent: "center",
    alignItems: "center",
  },

  statusCircleActive: {
    backgroundColor: "#B7E4C7",
  },

  statusEmoji: {
    color: "#102A43",
    fontSize: 17,
    fontWeight: "900",
  },

  statusContent: {
    flex: 1,
    marginLeft: 11,
  },

  statusTitle: {
    color: "#102A43",
    fontSize: 13,
    fontWeight: "800",
  },

  statusSub: {
    color: "#627D98",
    fontSize: 10,
    marginTop: 3,
    lineHeight: 15,
  },

  footer: {
    color: "#9FB3C8",
    textAlign: "center",
    fontSize: 10,
    marginTop: 22,
    marginBottom: 20,
  },

  bottomBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E6EAF0",
    padding: 10,
  },

  homeButton: {
    height: 45,
    borderRadius: 12,
    backgroundColor: "#102A43",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  homeIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    marginRight: 7,
  },

  homeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

});