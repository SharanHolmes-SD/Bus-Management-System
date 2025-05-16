import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '1pt solid #e5e7eb'
  },
  title: {
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 5,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9fafb',
    borderRadius: 5
  },
  sectionTitle: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 5,
    borderBottom: '1pt solid #e5e7eb'
  },
  label: {
    width: '40%',
    fontSize: 12,
    color: '#4b5563',
    fontWeight: 'bold'
  },
  value: {
    width: '60%',
    fontSize: 12,
    color: '#1f2937'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280'
  }
});

const UserReport = ({ userData }) => {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>User Details Report</Text>
          <Text style={styles.subtitle}>Generated on {currentDate}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{userData.firstName} {userData.lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userData.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{userData.type}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Account Type:</Text>
            <Text style={styles.value}>{userData.type === 'admin' ? 'Administrator' : 'Passenger'}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          © {new Date().getFullYear()} Bus Management System - All rights reserved
        </Text>
      </Page>
    </Document>
  );
};

export default UserReport; 