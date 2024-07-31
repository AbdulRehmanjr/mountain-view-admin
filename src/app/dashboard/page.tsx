
import {  Breadcrumb,BreadcrumbItem,  BreadcrumbList, BreadcrumbPage,} from "~/components/ui/breadcrumb";
import { Charts } from "~/app/_components/dashboard/landings/Charts";

export default function DashboardPage() {
  return (
    <>
      <div className="flex flex-col justify-center gap-4">
        <Breadcrumb>
          <BreadcrumbList className="text-primary">
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed py-10 shadow-sm">
        <Charts/>
      </div>
    </>
  );
}
