/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoUrl from '@/assets/logo/UnifiedLogo.png'

function Dashboard(): React.JSX.Element {
    const navigate = useNavigate()
    const [configData, setConfigData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchConfig = async (): Promise<void> => {
            if (typeof window !== 'undefined' && (window as any).api) {
                try {
                    // Ask the Electron backend to decrypt and send the config
                    const data = await (window as any).api.invoke('get-secure-config')
                    setConfigData(data)
                } catch (error) {
                    console.error('Error fetching secure config:', error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setIsLoading(false)
            }
        }

        fetchConfig()
    }, [])

    return (
        <main className="flex min-h-screen w-screen flex-col items-center bg-[#111625] p-6 sm:p-10">
            {/* Header */}
            <header className="mb-10 flex w-full max-w-4xl items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                    <img src={logoUrl} alt="UniFied Logo" className="h-12 w-12 object-contain drop-shadow-md" />
                    <h1 className="font-poppins text-2xl font-bold tracking-wide text-white">
                        <span className="text-[#5ecdf2]">UNI</span>FIED Dashboard
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="rounded-md border border-white/20 bg-black/25 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Return Home
                </button>
            </header>

            {/* Content Section */}
            <section className="w-full max-w-4xl flex-col rounded-[16px] border border-white/20 bg-white/5 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-4 font-poppins text-xl font-semibold text-white">Active System Configuration</h2>
                
                <p className="mb-4 font-dm-sans text-sm text-slate-300">
                    This data is pulled dynamically from the OS-level encrypted <code className="rounded bg-black/40 px-1 py-0.5 text-blue-300">secure-config.enc</code> file.
                </p>

                {/* Data Display */}
                <div className="relative rounded-lg border border-[#446b96] bg-[#0a0d16] p-4">
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center text-sm text-slate-400">
                            Decrypting storage...
                        </div>
                    ) : configData ? (
                        <pre className="overflow-x-auto font-dm-mono text-sm text-green-400">
                            {JSON.stringify(configData, null, 2)}
                        </pre>
                    ) : (
                        <div className="flex h-32 items-center justify-center text-sm text-red-400">
                            No configuration found. System may not be installed yet.
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Dashboard