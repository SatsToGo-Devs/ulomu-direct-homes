import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  info: {
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    padding: 5,
  },
  tableCell: {
    flex: 1,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
  },
});

export default function InvoicePDF({ invoice }: { invoice: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text>{invoice.invoiceNumber}</Text>
        </View>

        <View style={styles.info}>
          <Text>Property: {invoice.unit.property.name}</Text>
          <Text>Address: {invoice.unit.property.address}</Text>
          <Text>Unit: {invoice.unit.unitNumber}</Text>
          <Text>Tenant: {invoice.tenant.name}</Text>
          <Text>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
          {invoice.items.map((item: any) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>${item.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <Text>Total Amount: ${invoice.amount}</Text>
        </View>
      </Page>
    </Document>
  );
}