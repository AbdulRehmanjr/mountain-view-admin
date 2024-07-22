import Link from "next/link"
import { FaBoxOpen, FaInfo } from "react-icons/fa"
import { FaBox, FaBuilding, FaCalendar, FaEuroSign, FaGear, FaTicket } from "react-icons/fa6"
import { Logout } from "./logout"


export const SideBar = () => {

    return (
        <div className="flex flex-col gap-2 font-bold">
            <Link href="/dashboard/bookings" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaGear />Bookings
            </Link>
            <Link href="/dashboard/my-rent" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaInfo />My Rent
            </Link>
            <Link href="/dashboard/discounts" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaTicket />Discounts
            </Link>
            <Link href="/dashboard/hotels" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaBuilding />Hotel
            </Link>
            <Link href="/dashboard/rooms" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaBoxOpen />Rooms
            </Link>
            <Link href="/dashboard/prices" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaEuroSign />Prices
            </Link>
            <Link href="/dashboard/orders" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaBox />Orders
            </Link>
            <Link href="/dashboard/calendar" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaCalendar />Calendar
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-2 border-[1px] border-gray-900 hover:bg-gray-900 hover:text-white p-2">
                <FaGear />Settings
            </Link>
            <Logout />
        </div>
    )
}