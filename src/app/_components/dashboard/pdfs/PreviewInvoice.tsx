"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { BookingInvoicePDF } from "./BookingDetail";
import { GuestRegistrationPDF } from "./GuestHouseRegistration";


export const PdfPreview = () => {

  return (
    <PDFViewer width="100%" height={900}>
      <GuestRegistrationPDF/>
    </PDFViewer>
  );
};
