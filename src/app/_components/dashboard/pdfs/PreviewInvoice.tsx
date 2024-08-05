'use client'
import { PDFViewer } from "@react-pdf/renderer";
import { BookingInvoicePDF } from "./BookingDetail";


export const BookingInvoicePDFViewer = ({
  bookingDetail,
}: {
  bookingDetail: BookingDetailProps ;
}) => (
  <PDFViewer width="100%" height="100%">
    <BookingInvoicePDF bookingDetail={bookingDetail} />
  </PDFViewer>
);
