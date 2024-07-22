import { EditDiscountForm } from "~/app/_components/dashboard/discounts/EditDiscountForm"
import { GoBack } from "~/app/_components/dashboard/GoBack"

export default async function EditDiscountPage({ params }: { params: { discountId: string } }) {


    return (
        <section className="flex flex-col  gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Add Price Information</h1>
            <GoBack />
            <EditDiscountForm discountId={params.discountId} />
        </section>
    )
}
