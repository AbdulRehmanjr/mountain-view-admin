import { MyRentTable } from "~/app/_components/dashboard/my-rent/MyRentTable";

export default async function MyRentPage() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
        MyRent Integration
      </h1>
      <MyRentTable />
    </section>
  );
}