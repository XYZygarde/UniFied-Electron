/* eslint-disable prettier/prettier */
import logoUrl from '@/assets/logo/UnifiedLogo.png'
import { useNavigate } from 'react-router-dom'

function Landing(): React.JSX.Element {
    const navigate = useNavigate()

    const handleInstall = (): void => {
        console.log('Triggering installation sequence...')
        navigate('/install'); 
      
    }

    const handleTerms = (): void => {
        console.log('Opening Terms and Conditions...')
    }

    return (
        <main className="flex h-screen w-screen flex-col min-h-screen items-center justify-center overflow-hidden bg-[#111625] px-6 text-center">
            {/* Logo */}
            <img
                src={logoUrl}
                alt="Unified Logo"
                className="mb-4 h-[160px] w-[160px] object-contain drop-shadow-md sm:h-[180px] sm:w-[180px]"
            />

            {/* Title */}
            <h1 className="font-poppins text-4xl font-bold tracking-wide text-white sm:text-5xl">
                <span className="text-[#5ecdf2]">UNI</span>FIED
            </h1>

            {/* Subtitle */}
            <p className="mt-4 w-full max-w-3xl font-dm-sans text-sm leading-relaxed text-slate-300 sm:text-base">
                A Secure Kiosk Terminal for Laboratory Access and Automated Time Logging
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex w-full max-w-3xl flex-col gap-4 sm:flex-row">
                <button
                    type="button"
                    onClick={handleInstall}
                    className="flex-1 rounded-md bg-[#139a13] px-6 py-3 font-dm-sans text-sm font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-[#111625]"
                >
                    Install Now
                </button>

                <button
                    type="button"
                    onClick={handleTerms}
                    className="flex-1 rounded-md border border-[#446b96] bg-transparent px-6 py-3 font-dm-sans text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#111625]"
                >
                    Terms &amp; Conditions
                </button>
            </div>
        </main>
    )
}

export default Landing