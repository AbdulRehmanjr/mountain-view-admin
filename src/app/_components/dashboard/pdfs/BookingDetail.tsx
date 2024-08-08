import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

const styles = StyleSheet.create({
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontSize: "12px",
    fontFamily: "Helvetica",
  },
  headerTitle: {
    fontWeight: 'bold',
    fontFamily: "Times-Roman",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 125,
    height: 125,
    border: "none",
    borderRadius: "50%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Times-Roman",
  },
  invoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  issuedTo: {
    fontSize: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    fontFamily: "Times-Roman",
  },
  invoiceBox: {
    display: "flex",
    flexDirection: "column",
    fontSize: 12,
  },
  table: {
    display: "flex",
    width: "auto",
    border: "none",
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
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
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "left",
    fontSize: 10,
    color: "#666",
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
  },
  bold: {
    fontWeight: "bold",
  },
  totals: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  totalSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    border: "none",
    marginVertical: 15,
    borderTop: 2,
    borderBottom: 2,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  totalTitle: {
    fontSize: 13,
    marginBottom: 3,
    fontWeight: "bold",
    fontFamily: "Times-Roman",
  },
  taxSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
  },
  taxRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  taxLabel: {
    fontSize: 10,
    textAlign: "left",
  },
  taxValue: {
    fontSize: 10,
    textAlign: "right",
  },
});

type PdfProps = {
  bookingDetail: BookingDetailProps;
};

export const BookingInvoicePDF = ({ bookingDetail }: PdfProps) => {
  const taxRate = 10; 
  const taxAmount = bookingDetail.price * (taxRate / 100);
  const environmentalLevy = 5; 
  const totalAmount = bookingDetail.price + taxAmount + environmentalLevy;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {String(bookingDetail.Room.hotel.hotelName).toUpperCase()}
          </Text>
          <Text>{bookingDetail.Room.hotel.island}</Text>
          <Text>{bookingDetail.Room.hotel.phone}</Text>
        </View>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            style={styles.logo}
            src="https://res.cloudinary.com/dbjiys9se/image/upload/v1719417158/pak-biz/hpvfxprcuuezswu1gfnq.jpg"
          />
        </View>
        <View style={styles.invoiceRow}>
          <View style={styles.issuedTo}>
            <Text style={styles.sectionTitle}>ISSUED TO:</Text>
            <Text style={styles.text}>
              {bookingDetail.bookingDetails.fullName}{" "}
              {bookingDetail.bookingDetails.surName}
            </Text>
            <Text style={styles.text}>
              {bookingDetail.bookingDetails.address}
            </Text>
            <Text style={styles.text}>
              {bookingDetail.bookingDetails.email}
            </Text>
          </View>
          <View style={styles.invoiceBox}>
            <View>
              <Text style={styles.bold}>INVOICE NO: </Text>
              <Text style={styles.text}>
                {bookingDetail.PayPalBoookingInfo.paymentId}
              </Text>
            </View>
            <Text style={styles.text}>
              {dayjs(new Date()).format("DD.MM.YYYY")}
            </Text>
          </View>
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
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>1.</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {bookingDetail.Room.roomType}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{bookingDetail.bookingDetails.quantity}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{bookingDetail.price} €</Text>
            </View>
          </View>
          <View style={styles.totalSection}>
            <Text style={styles.totalTitle}>TOTAL</Text>
            <Text style={styles.totalTitle}>{totalAmount.toFixed(2)} €</Text>
          </View>
        </View>

        <View style={styles.taxSection}>
          <View style={styles.taxRow}>
            <Text style={styles.taxLabel}>Subtotal:</Text>
            <Text style={styles.taxValue}>{bookingDetail.price} €</Text>
          </View>
          <View style={styles.taxRow}>
            <Text style={styles.taxLabel}>Tax ({taxRate}%):</Text>
            <Text style={styles.taxValue}>{taxAmount.toFixed(2)} €</Text>
          </View>
          <View style={styles.taxRow}>
            <Text style={styles.taxLabel}>Environmental Levy:</Text>
            <Text style={styles.taxValue}>{environmentalLevy} scr</Text>
          </View>
          <View style={styles.taxRow}>
            <Text style={[styles.taxLabel, styles.bold]}>Total amount:</Text>
            <Text style={[styles.taxValue, styles.bold]}>
              {totalAmount.toFixed(2)} €
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.bold}>THANK YOU FOR STAYING WITH US!</Text>
          <Text>
            WE WISH A PLEASANT JOURNEY AND HOPE TO WELCOME YOU BACK SOON.
          </Text>
          <Text>
            {String(bookingDetail.Room.hotel.hotelName).toUpperCase()}
          </Text>
          <Text>{bookingDetail.Room.hotel.island}</Text>
          <Text>{bookingDetail.Room.hotel.phone}</Text>
        </View>
      </Page>
    </Document>
  );
};
