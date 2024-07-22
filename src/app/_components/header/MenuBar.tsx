import Link from "next/link";
import { Logout } from "~/app/_components/dashboard/logout";
import {
  FaBox,
  FaBoxOpen,
  FaBuilding,
  FaCalendar,
  FaEuroSign,
  FaGear,
  FaInfo,
  FaTicket,
} from "react-icons/fa6";
import { Button } from "~/components/ui/button";

const menuItems = [
  { href: "/dashboard/bookings", icon: FaGear, label: "Bookings" },
  { href: "/dashboard/discounts", icon: FaTicket, label: "Discounts" },
  { href: "/dashboard/my-rent", icon: FaInfo, label: "MyRent" },
  { href: "/dashboard/hotels", icon: FaBuilding, label: "Hotel" },
  { href: "/dashboard/rooms", icon: FaBoxOpen, label: "Rooms" },
  { href: "/dashboard/prices", icon: FaEuroSign, label: "Prices" },
  { href: "/dashboard/orders", icon: FaBox, label: "Orders" },
  { href: "/dashboard/calendar", icon: FaCalendar, label: "Calendar" },
  { href: "/dashboard/settings", icon: FaGear, label: "Settings" },
];

export const MenuBar = () => {
  return (
    <nav className="flex flex-wrap justify-center lg:justify-end gap-2">
      {menuItems.map((item) => (
        <Button key={item.href} variant="outline" asChild className="h-10 px-3 py-2">
          <Link href={item.href} className="flex items-center gap-2">
            <item.icon className="w-4 h-4" />
            <span className="hidden sm:block">{item.label}</span>
          </Link>
        </Button>
      ))}
      <Logout />
    </nav>
  );
};