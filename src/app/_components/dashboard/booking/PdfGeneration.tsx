/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
  },
});

// BookingPDF component
export const BookingPDF = () => {
  const booking = {
    invoiceNumber: "INV-2024-001",
    date: "2024-03-22",
    guestName: "John Doe",
    guestAddress: "123 Traveler's Lane, Cityville, Country",
    guestEmail: "john.doe@example.com",
    items: [
      {
        description: "Deluxe Room",
        quantity: 3,
        total: 450,
      },
      {
        description: "Breakfast",
        quantity: 6,
        total: 90,
      },
      {
        description: "Airport Transfer",
        quantity: 1,
        total: 50,
      },
    ],
    subtotal: 590,
    taxRate: 10,
    taxAmount: 59,
    environmentalLevy: 20,
    totalAmount: 669,
    guesthouseName: "Seaside Retreat Guesthouse",
    guesthouseAddress: "456 Ocean View Road, Beachtown, Tropical Island",
    guesthouseContacts:
      "Phone: +1 234 567 8900 | Email: info@seasideretreat.com",
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src="https://res.cloudinary.com/dbjiys9se/image/upload/v1719417158/pak-biz/hpvfxprcuuezswu1gfnq.jpg" />
          <Text style={styles.title}>INVOICE</Text>
        </View>

        <View style={styles.section}>
          <Text>INVOICE NO: #{booking.invoiceNumber}</Text>
          <Text>{new Date(booking.date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text>ISSUED TO:</Text>
          <Text>{booking.guestName}</Text>
          <Text>{booking.guestAddress}</Text>
          <Text>{booking.guestEmail}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>POS.</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>DESCRIPTION</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>QTY</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>TOTAL</Text>
            </View>
          </View>
          {booking.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{index + 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.total} €</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>Subtotal: {booking.subtotal} €</Text>
          <Text>
            Tax ({booking.taxRate}%): {booking.taxAmount} €
          </Text>
          <Text>Environmental Levy: {booking.environmentalLevy} scr</Text>
          <Text>Total amount: {booking.totalAmount} €</Text>
        </View>

        <View style={styles.footer}>
          <Text>THANK YOU FOR STAYING WITH US!</Text>
          <Text>
            WE WISH A PLEASANT JOURNEY AND HOPE TO WELCOME YOU BACK SOON.
          </Text>
          <Text>{booking.guesthouseName}</Text>
          <Text>{booking.guesthouseAddress}</Text>
          <Text>{booking.guesthouseContacts}</Text>
        </View>
      </Page>
    </Document>
  );
};
