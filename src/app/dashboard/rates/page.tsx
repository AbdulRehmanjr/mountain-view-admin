import { RateTable } from "~/app/_components/dashboard/rates/RateTable";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

export default function PricePage() {
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
              <BreadcrumbPage>Rate plans</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold text-primary md:text-2xl">
          Rate plans
        </h1>
      </div>
      <div className="flex rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <RateTable />
      </div>
    </>
  );
}
