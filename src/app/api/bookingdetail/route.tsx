/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { BookingInvoicePDF } from "~/app/_components/dashboard/pdfs/BookingDetail";
import dayjs from "dayjs";

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { booking }: { booking: BookingDetailProps } = await req.json();
    const pdfBuffer = await renderToBuffer(
      <BookingInvoicePDF bookingDetail={booking} />,
    );

    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

    return NextResponse.json({
      pdf: base64Pdf,
      filename: `INVOICE_${booking.bookingDetails.fullName}_${dayjs(new Date()).format("DD-MM-YYYY")}.pdf`,
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }
}
