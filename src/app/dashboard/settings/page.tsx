import { CalendarConnection } from "~/app/_components/dashboard/settings/CalendarConnection";
import { PasswordReset } from "~/app/_components/dashboard/settings/PasswordReset";
import { PayPalConnection } from "~/app/_components/dashboard/settings/PayPalConnection";



export default function SettingPage() {


    return (
        <section className="flex flex-col gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Settings</h1>
            <PasswordReset />
            <PayPalConnection />
            <CalendarConnection />
        </section>
    )
}