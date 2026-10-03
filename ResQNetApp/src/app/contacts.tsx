import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "resqnet_contacts";

export default function ContactsScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [contacts, setContacts] = useState([
    {
      name: "Emergency Contact",
      phone: "+91 98765 43210",
      relation: "Family",
    },
  ]);

  // LOAD SAVED CONTACTS
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const savedContacts = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }
    } catch (error) {
      console.log("Error loading contacts:", error);
    }
  };

  // SAVE CONTACTS
  const saveContacts = async (updatedContacts: any[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedContacts)
      );
    } catch (error) {
      console.log("Error saving contacts:", error);
    }
  };

  // ADD CONTACT
  const addContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter name and phone number."
      );
      return;
    }

    const newContact = {
      name: name.trim(),
      phone: phone.trim(),
      relation: "Emergency Contact",
    };

    const updatedContacts = [...contacts, newContact];

    setContacts(updatedContacts);
    await saveContacts(updatedContacts);

    setName("");
    setPhone("");

    Alert.alert(
      "Success",
      "Emergency contact saved successfully."
    );
  };

  // CALL CONTACT
  const callContact = async (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);

      if (supported) {
        await Linking.openURL(phoneUrl);
      } else {
        Alert.alert(
          "Unable to Call",
          "Phone calling is not available on this device."
        );
      }
    } catch (error) {
      Alert.alert(
        "Call Error",
        "Unable to open the phone dialer."
      );
    }
  };

  // DELETE CONTACT
  const deleteContact = async (index: number) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to remove this contact?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedContacts = contacts.filter(
              (_, i) => i !== index
            );

            setContacts(updatedContacts);
            await saveContacts(updatedContacts);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>ResQNet</Text>

        <Text style={styles.title}>
          Emergency Contacts
        </Text>

        <Text style={styles.subtitle}>
          Manage your trusted emergency contacts
        </Text>
      </View>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Trusted Contacts
        </Text>

        <Text style={styles.infoText}>
          These contacts can be used when emergency assistance
          is required.
        </Text>
      </View>

      {/* SAVED CONTACTS */}
      <Text style={styles.sectionTitle}>
        Saved Contacts
      </Text>

      {contacts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>👤</Text>

          <Text style={styles.emptyTitle}>
            No Emergency Contacts
          </Text>

          <Text style={styles.emptyText}>
            Add a trusted person below.
          </Text>
        </View>
      ) : (
        contacts.map((contact, index) => (
          <View
            style={styles.contactCard}
            key={index}
          >

            {/* AVATAR */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {contact.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            {/* CONTACT INFO */}
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>
                {contact.name}
              </Text>

              <Text style={styles.relation}>
                {contact.relation}
              </Text>

              <Text style={styles.phone}>
                {contact.phone}
              </Text>
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonContainer}>

              {/* CALL */}
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => callContact(contact.phone)}
              >
                <Text style={styles.callText}>
                  Call
                </Text>
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteContact(index)}
              >
                <Text style={styles.deleteText}>
                  Delete
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        ))
      )}

      {/* ADD NEW CONTACT */}
      <Text style={styles.sectionTitle}>
        Add New Contact
      </Text>

      <View style={styles.formCard}>

        <Text style={styles.label}>
          Contact Name
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter contact name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addContact}
        >
          <Text style={styles.addButtonText}>
            + Add Emergency Contact
          </Text>
        </TouchableOpacity>

      </View>

      {/* STORAGE INFO */}
      <View style={styles.storageCard}>
        <Text style={styles.storageTitle}>
          ✓ Contacts Saved Locally
        </Text>

        <Text style={styles.storageText}>
          Your emergency contacts remain saved even after
          closing and reopening the app.
        </Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>
          ResQNet
        </Text>

        <Text style={styles.footerText}>
          Smart Emergency Assistance Platform
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 55,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  logo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D92323",
    marginBottom: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#172033",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },

  infoCard: {
    backgroundColor: "#FFF1F1",
    margin: 18,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFD6D6",
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#B91C1C",
  },

  infoText: {
    marginTop: 6,
    color: "#6B4B4B",
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#172033",
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 12,
  },

  contactCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D92323",
  },

  contactInfo: {
    flex: 1,
    marginLeft: 14,
  },

  contactName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172033",
  },

  relation: {
    fontSize: 12,
    color: "#D92323",
    marginTop: 2,
  },

  phone: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  buttonContainer: {
    alignItems: "flex-end",
    gap: 6,
  },

  callButton: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9,
  },

  callText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  deleteButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
  },

  deleteText: {
    color: "#B91C1C",
    fontSize: 11,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 32,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#172033",
    marginTop: 8,
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: "#172033",
    backgroundColor: "#FAFAFA",
  },

  addButton: {
    backgroundColor: "#D92323",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  storageCard: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: "#ECFDF3",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  storageTitle: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "800",
  },

  storageText: {
    color: "#166534",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 35,
  },

  footerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#D92323",
  },

  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});