/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoText from '@/assets/logo/UnifiedTextLogo.png'

function Install(): React.JSX.Element {
    const navigate = useNavigate()
    const [isSettingUp, setIsSettingUp] = useState(false)
    const [installed, setInstalled] = useState(false)

    const handleInstall = (): void => {
        setIsSettingUp(true)

        // 1. Simulate the setup and configuration write phase
        setTimeout(() => {
            setIsSettingUp(false)
            setInstalled(true)

            // 2. Send configuration data securely to the Electron main process
            if (typeof window !== 'undefined' && (window as any).api) {
                (window as any).api.send('apply-policies', {
                    kioskMode: false,
                    syncPort: null,
                    permissionsGranted: true,
                    restrictionsDisabledForNow: true,
                })
            }

            // 3. Keep the success message on screen for 2 seconds, then enter the app
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000)
        }, 3000)
    }

    return (
        <main className="relative flex h-screen w-screen min-h-screen flex-col items-center justify-center overflow-hidden bg-[#111625] px-4 text-center">
            {/* Back button */}
            <button
                type="button"
                disabled={isSettingUp || installed}
                onClick={() => navigate(-1)}
                className="absolute left-4 top-4 z-20 rounded-md border border-white/20 bg-black/25 px-3 py-1 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ← Back
            </button>

            <section className="mx-auto flex w-full max-w-[600px] flex-col rounded-[16px] border border-white/50 bg-white/5 px-4 py-6 shadow-lg backdrop-blur-sm sm:px-6 sm:py-8 lg:px-8">
                <img
                    src={logoText}
                    alt="UniFied"
                    className="mx-auto h-auto w-[140px] object-contain sm:w-[160px]"
                />

                <p className="mt-6 text-sm leading-5 text-white">
                    UniFied will continue with a standard desktop setup for now, without the kiosk lock or local sync server. You can revisit those restrictions later.
                </p>

                <div className="mt-4 h-px w-full bg-white/30" />

                <div className="mt-6 rounded-lg border border-white/20 bg-black/20 p-4 text-left text-sm text-slate-300">
                    <p className="font-semibold text-white">Temporary setup notice</p>
                    <p className="mt-2">
                        The Windows shell restriction and offline sync server are disabled for now. This keeps the app usable while you continue development and testing.
                    </p>
                </div>

                <button
                    type="button"
                    disabled={isSettingUp || installed}
                    onClick={handleInstall}
                    className="mx-auto mt-6 flex h-[52px] w-[160px] items-center justify-center rounded-lg border-2 border-blue-400 bg-navy-950 px-6 font-action text-sm font-normal text-white transition-all hover:bg-blue-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 disabled:cursor-not-allowed disabled:border-white/30 disabled:text-white/45 disabled:hover:bg-navy-950"
                >
                    {isSettingUp ? "Setting up..." : installed ? "Installed" : "Install now"}
                </button>

                <p
                    role="status"
                    aria-live="polite"
                    className="mt-3 min-h-4 text-center text-xs text-blue-200"
                >
                    {isSettingUp
                        ? "Preparing your local configuration..."
                        : installed
                            ? "Setup complete. Starting the app..."
                            : "Ready to continue."}
                </p>
            </section>
        </main>
    )
}

export default Install