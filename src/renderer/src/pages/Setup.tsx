/* eslint-disable prettier/prettier */

function Setup(): React.JSX.Element {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#111625] px-6 py-8 text-white">
            <section className="mx-auto w-full max-w-3xl rounded-[20px] border border-white/20 bg-white/5 p-8 shadow-xl backdrop-blur-sm">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Setup
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                    Configure the secure kiosk environment to ensure the system is ready for deployment.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Begin Setup
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Setup
