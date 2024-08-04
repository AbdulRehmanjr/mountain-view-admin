/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { BookingPDF } from "~/app/_components/dashboard/booking/PdfGeneration";


export async function POST(_req: Request) {
  try {

    const pdfBuffer = await renderToBuffer(<BookingPDF  />);

    // Create and return the response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=booking_testing.pdf`,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "received" }, { status: 202 });
  }
}
