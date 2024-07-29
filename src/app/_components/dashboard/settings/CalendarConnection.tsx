'use client'

import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { useToast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"

export const CalendarConnection = () => {

    const router = useRouter()
    const toast = useToast()

    const isConnected = api.calendar.calendarConnection.useQuery()
    const createUrl = api.calendar.googleOAuth.useMutation({
        onSuccess: (data: string) => {
            router.push(data)
        },
        onError: (_data) => {
            toast.toast({
                variant:'destructive',
                title:"Error",
                description:'Something went wrong.'
            })
        }

    })
    return (
        <Card className="w-full">
            <CardHeader className="text-primary">
                <CardTitle>Calendar OnBoarding</CardTitle>
                <CardDescription>Connect your account to calendar.</CardDescription>
            </CardHeader>
            <CardFooter >
                <Button type="button" title="calendar-connection" onClick={() => createUrl.mutate()}
                    disabled={(isConnected.data ?? true) || createUrl.isLoading}>
                    {isConnected.data  ? "Connected" : "Connect to calendar"}
                </Button>
            </CardFooter>
        </Card>
    )

}