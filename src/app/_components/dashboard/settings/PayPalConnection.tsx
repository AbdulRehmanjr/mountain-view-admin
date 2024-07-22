'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/react"

export const PayPalConnection = () => {

    const [isConnect,] = useState<boolean>(false)
    const router = useRouter()
    const paypalconnection = api.paypal.connectToPayPal.useMutation({
        onSuccess: (data: string) => {
            router.push(data)
        },
        onError: (_data) => {
            alert("error")
        }
    })
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account OnBoarding</CardTitle>
                <CardDescription>Connect your account to paypal.</CardDescription>
            </CardHeader>
            <CardFooter >
                <Button type="button" title="paypal-connection" onClick={() => paypalconnection.mutate()}
                    disabled={isConnect || paypalconnection.isLoading}>
                    {isConnect ? "Connected" : "Connect to PayPal"}
                </Button>
            </CardFooter>
        </Card>
    )
}