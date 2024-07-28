
import { DiscountTable } from "~/app/_components/dashboard/discounts/DiscountTable";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";

export default async function DiscountPage() {

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
                <BreadcrumbPage>Discounts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-lg font-semibold text-primary md:text-2xl">
            Discount Details
          </h1>
        </div>
        <div className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
          <DiscountTable />
        </div>
      </>
    )
}   