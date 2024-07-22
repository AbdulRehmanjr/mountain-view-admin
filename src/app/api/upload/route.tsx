/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextResponse } from "next/server";

export async function POST(_req: Request, _res: NextResponse) {

    return NextResponse.json({ message: 'received' },{status:202});
  }