import { Header } from "~/app/_components/header/Header";


export const metadata = {
    title: "Admin Dashboard",
    description: "Admin Dashboard to monitor the bicycle app",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="grid rounded-md m-2 p-2 min-h-[calc(100vh_-_110px)]">
                {children}
            </main>
        </>

    );
}
