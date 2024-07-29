import { CalendarConnection } from "~/app/_components/dashboard/settings/CalendarConnection";
import { PasswordReset } from "~/app/_components/dashboard/settings/PasswordReset";
import { PayPalConnection } from "~/app/_components/dashboard/settings/PayPalConnection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export default function SettingPage() {
  return (
    <>
      <div className="flex flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold text-primary md:text-2xl">
          Settings
        </h1>
      </div>
      <div className="flex flex-col gap-2 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <PayPalConnection />
        <CalendarConnection />
        <PasswordReset/>
      </div>
    </>
  );
}
