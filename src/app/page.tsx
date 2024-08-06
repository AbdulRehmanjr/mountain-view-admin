import Image from "next/image";
import { LoginForm } from "~/app/_components/forms/LoginForm";

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full">
      <section className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-[350px] max-w-full px-4">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">Login</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
      <section className="hidden w-1/2 lg:block">
        <div className="relative h-full w-full">
          <Image
            src="/login_page.jpg"
            alt="Seychelles beach scenery"
            className="object-cover dark:brightness-[0.2] dark:grayscale object-center"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
              <h2 className="mb-4 text-4xl font-bold">PMS for Seychelles</h2>
              <p className="mb-6 text-xl">Property Management System</p>
              <ul className="space-y-2 text-lg">
                <li>Streamline Operations</li>
                <li>Enhance Guest Experiences</li>
                <li>Optimize Performance</li>
              </ul>
              <p className="mt-8 max-w-md text-sm">
                Manage your Seychelles properties with ease. Our advanced system
                helps you efficiently handle bookings, maintain properties, and
                delight guests in the beautiful Seychelles islands.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
