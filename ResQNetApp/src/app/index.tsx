import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

type Incident = {
  id: string;
  type: string;
  location: string;
  date: string;
  description: string;
  status: string;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [locationText, setLocationText] =
    useState("Checking location...");

  const [coordinates, setCoordinates] =
    useState("");

  const [incidentCount, setIncidentCount] =
    useState(0);

  const [contactCount, setContactCount] =
    useState(0);

  const [recentIncidents, setRecentIncidents] =
    useState<Incident[]>([]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // LOAD DASHBOARD DATA
  const loadDashboardData = async () => {
    try {
      // LOAD INCIDENTS
      const savedIncidents =
        await AsyncStorage.getItem(
          "resqnet_incidents"
        );

      if (savedIncidents) {
        const incidents: Incident[] =
          JSON.parse(savedIncidents);

        setIncidentCount(incidents.length);
        setRecentIncidents(
          incidents.slice(0, 3)
        );
      } else {
        setIncidentCount(0);
        setRecentIncidents([]);
      }

      // LOAD CONTACTS
      const savedContacts =
        await AsyncStorage.getItem(
          "resqnet_contacts"
        );

      if (savedContacts) {
        const contacts: Contact[] =
          JSON.parse(savedContacts);

        setContactCount(contacts.length);
      } else {
        setContactCount(0);
      }

    } catch (error) {
      console.log(
        "Dashboard data error:",
        error
      );
    }
  };

  // REFRESH DASHBOARD WHEN SCREEN OPENS
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  // GET CURRENT LOCATION
  const getCurrentLocation = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationText(
          "Location permission denied"
        );
        setCoordinates("");
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.Balanced,
        });

      const latitude =
        location.coords.latitude;

      const longitude =
        location.coords.longitude;

      // CONVERT GPS TO ADDRESS
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
          readableAddress ||
            "Address detected"
        );
      } else {
        setLocationText(
          "Address not available"
        );
      }

      setCoordinates(
        `${latitude.toFixed(
          5
        )}, ${longitude.toFixed(5)}`
      );

    } catch (error) {
      console.log(
        "Location error:",
        error
      );

      setLocationText(
        "Unable to get location"
      );

      setCoordinates("");
    }
  };

  // REFRESH LOCATION
  const refreshLocation = async () => {
    setLocationText(
      "Updating location..."
    );

    await getCurrentLocation();
  };

  // INCIDENT ICON
  const getIncidentIcon = (
    type: string
  ) => {
    if (type === "Road Accident")
      return "🚗";

    if (type === "Medical Assistance")
      return "🏥";

    if (type === "Fire Emergency")
      return "🔥";

    if (type === "Police Assistance")
      return "🚓";

    return "🛡️";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              ResQNet
            </Text>

            <Text style={styles.subtitle}>
              Smart Emergency Assistance
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              SAFE
            </Text>
          </View>
        </View>

        {/* WELCOME */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcome}>
            Welcome Back 👋
          </Text>

          <Text style={styles.welcomeSub}>
            Stay prepared. Stay safe.
          </Text>
        </View>

        {/* SOS */}
        <View style={styles.sosCard}>
          <Text style={styles.sosTitle}>
            Need Emergency Help?
          </Text>

          <Text style={styles.sosDescription}>
            Press the SOS button for
            emergency assistance.
          </Text>

          <TouchableOpacity
            style={styles.sosButton}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/emergency")
            }
          >
            <Text style={styles.sosIcon}>
              !
            </Text>

            <Text style={styles.sosText}>
              SOS
            </Text>

            <Text style={styles.sosSmall}>
              EMERGENCY
            </Text>
          </TouchableOpacity>

          <Text style={styles.sosNote}>
            Emergency assistance is
            available from this app.
          </Text>
        </View>

        {/* CURRENT LOCATION */}
        <TouchableOpacity
          style={styles.locationCard}
          activeOpacity={0.8}
          onPress={refreshLocation}
        >
          <View style={styles.locationIcon}>
            <Text style={styles.emoji}>
              📍
            </Text>
          </View>

          <View style={styles.locationInfo}>
            <Text style={styles.cardLabel}>
              CURRENT LOCATION
            </Text>

            <Text style={styles.locationText}>
              {locationText}
            </Text>

            {coordinates !== "" && (
              <Text style={styles.coordinates}>
                {coordinates}
              </Text>
            )}
          </View>

          <Text style={styles.arrow}>
            ↻
          </Text>
        </TouchableOpacity>

        {/* DASHBOARD SUMMARY */}
        <Text style={styles.sectionTitle}>
          Safety Overview
        </Text>

        <View style={styles.statsRow}>

          {/* INCIDENTS */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/incidents")
            }
          >
            <View style={styles.statIcon}>
              <Text style={styles.statEmoji}>
                📝
              </Text>
            </View>

            <Text style={styles.statNumber}>
              {incidentCount
                .toString()
                .padStart(2, "0")}
            </Text>

            <Text style={styles.statLabel}>
              Total Incidents
            </Text>
          </TouchableOpacity>

          {/* CONTACTS */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/contacts")
            }
          >
            <View style={styles.statIcon}>
              <Text style={styles.statEmoji}>
                👥
              </Text>
            </View>

            <Text style={styles.statNumber}>
              {contactCount
                .toString()
                .padStart(2, "0")}
            </Text>

            <Text style={styles.statLabel}>
              Emergency Contacts
            </Text>
          </TouchableOpacity>

        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.grid}>

          {/* EMERGENCY */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push("/emergency")
            }
          >
            <View style={styles.actionIcon}>
              <Text style={styles.emoji}>
                🚨
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              Emergency
            </Text>

            <Text style={styles.actionSub}>
              Get help quickly
            </Text>
          </TouchableOpacity>

          {/* CONTACTS */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push("/contacts")
            }
          >
            <View style={styles.actionIcon}>
              <Text style={styles.emoji}>
                👥
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              Contacts
            </Text>

            <Text style={styles.actionSub}>
              Trusted people
            </Text>
          </TouchableOpacity>

          {/* SERVICES */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push("/emergency")
            }
          >
            <View style={styles.actionIcon}>
              <Text style={styles.emoji}>
                🏥
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              Services
            </Text>

            <Text style={styles.actionSub}>
              Nearby assistance
            </Text>
          </TouchableOpacity>

          {/* REPORT */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              router.push("/incidents")
            }
          >
            <View style={styles.actionIcon}>
              <Text style={styles.emoji}>
                📝
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              Report
            </Text>

            <Text style={styles.actionSub}>
              Record incident
            </Text>
          </TouchableOpacity>

        </View>

        {/* RECENT INCIDENTS */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>
            Recent Incidents
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push("/incidents")
            }
          >
            <Text style={styles.viewAll}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {recentIncidents.length === 0 ? (

          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>
              📋
            </Text>

            <Text style={styles.emptyTitle}>
              No incidents recorded
            </Text>

            <Text style={styles.emptySub}>
              Your reported incidents will
              appear here.
            </Text>
          </View>

        ) : (

          recentIncidents.map(
            (incident) => (
              <TouchableOpacity
                key={incident.id}
                style={styles.recentCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push("/incidents")
                }
              >
                <View
                  style={styles.recentIcon}
                >
                  <Text style={styles.emoji}>
                    {getIncidentIcon(
                      incident.type
                    )}
                  </Text>
                </View>

                <View
                  style={styles.recentInfo}
                >
                  <Text
                    style={
                      styles.recentTitle
                    }
                  >
                    {incident.type}
                  </Text>

                  <Text
                    style={
                      styles.recentLocation
                    }
                  >
                    {incident.location}
                  </Text>

                  <Text
                    style={styles.recentDate}
                  >
                    {incident.date}
                  </Text>
                </View>

                <View
                  style={styles.recordedBadge}
                >
                  <Text
                    style={
                      styles.recordedText
                    }
                  >
                    {incident.status}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )
        )}

        {/* SAFETY STATUS */}
        <Text style={styles.sectionTitle}>
          Safety Status
        </Text>

        <View style={styles.safetyCard}>
          <View>
            <Text style={styles.safetyTitle}>
              Your Safety
            </Text>

            <Text style={styles.safetySub}>
              No active emergency reported
            </Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeText}>
              ACTIVE
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          ResQNet Smart Emergency Assistance
          Platform
        </Text>

      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNav}>

        {/* HOME */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.push("/")
          }
        >
          <Text style={styles.navIcon}>
            ⌂
          </Text>

          <Text style={styles.navActive}>
            Home
          </Text>
        </TouchableOpacity>

        {/* EMERGENCY */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.push("/emergency")
          }
        >
          <Text style={styles.navIcon}>
            🚨
          </Text>

          <Text style={styles.navText}>
            Emergency
          </Text>
        </TouchableOpacity>

        {/* INCIDENTS */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.push("/incidents")
          }
        >
          <Text style={styles.navIcon}>
            📝
          </Text>

          <Text style={styles.navText}>
            Incidents
          </Text>
        </TouchableOpacity>

        {/* PROFILE */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            router.push("/profile")
          }
        >
          <Text style={styles.navIcon}>
            👤
          </Text>

          <Text style={styles.navText}>
            Profile
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

  header: {
    backgroundColor: "#102A43",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    color: "#BFD7EA",
    fontSize: 13,
    marginTop: 3,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#193B59",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#35C759",
    marginRight: 6,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  welcomeSection: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 14,
  },

  welcome: {
    fontSize: 24,
    fontWeight: "800",
    color: "#102A43",
  },

  welcomeSub: {
    fontSize: 14,
    color: "#627D98",
    marginTop: 5,
  },

  sosCard: {
    marginHorizontal: 18,
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    elevation: 4,
  },

  sosTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#102A43",
  },

  sosDescription: {
    color: "#627D98",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },

  sosButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#D92D20",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    elevation: 7,
  },

  sosIcon: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  sosSmall: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  sosNote: {
    color: "#829AB1",
    fontSize: 11,
    marginTop: 14,
    textAlign: "center",
  },

  locationCard: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E8F1F8",
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 20,
  },

  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },

  cardLabel: {
    color: "#829AB1",
    fontSize: 9,
    fontWeight: "800",
  },

  locationText: {
    color: "#243B53",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 3,
  },

  coordinates: {
    color: "#829AB1",
    fontSize: 11,
    marginTop: 3,
  },

  arrow: {
    color: "#627D98",
    fontSize: 25,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#102A43",
    fontSize: 18,
    fontWeight: "800",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
  },

  statCard: {
    width: "46%",
    backgroundColor: "#FFFFFF",
    marginHorizontal: "2%",
    padding: 15,
    borderRadius: 16,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#EEF4F8",
    justifyContent: "center",
    alignItems: "center",
  },

  statEmoji: {
    fontSize: 19,
  },

  statNumber: {
    color: "#102A43",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 9,
  },

  statLabel: {
    color: "#627D98",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },

  actionCard: {
    width: "46%",
    backgroundColor: "#FFFFFF",
    marginHorizontal: "2%",
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF4F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  actionTitle: {
    color: "#102A43",
    fontSize: 15,
    fontWeight: "800",
  },

  actionSub: {
    color: "#829AB1",
    fontSize: 11,
    marginTop: 3,
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },

  viewAll: {
    color: "#102A43",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 20,
  },

  recentCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 14,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  recentIcon: {
    width: 43,
    height: 43,
    borderRadius: 11,
    backgroundColor: "#EEF4F8",
    justifyContent: "center",
    alignItems: "center",
  },

  recentInfo: {
    flex: 1,
    marginLeft: 11,
  },

  recentTitle: {
    color: "#102A43",
    fontSize: 13,
    fontWeight: "800",
  },

  recentLocation: {
    color: "#627D98",
    fontSize: 10,
    marginTop: 3,
  },

  recentDate: {
    color: "#9FB3C8",
    fontSize: 9,
    marginTop: 2,
  },

  recordedBadge: {
    backgroundColor: "#E7F7ED",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
  },

  recordedText: {
    color: "#18864B",
    fontSize: 8,
    fontWeight: "800",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    padding: 22,
    borderRadius: 16,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 28,
  },

  emptyTitle: {
    color: "#102A43",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
  },

  emptySub: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 4,
  },

  safetyCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  safetyTitle: {
    color: "#102A43",
    fontSize: 15,
    fontWeight: "800",
  },

  safetySub: {
    color: "#627D98",
    fontSize: 11,
    marginTop: 4,
  },

  activeBadge: {
    backgroundColor: "#E7F7ED",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },

  activeText: {
    color: "#18864B",
    fontSize: 10,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    color: "#9FB3C8",
    fontSize: 10,
    marginBottom: 25,
    marginTop: 5,
  },

  bottomNav: {
    height: 68,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E6EAF0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 20,
    color: "#627D98",
  },

  navActive: {
    color: "#102A43",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 3,
  },

  navText: {
    color: "#829AB1",
    fontSize: 10,
    marginTop: 3,
  },

});