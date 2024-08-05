import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

// Register custom fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  header_info: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontSize: "12px",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Roboto",
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
  },
  invoiceBox: {
      display:'flex',
      flexDirection:'column',
      fontSize: 12,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
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
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-end',
    width:'100%'
  },
});

type PdfProps = {
  bookingDetail: BookingDetailProps;
};
export const BookingInvoicePDF = ({ bookingDetail }: PdfProps) => {
  const taxRate = 10; // Assuming 10% tax rate
  const taxAmount = 2000 * (taxRate / 100);
  const environmentalLevy = 5; // Assuming 5 SCR environmental levy
  const totalAmount = 2000 + taxAmount + environmentalLevy;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header_info}>
          <Text style={{ fontWeight: "bold" }}>PAMINA MOUNTAIN VIEW</Text>
          <Text>Schyeleles</Text>
          <Text>+ 345 343 523 2</Text>
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
            <Text style={styles.text}>{bookingDetail.bookingDetails.fullName} {bookingDetail.bookingDetails.surName}</Text>
            <Text style={styles.text}>{bookingDetail.bookingDetails.address}</Text>
            <Text style={styles.text}>{bookingDetail.bookingDetails.email}</Text>
          </View>
          <View style={styles.invoiceBox}>
            <View>
              <Text style={styles.bold}>INVOICE NO: </Text>
              <Text style={styles.text}>{bookingDetail.PayPalBoookingInfo.paymentId}</Text>
            </View>
            <Text style={styles.text}>{dayjs(new Date()).format('DD.MM.YYYY')}</Text>
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
              <Text style={styles.tableCell}>{bookingDetail.Room.roomType}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>3</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{bookingDetail.price} €</Text>
            </View>
          </View>
        </View>

        <View style={styles.totals}>
          <Text style={[styles.text, styles.bold]}>
            Total amount: {totalAmount.toFixed(2)} €
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.bold}>THANK YOU FOR STAYING WITH US!</Text>
          <Text>
            WE WISH A PLEASANT JOURNEY AND HOPE TO WELCOME YOU BACK SOON.
          </Text>
          <Text>Pam</Text>
          <Text>schyeleles</Text>
          <Text>_93126 213621 2</Text>
        </View>
      </Page>
    </Document>
  );
};
