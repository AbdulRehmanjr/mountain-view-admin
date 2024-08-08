/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import dayjs from "dayjs";
import { GuestRegistrationPDF } from "~/app/_components/dashboard/pdfs/GuestHouseRegistration";

export async function POST(req: Request) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { booking }: { booking: BookingDetailProps } = await req.json();
    const pdfBuffer = await renderToBuffer(
      <GuestRegistrationPDF bookingDetail={booking} />,
    );

    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

    return NextResponse.json({
      pdf: base64Pdf,
      filename: `Register_Form${booking.bookingDetails.fullName}_${dayjs(new Date()).format("DD-MM-YYYY")}.pdf`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }
}
