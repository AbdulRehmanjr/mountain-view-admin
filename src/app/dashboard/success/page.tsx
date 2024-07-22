/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "~/trpc/server"
import Image from 'next/image'

export default async function OnSuccess({ searchParams }: { searchParams: { merchantId: string, merchantIdInPayPal: string } }) {



    void api.paypal.createSellerInfo.mutate({
        trackingId: searchParams.merchantId.toString(),
        merchantId: searchParams.merchantIdInPayPal.toString(),
    })

    const confirmation: StatusProps = await api.paypal.onBoardingStatus.query({ merchantId: searchParams.merchantIdInPayPal.toString() })

    const isReady: boolean = confirmation?.amountReceivable && confirmation.primaryEmail

    return (
        <section>
            <h1 className="text-2xl font-semibold mb-4">Bicycle App</h1>
            <div>
                {isReady && (
                    <div className="mb-4">
                        <p className="text-green-600">You are ready to receive payments on the platform!</p>
                        <Image width={600} height={700} src="/success.png" alt="Ready to receive payments" className="mt-4 max-w-full" />
                    </div>
                )}
                {!isReady && !confirmation.primaryEmail && (
                    <div className="mb-4">
                        <p className="text-red-600">
                            Attention: Please confirm your email address on{' '}
                            <a href="https://www.paypal.com/businessprofile/settings" target="_blank" rel="noopener noreferrer" className="underline">https://www.paypal.com/businessprofile/settings</a>{' '}
                            in order to receive payments! You currently cannot receive payments.
                        </p>
                    </div>
                )}
                {!isReady && !confirmation?.amountReceivable && (
                    <div className="mb-4">
                        <p className="text-red-600">
                            Attention: You currently cannot receive payments due to restrictions on your PayPal account.
                            Please reach out to PayPal Customer Support or connect to{' '}
                            <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" className="underline">https://www.paypal.com</a>{' '}
                            for more information.
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
