import { RateCreationForm } from "~/app/_components/dashboard/rates/RateCreationForm";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";

export default function CreatePlanPage() {
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
              <BreadcrumbLink href="/dashboard/rates">
                Rate plans
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create rate plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-lg font-semibold text-primary md:text-2xl">
          Add rate plan
        </h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed p-5 shadow-sm md:p-10">
        <RateCreationForm />
      </div>
    </>
  );
}