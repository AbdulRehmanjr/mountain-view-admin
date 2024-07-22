
import { DiscountTable } from "~/app/_components/dashboard/discounts/DiscountTable";

export default async function DiscountPage() {

    return (
        <section className="flex flex-col gap-3 bg-white">
            <p className="text-xl md:text-3xl font-bold">Discount Details</p>
            <DiscountTable />
        </section>
    )
}   