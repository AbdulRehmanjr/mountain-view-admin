import { CreatePriceCalendar } from "~/app/_components/dashboard/price/CreatePriceCalendar";
import { PageTitle } from "~/app/_components/general/page-title";
export default function PricePage() {
  return (
    <section className="flex flex-col gap-3">
      <PageTitle title="Price Details"/>
      <CreatePriceCalendar />
    </section>
  );
}
