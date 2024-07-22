'use client'
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"






export const GoBack = () => {

    const router = useRouter()

    return (
        <Button onClick={() => router.back()} className="w-fit">
                GoBack
        </Button>
    )
}