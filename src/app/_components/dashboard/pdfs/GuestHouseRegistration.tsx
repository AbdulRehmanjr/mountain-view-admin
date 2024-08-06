"use client";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

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

const guestData = {
  name: "John Doe",
  dob: "1990-01-01",
  bookingSource: "Online",
  email: "john@example.com",
  phone: "+1234567890",
  address: "123 Main St",
  postalCode: "12345",
  city: "Anytown",
  country: "USA",
  nationality: "American",
  passportNumber: "AB1234567",
  passportExpiry: "2025-12-31",
  arrivalDate: "2023-08-01",
  departureDate: "2023-08-05",
  totalNights: "4",
  roomCategory: "Deluxe",
  roomNumber: "301",
};

const hotelInfo = {
  name: "Mountain View Hotel",
  address: "456 Mountain Road, Scenic City, 67890",
  phone: "+1 (234) 567-8901",
};

export const GuestRegistrationPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>
          {String(hotelInfo.name).toUpperCase()}
        </Text>
        <Text>{hotelInfo.address}</Text>
        <Text>{hotelInfo.phone}</Text>
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
            <Text style={styles.value}>{guestData.name}</Text>
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
            <Text style={styles.value}>52200</Text>
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
            <Text style={styles.value}>abdulrehman2020white@gmail.com</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>+92 3301486671</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>Ghakhar mandi, Gt road</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>Ghakhar mandi</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.value}>Pakistan</Text>
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
            <Text style={styles.value}>20-02-2023</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total nights:</Text>
            <Text style={styles.value}>5</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Booking source:</Text>
            <Text style={styles.value}>manual</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Meal plan:</Text>
            <Text style={styles.value}>{guestData.email}</Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Date of departure:</Text>
            <Text style={styles.value}>20-04-2025</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Room Category:</Text>
            <Text style={styles.value}>Deluxe</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Room no.:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Additional information:</Text>
            <Text style={styles.value}>Nothing</Text>
          </View>
        </View>
      </View>
      <View style={styles.columns}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}>Total amount:</Text>
            <Text style={styles.value}>1000</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment status:</Text>
            <Text style={styles.value}>Paid</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.label}> Environment levy:</Text>
            <Text style={styles.value}>1000</Text>
          </View>
        </View>
      </View>

      <View style={styles.signature}>
        <Text style={styles.signatureText}>
          By signing below you agree to all of the terms and conditions of{" "}
          {hotelInfo.name}. Please consult our team at the front desk or our
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
              <Text style={styles.value}></Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
