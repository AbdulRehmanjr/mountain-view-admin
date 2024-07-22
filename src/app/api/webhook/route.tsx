/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCClientError } from '@trpc/client';
import { NextResponse } from 'next/server';
import { db } from '~/server/db'

export async function POST(req: Request) {

  if (!req.body)
    return NextResponse.json({ message: 'Error' }, { status: 404 })

  const jsonObject = await req.json()

  switch (jsonObject.event_type) {
    case 'MERCHANT.ONBOARDING.COMPLETED':
      await db.sellerPayPal.update({
        where: {
          trackingId: jsonObject.resource.tracking_id,
        },
        data: {
          merchantId: jsonObject.resource.merchant_id,
          partner_client_id: jsonObject.resource.partner_client_id,
        }
      })
      break
    case "MERCHANT.PARTNER-CONSENT.REVOKED":
      break
    case "CHECKOUT.ORDER.APPROVED":
      break
    case "CHECKOUT.ORDER.COMPLETED":
      try {
        const referenceId: string = jsonObject.resource.purchase_units[0].reference_id
        await db.payPalBoookingInfo.update({
          where: { paypalBoookingId: referenceId },
          data: {
            captureId: jsonObject.resource.id,
            paymentEmail: jsonObject.resource.payer.email_address,
            payerId: jsonObject.resource.payer.payer_id,
            paymentId: jsonObject.resource.purchase_units[0].payments.captures[0].id,
          }
        })
      } catch (error) {
        if (error instanceof TRPCClientError) {
          console.error(error.message)
          return NextResponse.json({ message: error.message }, { status: 200 })
        }
        return NextResponse.json({ message: 'Webhook Error' }, { status: 200 })
      }
      break
    default:
      console.log(`Unhandled webhook event type: ${jsonObject.event_type}`);
  }

  return NextResponse.json({ message: 'Webhook received' }, { status: 200 })
}
