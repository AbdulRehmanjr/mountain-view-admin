
import { CreateDiscountForm } from "~/app/_components/dashboard/discounts/CreateDiscountForm"
import { GoBack } from "~/app/_components/dashboard/GoBack"

export default function CreateDiscountPage() {

    return (
        <section className="flex flex-col  gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Add discount Information</h1>
            <GoBack />
            <div className="flex justify-center">
                <CreateDiscountForm />
            </div>
        </section>
    )
}
