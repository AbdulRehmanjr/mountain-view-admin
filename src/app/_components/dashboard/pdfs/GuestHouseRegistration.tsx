
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

// Register a custom font (you'd need to provide the actual font file)
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Roboto",
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontSize: "12px",
    fontFamily: "Roboto",
  },
  headerTitle: {
    fontWeight: "bold",
  },
  logo: {
    width: 125,
    height: 125,
    border: "none",
    borderRadius: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 5,
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: 10,
  },
  column: {
    width: "48%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 2,
  },
  label: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },
  value: {
    width: "60%",
    fontSize: 12,
    borderBottom: "1 solid #888",
  },
  signature: {
    marginTop: 30,
  },
  signatureText: {
    fontSize: 10,
    marginBottom: 10,
  },
});

type PdfProps = {
  bookingDetail: BookingDetailProps;
};

export const GuestRegistrationPDF = ({ bookingDetail }: PdfProps) => (
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GUEST REGISTRATION FORM</Text>
      </View>

      <View style={styles.columns}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Full name:</Text>
            <Text style={styles.value}>{bookingDetail.bookingDetails.fullName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date of birth:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Sharing room with:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Post code</Text>
            <Text style={styles.value}>{bookingDetail.bookingDetails.postalCode}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Nationality:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Passort expiry:</Text>
            <Text style={styles.value}></Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{bookingDetail.bookingDetails.email}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{bookingDetail.bookingDetails.phone}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{bookingDetail.bookingDetails.address}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{bookingDetail.bookingDetails.city}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>{bookingDetail.bookingDetails.country}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Passort nr:</Text>
            <Text style={styles.value}></Text>
          </View>
        </View>
      </View>

      <View style={styles.columns}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Date of arrival:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total nights:</Text>
            <Text style={styles.value}>{dayjs(bookingDetail.endDate).diff(dayjs(bookingDetail.startDate),'day')}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Booking source:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Meal plan:</Text>
            <Text style={styles.value}></Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Date of departure:</Text>
            <Text style={styles.value}>{dayjs(bookingDetail.endDate).format('DD-MM-YYYY')}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Room Category:</Text>
            <Text style={styles.value}>{bookingDetail.Room.roomType}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Room no.:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Additional information:</Text>
            <Text style={styles.value}></Text>
          </View>
        </View>
      </View>
      <View style={styles.columns}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Total amount:</Text>
            <Text style={styles.value}>{bookingDetail.price} €</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment status:</Text>
            <Text style={styles.value}>{bookingDetail.type}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Environment levy:</Text>
            <Text style={styles.value}>150 €</Text>
          </View>
        </View>
      </View>

      <View style={styles.signature}>
        <Text style={styles.signatureText}>
          By signing below you agree to all of the terms and conditions of{" "}
          {bookingDetail.Room.hotel.hotelName}. Please consult our team at the front desk or our
          website for the full terms and conditions.
        </Text>
        <View style={styles.columns}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>Guest signature:</Text>
              <Text style={styles.value}></Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{dayjs(new Date).format('DD-MM-YYYY')}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
