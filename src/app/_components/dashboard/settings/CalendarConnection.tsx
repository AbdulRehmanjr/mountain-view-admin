'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/react"

export const CalendarConnection = () => {

    const [isConnect,] = useState<boolean>(false)
    const router = useRouter()
    const createUrl = api.calendar.googleOAuth.useMutation({
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
                <CardTitle>Calendar OnBoarding</CardTitle>
                <CardDescription>Connect your account to calendar.</CardDescription>
            </CardHeader>
            <CardFooter >
                <Button type="button" title="calendar-connection" onClick={() => createUrl.mutate()}
                    disabled={isConnect || createUrl.isLoading}>
                    {isConnect ? "Connected" : "Connect to Calendar"}
                </Button>
            </CardFooter>
        </Card>
    )

}