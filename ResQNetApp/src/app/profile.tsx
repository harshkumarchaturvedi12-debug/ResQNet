import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [modal, setModal] = useState<
    'account' | 'notifications' | 'safety' | 'about' | null
  >(null);

  const [phone, setPhone] = useState('');
  const [phoneInput, setPhoneInput] = useState('');

  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [sosConfirmation, setSosConfirmation] = useState(true);

  useEffect(() => {
    loadPhone();
  }, []);

  const loadPhone = async () => {
    try {
      const savedPhone = await AsyncStorage.getItem(
        'resqnet_user_phone'
      );

      if (savedPhone) {
        setPhone(savedPhone);
      }
    } catch (error) {
      console.log('Phone loading error:', error);
    }
  };

  const openAccount = () => {
    setPhoneInput(phone);
    setModal('account');
  };

  const savePhone = async () => {
    const cleanedPhone = phoneInput.trim();

    if (cleanedPhone.length < 10) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid phone number.'
      );
      return;
    }

    try {
      await AsyncStorage.setItem(
        'resqnet_user_phone',
        cleanedPhone
      );

      setPhone(cleanedPhone);
      setModal(null);

      Alert.alert(
        'Phone Number Saved',
        'Your phone number has been updated successfully.'
      );
    } catch (error) {
      console.log('Phone saving error:', error);
      Alert.alert(
        'Error',
        'Unable to save phone number.'
      );
    }
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>

          <Text style={styles.subtitle}>
            Manage your ResQNet profile
          </Text>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              ResQNet User
            </Text>

            <Text style={styles.email}>
              user@resqnet.com
            </Text>

            <Text style={styles.location}>
              📍 Delhi, India
            </Text>
          </View>
        </View>

        {/* PROFILE STATUS */}
        <View style={styles.completionCard}>
          <View>
            <Text style={styles.completionTitle}>
              Profile Completion
            </Text>

            <Text style={styles.completionSub}>
              Your profile is complete
            </Text>
          </View>

          <Text style={styles.percentage}>
            100%
          </Text>
        </View>

        {/* ACCOUNT */}
        <Text style={styles.sectionTitle}>
          Account Information
        </Text>

        <TouchableOpacity
          style={styles.infoCard}
          activeOpacity={0.8}
          onPress={openAccount}
        >
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>
              📧
            </Text>

            <View style={styles.infoContent}>
              <Text style={styles.label}>
                EMAIL
              </Text>

              <Text style={styles.value}>
                user@resqnet.com
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>
              📱
            </Text>

            <View style={styles.infoContent}>
              <Text style={styles.label}>
                PHONE
              </Text>

              <Text style={styles.value}>
                {phone || 'Not Added'}
              </Text>
            </View>

            <Text style={styles.editText}>
              {phone ? 'Edit' : 'Add'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>
              📍
            </Text>

            <View style={styles.infoContent}>
              <Text style={styles.label}>
                LOCATION
              </Text>

              <Text style={styles.value}>
                Delhi, India
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* SETTINGS */}
        <Text style={styles.sectionTitle}>
          Settings
        </Text>

        {/* NOTIFICATIONS */}
        <TouchableOpacity
          style={styles.settingCard}
          activeOpacity={0.8}
          onPress={() => setModal('notifications')}
        >
          <Text style={styles.settingIcon}>
            🔔
          </Text>

          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>
              Notifications
            </Text>

            <Text style={styles.settingSub}>
              Emergency and safety alerts
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>

        {/* SAFETY */}
        <TouchableOpacity
          style={styles.settingCard}
          activeOpacity={0.8}
          onPress={() => setModal('safety')}
        >
          <Text style={styles.settingIcon}>
            🛡️
          </Text>

          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>
              Safety Preferences
            </Text>

            <Text style={styles.settingSub}>
              Manage safety settings
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>

        {/* ABOUT */}
        <TouchableOpacity
          style={styles.settingCard}
          activeOpacity={0.8}
          onPress={() => setModal('about')}
        >
          <Text style={styles.settingIcon}>
            ℹ️
          </Text>

          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>
              About ResQNet
            </Text>

            <Text style={styles.settingSub}>
              Smart Emergency Assistance Platform
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          ResQNet Smart Emergency Assistance Platform
        </Text>

      </ScrollView>

      {/* ACCOUNT MODAL */}
      <Modal
        visible={modal === 'account'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Account Information
            </Text>

            <Text style={styles.modalSubtitle}>
              Manage your account details
            </Text>

            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>
                EMAIL
              </Text>

              <Text style={styles.detailValue}>
                user@resqnet.com
              </Text>
            </View>

            <Text style={styles.inputLabel}>
              PHONE NUMBER
            </Text>

            <TextInput
              style={styles.phoneInput}
              value={phoneInput}
              onChangeText={setPhoneInput}
              placeholder="Enter phone number"
              placeholderTextColor="#9FB3C8"
              keyboardType="phone-pad"
              maxLength={15}
            />

            <View style={styles.detailBox}>
              <Text style={styles.detailLabel}>
                LOCATION
              </Text>

              <Text style={styles.detailValue}>
                Delhi, India
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={savePhone}
            >
              <Text style={styles.closeButtonText}>
                Save Phone Number
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeModal}
            >
              <Text style={styles.cancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* NOTIFICATION MODAL */}
      <Modal
        visible={modal === 'notifications'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Notifications
            </Text>

            <Text style={styles.modalSubtitle}>
              Control emergency and safety alerts
            </Text>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  Safety Notifications
                </Text>

                <Text style={styles.optionSub}>
                  Receive important safety alerts
                </Text>
              </View>

              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  Emergency Alerts
                </Text>

                <Text style={styles.optionSub}>
                  Important emergency updates
                </Text>
              </View>

              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>
                Save & Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* SAFETY MODAL */}
      <Modal
        visible={modal === 'safety'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Safety Preferences
            </Text>

            <Text style={styles.modalSubtitle}>
              Configure your emergency assistance preferences
            </Text>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  Location Access
                </Text>

                <Text style={styles.optionSub}>
                  Use location for emergency assistance
                </Text>
              </View>

              <Switch
                value={locationAccess}
                onValueChange={setLocationAccess}
              />
            </View>

            <View style={styles.optionRow}>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  SOS Confirmation
                </Text>

                <Text style={styles.optionSub}>
                  Ask before activating SOS
                </Text>
              </View>

              <Switch
                value={sosConfirmation}
                onValueChange={setSosConfirmation}
              />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>
                Save & Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* ABOUT MODAL */}
      <Modal
        visible={modal === 'about'}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <View style={styles.aboutLogo}>
              <Text style={styles.aboutLogoText}>
                R
              </Text>
            </View>

            <Text style={styles.modalTitle}>
              ResQNet
            </Text>

            <Text style={styles.modalSubtitle}>
              Smart Emergency Assistance Platform
            </Text>

            <Text style={styles.aboutText}>
              ResQNet is a mobile emergency assistance
              platform designed to help users manage
              emergency contacts, location information,
              incident records and emergency assistance
              features from one application.
            </Text>

            <View style={styles.versionBox}>
              <Text style={styles.versionLabel}>
                APPLICATION
              </Text>

              <Text style={styles.versionValue}>
                ResQNet Mobile
              </Text>

              <Text style={styles.versionLabel}>
                VERSION
              </Text>

              <Text style={styles.versionValue}>
                1.0.0
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>
                Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },

  header: {
    backgroundColor: '#102A43',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 25,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
  },

  subtitle: {
    color: '#BFD7EA',
    fontSize: 13,
    marginTop: 5,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 18,
    padding: 18,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#102A43',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },

  profileInfo: {
    marginLeft: 15,
  },

  name: {
    color: '#102A43',
    fontSize: 19,
    fontWeight: '800',
  },

  email: {
    color: '#627D98',
    fontSize: 12,
    marginTop: 3,
  },

  location: {
    color: '#829AB1',
    fontSize: 11,
    marginTop: 5,
  },

  completionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    padding: 17,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  completionTitle: {
    color: '#102A43',
    fontSize: 14,
    fontWeight: '800',
  },

  completionSub: {
    color: '#829AB1',
    fontSize: 10,
    marginTop: 4,
  },

  percentage: {
    color: '#18864B',
    fontSize: 20,
    fontWeight: '900',
  },

  sectionTitle: {
    color: '#102A43',
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  infoIcon: {
    fontSize: 20,
    width: 35,
  },

  infoContent: {
    flex: 1,
  },

  label: {
    color: '#829AB1',
    fontSize: 9,
    fontWeight: '800',
  },

  value: {
    color: '#243B53',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },

  editText: {
    color: '#102A43',
    fontSize: 11,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#E6EAF0',
  },

  settingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingIcon: {
    fontSize: 21,
    width: 38,
  },

  settingInfo: {
    flex: 1,
  },

  settingTitle: {
    color: '#102A43',
    fontSize: 14,
    fontWeight: '800',
  },

  settingSub: {
    color: '#829AB1',
    fontSize: 10,
    marginTop: 3,
  },

  arrow: {
    color: '#829AB1',
    fontSize: 26,
  },

  footer: {
    textAlign: 'center',
    color: '#9FB3C8',
    fontSize: 10,
    marginTop: 20,
    marginBottom: 30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 22,
    paddingBottom: 30,
  },

  modalTitle: {
    color: '#102A43',
    fontSize: 22,
    fontWeight: '800',
  },

  modalSubtitle: {
    color: '#829AB1',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 18,
  },

  detailBox: {
    backgroundColor: '#F4F7FB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  detailLabel: {
    color: '#829AB1',
    fontSize: 9,
    fontWeight: '800',
  },

  detailValue: {
    color: '#243B53',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },

  inputLabel: {
    color: '#829AB1',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 4,
    marginBottom: 7,
  },

  phoneInput: {
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    color: '#243B53',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },

  optionRow: {
    backgroundColor: '#F4F7FB',
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionInfo: {
    flex: 1,
    paddingRight: 10,
  },

  optionTitle: {
    color: '#102A43',
    fontSize: 14,
    fontWeight: '800',
  },

  optionSub: {
    color: '#829AB1',
    fontSize: 10,
    marginTop: 4,
    lineHeight: 15,
  },

  closeButton: {
    backgroundColor: '#102A43',
    height: 48,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  cancelButton: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  cancelButtonText: {
    color: '#627D98',
    fontSize: 13,
    fontWeight: '700',
  },

  aboutLogo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#102A43',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  aboutLogoText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
  },

  aboutText: {
    color: '#486581',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 15,
  },

  versionBox: {
    backgroundColor: '#F4F7FB',
    padding: 15,
    borderRadius: 13,
    marginBottom: 10,
  },

  versionLabel: {
    color: '#829AB1',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 3,
  },

  versionValue: {
    color: '#243B53',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
    marginBottom: 7,
  },
});