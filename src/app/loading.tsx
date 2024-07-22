



export default function Loading() {

    return (
        <section className="flex flex-col items-center justify-center h-[calc(100vh_-_123px)]">
            <div className="flex gap-2">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-700 h-[4.5rem] md:h-32 w-[4.5rem] md:w-32 relative">
                    <div className="w-full h-full border-8 border-t-8 border-r-8 border-r-gray-400 border-l-gray-200 border-gray-500 rounded-full animate-spin"></div>
                </div>
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-700 h-[4.5rem] md:h-32 w-[4.5rem] md:w-32 relative">
                    <div className="w-full h-full border-8 border-t-8 border-r-8 border-r-gray-400 border-l-gray-200 border-gray-500 rounded-full animate-spin"></div>
                </div>
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-700 h-[4.5rem] md:h-32 w-[4.5rem] md:w-32 relative">
                    <div className="w-full h-full border-8 border-t-8 border-r-8 border-r-gray-400 border-l-gray-200 border-gray-500 rounded-full animate-spin"></div>
                </div>
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-700 h-[4.5rem] md:h-32 w-[4.5rem] md:w-32 relative">
                    <div className="w-full h-full border-8 border-t-8 border-r-8 border-r-gray-400 border-l-gray-200 border-gray-500 rounded-full animate-spin"></div>
                </div>
            </div>
        </section>
    )
}