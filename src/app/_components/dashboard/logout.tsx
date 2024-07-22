'use client'

import { signOut } from "next-auth/react"
import { FaArrowRightFromBracket } from "react-icons/fa6"
import { Button } from "~/components/ui/button"



export const Logout = () => {


    const SignOut = async () => await signOut({ redirect: true, callbackUrl: "/" })
    
    return (
        <Button variant={'outline'} type="button" className="flex items-center gap-2" onClick={SignOut}>
            <FaArrowRightFromBracket  /><span>Log out</span>
        </Button >
    )
}