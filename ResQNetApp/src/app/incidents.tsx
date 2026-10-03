import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Incident = {
  id: string;
  type: string;
  location: string;
  date: string;
  description: string;
  status: 'Recorded' | 'Review';
};

const defaultIncidents: Incident[] = [
  {
    id: '1',
    type: 'Road Accident',
    location: 'Delhi, India',
    date: '22 September 2026',
    description: 'Vehicle-related incident recorded for safety review.',
    status: 'Recorded',
  },
  {
    id: '2',
    type: 'Medical Assistance',
    location: 'Gurugram, India',
    date: '18 September 2026',
    description: 'Medical assistance request saved for review.',
    status: 'Review',
  },
  {
    id: '3',
    type: 'Safety Report',
    location: 'Delhi, India',
    date: '12 September 2026',
    description: 'Personal safety incident recorded in the system.',
    status: 'Recorded',
  },
];

export default function IncidentsScreen() {
  const [incidents, setIncidents] =
    useState<Incident[]>(defaultIncidents);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [incidentType, setIncidentType] =
    useState('Road Accident');

  const [location, setLocation] =
    useState('');

  const [date, setDate] =
    useState('');

  const [description, setDescription] =
    useState('');

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const saved =
        await AsyncStorage.getItem(
          'resqnet_incidents'
        );

      if (saved) {
        setIncidents(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Incident loading error:', error);
    }
  };

  const saveIncidents = async (
    updatedIncidents: Incident[]
  ) => {
    try {
      await AsyncStorage.setItem(
        'resqnet_incidents',
        JSON.stringify(updatedIncidents)
      );
    } catch (error) {
      console.log('Incident saving error:', error);
    }
  };

  const getIcon = (type: string) => {
    if (type === 'Road Accident') return '🚗';
    if (type === 'Medical Assistance') return '🏥';
    if (type === 'Fire Emergency') return '🔥';
    if (type === 'Police Assistance') return '🚓';

    return '🛡️';
  };

  const openNewIncident = () => {
    setIncidentType('Road Accident');
    setLocation('');
    setDate('');
    setDescription('');
    setModalVisible(true);
  };

  const addIncident = async () => {
    if (
      location.trim() === '' ||
      date.trim() === '' ||
      description.trim() === ''
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in location, date and description.'
      );
      return;
    }

    const newIncident: Incident = {
      id: Date.now().toString(),
      type: incidentType,
      location: location.trim(),
      date: date.trim(),
      description: description.trim(),
      status: 'Recorded',
    };

    const updatedIncidents = [
      newIncident,
      ...incidents,
    ];

    setIncidents(updatedIncidents);

    await saveIncidents(updatedIncidents);

    setModalVisible(false);

    Alert.alert(
      'Incident Recorded',
      'Your incident has been successfully saved.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Incident Records
          </Text>

          <Text style={styles.subtitle}>
            View and manage your reported incidents
          </Text>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>
              TOTAL INCIDENTS
            </Text>

            <Text style={styles.summaryNumber}>
              {incidents.length
                .toString()
                .padStart(2, '0')}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              RECORDED
            </Text>
          </View>
        </View>

        {/* SECTION */}
        <Text style={styles.sectionTitle}>
          Recent Incidents
        </Text>

        {/* INCIDENT LIST */}
        {incidents.map((incident) => (
          <TouchableOpacity
            key={incident.id}
            style={styles.incidentCard}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                incident.type,
                `${incident.description}\n\nLocation: ${incident.location}\nDate: ${incident.date}`
              )
            }
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>
                {getIcon(incident.type)}
              </Text>
            </View>

            <View style={styles.incidentInfo}>
              <Text style={styles.incidentTitle}>
                {incident.type}
              </Text>

              <Text style={styles.incidentLocation}>
                {incident.location}
              </Text>

              <Text style={styles.incidentDate}>
                {incident.date}
              </Text>
            </View>

            <View
              style={
                incident.status === 'Review'
                  ? styles.reviewBadge
                  : styles.recordedBadge
              }
            >
              <Text
                style={
                  incident.status === 'Review'
                    ? styles.reviewText
                    : styles.recordedText
                }
              >
                {incident.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={openNewIncident}
        >
          <Text style={styles.addButtonText}>
            + Report New Incident
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          ResQNet Smart Emergency Assistance Platform
        </Text>

      </ScrollView>

      {/* NEW INCIDENT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>
              Report New Incident
            </Text>

            <Text style={styles.modalSubtitle}>
              Enter the incident details below
            </Text>

            {/* TYPE */}
            <Text style={styles.inputLabel}>
              INCIDENT TYPE
            </Text>

            <View style={styles.typeContainer}>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  incidentType === 'Road Accident' &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setIncidentType('Road Accident')
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    incidentType === 'Road Accident' &&
                      styles.typeTextActive,
                  ]}
                >
                  🚗 Accident
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  incidentType ===
                    'Medical Assistance' &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setIncidentType(
                    'Medical Assistance'
                  )
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    incidentType ===
                      'Medical Assistance' &&
                      styles.typeTextActive,
                  ]}
                >
                  🏥 Medical
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  incidentType ===
                    'Fire Emergency' &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setIncidentType(
                    'Fire Emergency'
                  )
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    incidentType ===
                      'Fire Emergency' &&
                      styles.typeTextActive,
                  ]}
                >
                  🔥 Fire
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  incidentType ===
                    'Police Assistance' &&
                    styles.typeButtonActive,
                ]}
                onPress={() =>
                  setIncidentType(
                    'Police Assistance'
                  )
                }
              >
                <Text
                  style={[
                    styles.typeText,
                    incidentType ===
                      'Police Assistance' &&
                      styles.typeTextActive,
                  ]}
                >
                  🚓 Police
                </Text>
              </TouchableOpacity>

            </View>

            {/* LOCATION */}
            <Text style={styles.inputLabel}>
              LOCATION
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter incident location"
              placeholderTextColor="#9FB3C8"
              value={location}
              onChangeText={setLocation}
            />

            {/* DATE */}
            <Text style={styles.inputLabel}>
              DATE
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 27 September 2026"
              placeholderTextColor="#9FB3C8"
              value={date}
              onChangeText={setDate}
            />

            {/* DESCRIPTION */}
            <Text style={styles.inputLabel}>
              DESCRIPTION
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
              placeholder="Describe the incident"
              placeholderTextColor="#9FB3C8"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            {/* SAVE */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={addIncident}
            >
              <Text style={styles.saveButtonText}>
                Save Incident
              </Text>
            </TouchableOpacity>

            {/* CANCEL */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setModalVisible(false)
              }
            >
              <Text style={styles.cancelButtonText}>
                Cancel
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

  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: 18,
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    color: '#829AB1',
    fontSize: 10,
    fontWeight: '800',
  },

  summaryNumber: {
    color: '#102A43',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 3,
  },

  statusBadge: {
    backgroundColor: '#E7F7ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  statusText: {
    color: '#18864B',
    fontSize: 10,
    fontWeight: '800',
  },

  sectionTitle: {
    color: '#102A43',
    fontSize: 19,
    fontWeight: '800',
    marginHorizontal: 20,
    marginBottom: 12,
  },

  incidentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EEF4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 22,
  },

  incidentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  incidentTitle: {
    color: '#102A43',
    fontSize: 14,
    fontWeight: '800',
  },

  incidentLocation: {
    color: '#627D98',
    fontSize: 11,
    marginTop: 3,
  },

  incidentDate: {
    color: '#9FB3C8',
    fontSize: 10,
    marginTop: 2,
  },

  recordedBadge: {
    backgroundColor: '#E7F7ED',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
  },

  recordedText: {
    color: '#18864B',
    fontSize: 9,
    fontWeight: '800',
  },

  reviewBadge: {
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 9,
  },

  reviewText: {
    color: '#B76E00',
    fontSize: 9,
    fontWeight: '800',
  },

  addButton: {
    backgroundColor: '#102A43',
    marginHorizontal: 18,
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  footer: {
    textAlign: 'center',
    color: '#9FB3C8',
    fontSize: 10,
    marginTop: 25,
    marginBottom: 30,
  },

  /* MODAL */

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
    paddingBottom: 28,
    maxHeight: '92%',
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
    marginBottom: 17,
  },

  inputLabel: {
    color: '#829AB1',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 5,
    marginBottom: 7,
  },

  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 7,
  },

  typeButton: {
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EAF0',
  },

  typeButtonActive: {
    backgroundColor: '#102A43',
    borderColor: '#102A43',
  },

  typeText: {
    color: '#486581',
    fontSize: 10,
    fontWeight: '700',
  },

  typeTextActive: {
    color: '#FFFFFF',
  },

  input: {
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 13,
    color: '#243B53',
    fontSize: 13,
    marginBottom: 8,
  },

  descriptionInput: {
    height: 75,
    paddingTop: 12,
  },

  saveButton: {
    backgroundColor: '#102A43',
    height: 48,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  cancelButton: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  cancelButtonText: {
    color: '#627D98',
    fontSize: 13,
    fontWeight: '700',
  },
});