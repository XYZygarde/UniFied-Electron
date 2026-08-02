/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoText from '@/assets/logo/UnifiedTextLogo.png'
import  PermissionCard  from '@/components/PermissionCard'

const permissions = [
    {
        title: "Authorize OS-Level Kiosk Lockdown",
        description:
            "Permits UniFied to replace the default Windows shell and disable system interrupts (e.g. Ctrl+Alt+Del). This ensures students cannot bypass the time-in gateway, enforcing strict hardware accountability.",
    },
    {
        title: "Authorize Offline Network Synchronization",
        description:
            "Opens designated local ports (Port 8080) to enable secure, AES-256 encrypted local handshakes. This guarantees that student attendance logs remain tamper-proof and verifiable by instructors via mobile scan, even during complete internet outages.",
    },
    {
        title: "Accept Administrative Responsibilities & EULA",
        description:
            "I acknowledge that applying these security policies will strictly regulate workstation access to cultivate a responsible laboratory environment. I have reviewed and agree to the End User License Agreement regarding system modifications.",
    },
]

function Install(): React.JSX.Element {
    const navigate = useNavigate()
    const [isSettingUp, setIsSettingUp] = useState(false)
    const [installed, setInstalled] = useState(false)
    const [progress, setProgress] = useState(0)
    const [checkedState, setCheckedState] = useState(new Array(permissions.length).fill(false))

    const [logs, setLogs] = useState<{ message: string; level: 'info' | 'warn' | 'error' }[]>([])
    const [visibleLogs, setVisibleLogs] = useState(0)
    const [isLogsOpen] = useState(true)

    const handlePermissionToggle = (index: number): void => {
        const updatedCheckedState = [...checkedState]
        updatedCheckedState[index] = !updatedCheckedState[index]
        setCheckedState(updatedCheckedState)
    }

    // The EULA (the last permission) is mandatory to proceed with the installation.
    const eulaAccepted = checkedState[2]
    

    const handleInstall = async (): Promise<void> => {
        setIsSettingUp(true)
        setLogs([])
        setVisibleLogs(0)

        // Run system checks in main process (returns array of {message, level})
        try {
            if (typeof window !== 'undefined' && (window as any).api) {
                const result = (await (window as any).api.invoke('run-system-checks')) as { message: string; level: 'info' | 'warn' | 'error' }[]
                setLogs(result)
                // reveal logs progressively
                let idx = 0
                const reveal = setInterval(() => {
                    idx += 1
                    setVisibleLogs(idx)
                    if (idx >= result.length) clearInterval(reveal)
                }, 350)
            }
        } catch (err) {
            setLogs([{ message: `Failed to run system checks: ${String(err)}`, level: 'error' }])
            setVisibleLogs(1)
        }

        let currentProgress = 0
        
        // Simulate the setup and configuration write phase with a progress bar
        const interval = setInterval(() => {
            currentProgress += 5
            setProgress(currentProgress)
            
            if (currentProgress >= 100) {
                clearInterval(interval)
                setIsSettingUp(false)
                setInstalled(true)
            }
        }, 150) // 100% over ~3 seconds
    }

    const handleNextStep = (): void => {
        // Send configuration data securely to the Electron main process
        if (typeof window !== 'undefined' && (window as any).api) {
            (window as any).api.send('apply-policies', {
                kioskMode: checkedState[0],
                syncPort: checkedState[1] ? 8080 : null,
                permissionsGranted: eulaAccepted,
                restrictionsDisabledForNow: !checkedState[0] && !checkedState[1],
            })
        }
        navigate('/setup')
    }

    // Clean up interval on unmount just in case
    useEffect(() => {
        return () => setProgress(0);
    }, []);

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

            <section className="mx-auto flex w-full max-w-[600px] flex-col rounded-[16px] border border-white/50 bg-[#161b2e] px-4 py-8 shadow-lg backdrop-blur-sm sm:px-10 sm:py-10 lg:px-12">
                <img
                    src={logoText}
                    alt="UniFied"
                    className="mx-auto h-auto w-[140px] object-contain sm:w-[160px]"
                />

                <div className="mt-8 h-px w-full bg-white/10" />

                {!isSettingUp && !installed ? (
                    // --- INITIAL VIEW ---
                    <div className="flex flex-col animate-in fade-in zoom-in duration-300">
                        <p className="mt-6 text-sm leading-5 text-white">
                            To proceed, you must accept the administrative responsibilities and EULA. Kiosk
                            lockdown and offline sync are optional features you can enable now.
                        </p>

                        <div className="mt-6 rounded-lg  text-left text-sm text-slate-300">
                           {permissions.map((permission, index) => (
                               <PermissionCard
                                   key={index}
                                   title={permission.title}
                                   description={permission.description}
                                   index={index}
                                   checked={checkedState[index]}
                                   onToggle={handlePermissionToggle}
                               />
                           ))}
                        </div>

                        <button
                            type="button"
                            disabled={!eulaAccepted}
                            onClick={handleInstall}
                            className="mx-auto mt-8 flex h-[48px] w-[160px] items-center justify-center rounded-lg border-2 border-blue-400 bg-navy-950 px-6 font-action text-sm font-normal text-white transition-all hover:bg-blue-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Install now
                        </button>
                    </div>
                ) : (
                    // --- INSTALLING / INSTALLED VIEW (Based on image_c11bf9.png) ---
                    <div className="mt-8 flex w-full flex-col animate-in fade-in zoom-in duration-300">
                        <div className="text-left">
                            <p className="mb-4 text-sm font-medium text-white">
                                {installed ? "Installation complete." : "Ready for installation. Please wait..."}
                            </p>
                            
                            {/* Progress Bar Container */}
                            <div className="h-5 w-full bg-gray-300 overflow-hidden">
                                {/* Progress Bar Fill */}
                                <div
                                    className="h-full bg-[#18b548] transition-all duration-150 ease-linear"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Collapsible Logs / System Check Output (hidden when installed) */}
                            {!installed ? (
                                <div className="mt-4 w-full">
                                   

                                    <div
                                        className="max-h-0 overflow-hidden transition-[max-height] duration-300"
                                        style={{ maxHeight: isLogsOpen ? '12rem' : '0' }}
                                    >
                                        <div className="h-full w-full p-3 text-sm font-mono text-slate-200">
                                            {logs.length === 0 ? (
                                                <div className="text-slate-400">Waiting for system checks to start...</div>
                                            ) : (
                                                logs.slice(0, visibleLogs).map((log, idx) => (
                                                    <div key={idx} className="whitespace-pre-wrap mb-1">
                                                        <span style={{ color: log.level === 'error' ? '#f87171' : log.level === 'warn' ? '#fbbf24' : '#9ae6b4' }}>[{log.level.toUpperCase()}]</span>
                                                        <span className="ml-2">{log.message}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 h-40 w-full" />
                            )}
                        </div>

                        <div className="mt-24 flex justify-center">
                            <button
                                type="button"
                                disabled={!installed}
                                onClick={handleNextStep}
                                className="flex h-10 w-[140px] items-center justify-center rounded border border-white/30 bg-transparent text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {installed ? "Next Step" : "Finish the Setup"}
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default Install