/* eslint-disable prettier/prettier */
import Textbox from '@/components/Textbox'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

type ElectronApi = {
    send: (channel: string, data?: unknown) => void
    invoke: (channel: string, data?: unknown) => Promise<unknown>
}

type SecureConfigData = {
    installed?: boolean
    kioskMode?: boolean
    policiesAccepted?: boolean
    installedAt?: string
    permissionsGranted?: boolean
    restrictionsDisabledForNow?: boolean
    syncPort?: number | null
    computerName?: string
    computerRoom?: string
    computerBuilding?: string
    [key: string]: unknown
}

function Setup(): React.JSX.Element {
    const navigate = useNavigate()
    const [pcname, setPcname] = useState<string>('')
    const [pcroom, setPcroom] = useState<string>('')
    const [pcbldg, setPcbldg] = useState<string>('')
    const [inputerror, setInputError] = useState<string>('')

    const registerPC = async (): Promise<void> => {
        if (!pcname) {
            setInputError('Please enter PC name')
            return
        }
        if (!pcroom) {
            setInputError('Please enter PC room')
            return
        }

        if (!pcbldg) {
            setInputError('Please enter PC building')
            return
        }

        const api = (window as Window & { api?: ElectronApi }).api
        if (typeof window !== 'undefined' && api) {
            const currentConfig = (await api.invoke('get-secure-config')) as SecureConfigData
            api.send('apply-policies', {
                ...currentConfig,
                computerName: pcname,
                computerRoom: pcroom,
                computerBuilding: pcbldg,
            })
        }

        setInputError('')
        navigate('/dashboard')
    }

    return (
        <main className="relative flex h-screen w-screen min-h-screen flex-col items-center justify-center overflow-hidden bg-[#111625] px-4 text-center">
            <button
                type="button"

                onClick={() => navigate(-1)}
                className="absolute left-4 top-4 z-20 rounded-md border border-white/20 bg-black/25 px-3 py-1 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ← Back
            </button>
            <section className="mx-auto w-full max-w-xl rounded-[20px] border border-white/20 bg-[#0c101d] p-8 shadow-xl backdrop-blur-sm">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                    Setup PC
                </h1>
                <div className="mt-4 h-px w-full bg-white/30" />

                <p className="flex flex-col mt-6 text-sm leading-6 text-slate-300 gap-4">
                    <Textbox
                        name="pcname"
                        label="Enter PC Username"
                        value={pcname}
                        onChange={(e) => setPcname(e.target.value)}
                        error={inputerror}
                        required
                    />
                    <span className="mb-4" />
                    <Textbox
                        name="pcroom"
                        label="Enter PC Laboratory room"
                        value={pcroom}
                        onChange={(e) => setPcroom(e.target.value)}
                        error={inputerror}
                        required
                    />
                    <span className="mb-4" />
                    <Textbox
                        name="pcbldg"
                        label="Enter Building"
                        value={pcbldg}
                        onChange={(e) => setPcbldg(e.target.value)}
                        error={inputerror}
                        required
                    />
                    <span className="text-[#5ecdf2] text-sm text-left leading-6 mb-4">Note: This will be used for device credentials and cloud registry</span>
                </p>


                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => {
                            void registerPC()
                        }}
                    >
                        Continue
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Setup
