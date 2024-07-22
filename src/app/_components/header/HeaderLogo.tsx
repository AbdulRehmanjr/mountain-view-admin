import Image from "next/image"

export const HeaderLogo = () => (
  <div className="flex items-center space-x-3">
    <Image src="/logo.png" alt="Logo image" width={80} height={40} className="object-contain" />
    <h1 className="text-xl font-bold text-gray-900">Pam Hotel</h1>
  </div>
)