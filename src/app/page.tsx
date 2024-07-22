import Image from "next/image";
import { LoginForm } from "~/app/_components/forms/LoginForm";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
      <section className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="grid md:grid-cols-2">
          <div className="relative hidden md:block">
            <Image
              src="/logo.png"
              fill
              alt="Hotel Mountain View"
              className="absolute inset-0 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <h1 className="px-6 text-center text-4xl font-bold text-white">
                Hotel Mountain View
              </h1>
            </div>
          </div>
          <div className="p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">
                Welcome Back
              </h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
