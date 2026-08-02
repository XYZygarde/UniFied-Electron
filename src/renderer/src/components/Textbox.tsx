/* eslint-disable prettier/prettier */
import React, { useId } from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    note?: string
    error?: string
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    ({ label, note, error, className = '', id, ...props }, ref) => {
        // Generate a unique ID so the label can click-focus the input
        const uniqueId = useId()
        const inputId = id || uniqueId

        return (
            <div className={`flex w-full max-w-lg flex-col gap-1 text-left ${className}`}>
                <div className="relative w-full">
                    <input
                        ref={ref}
                        id={inputId}
                        // CRITICAL: The space placeholder is required for the CSS floating label trick to work.
                        // It tells the browser "this input is empty" so Tailwind can track 'placeholder-shown'.
                        placeholder=" "
                        className={`peer w-full rounded-md border bg-[#0c101d] px-4 py-3 font-dm-sans text-sm text-white transition-all focus:outline-none focus:ring-1 ${
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-slate-500/80 hover:border-slate-400 focus:border-sky-400 focus:ring-sky-400'
                        }`}
                        {...props}
                    />

                    {label && (
                        <label
                            htmlFor={inputId}
                            className={`pointer-events-none absolute left-3 top-0 origin-[0] -translate-y-1/2 bg-[#0c101d] px-1 font-dm-sans text-md transition-all duration-200 
                            peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 
                            peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-120 ${
                                error
                                    ? 'text-red-500 peer-focus:text-red-500'
                                    : 'text-slate-400 peer-focus:text-sky-400'
                            }`}
                        >
                            {label}
                        </label>
                    )}
                </div>

                {/* Helper Note or Error Message */}
                {error ? (
                    <p className="px-2 pt-1 font-dm-sans text-xs text-red-500">{error}</p>
                ) : note ? (
                    <p className="px-2 pt-1 font-dm-sans text-xs text-slate-400">{note}</p>
                ) : null}
            </div>
        )
    }
)

TextInput.displayName = 'TextInput'

export default TextInput