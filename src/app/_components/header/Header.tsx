import { HeaderLogo } from "~/app/_components/header/HeaderLogo"
import { MenuBar } from "~/app/_components/header/MenuBar"

export const Header = () => {
    return (
      <header className="sticky top-0 z-[1001] bg-white border-b-2 shadow-sm">
        <div className="container mx-auto px-4 py-2 lg:py-0">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <HeaderLogo />
            <MenuBar />
          </div>
        </div>
      </header>
    )
  }