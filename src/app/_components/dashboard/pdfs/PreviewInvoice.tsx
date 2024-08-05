"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { BookingInvoicePDF } from "./BookingDetail";
import { api } from "~/trpc/react";

export const BookingInvoicePDFViewer = () => {
  const data = api.booking.getBookingDwtailwithId.useQuery();
  if (!data.data) return <></>;
  return (
    <PDFViewer width="100%" height={900}>
      <BookingInvoicePDF bookingDetail={data.data} />
    </PDFViewer>
  );
};
