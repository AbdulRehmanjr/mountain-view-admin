import { OrderTable } from "~/app/_components/dashboard/orders/OrderTable";

export default function OrderPage() {
    return (
        <section className="flex flex-col gap-3">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Orders Details</h1>
            <OrderTable />
        </section>
    )
}

