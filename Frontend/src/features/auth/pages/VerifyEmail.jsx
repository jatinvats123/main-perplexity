import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Navigate } from 'react-router'
import { useSelector } from 'react-redux'
import axios from 'axios'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('loading') // loading, success, error
    const [message, setMessage] = useState('')

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    useEffect(() => {
        verifyEmail()
    }, [])

    const verifyEmail = async () => {
        try {
            const token = searchParams.get('token')

            if (!token) {
                setStatus('error')
                setMessage('No verification token provided')
                return
            }

            console.log("🔑 Verifying email with token...")

            // Call backend API to verify email
            const response = await axios.get(
                `http://192.168.1.8:8000/api/auth/verify-email?token=${token}`
            )

            console.log("✅ Email verified successfully!")
            setStatus('success')
            setMessage('Email verified! Redirecting to login...')

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (error) {
            console.error("❌ Verification failed:", error.response?.data?.message || error.message)
            setStatus('error')
            setMessage(
                error.response?.data?.message || 
                'Email verification failed. The link may have expired.' 
            )
        }
    }

    if (!loading && user) {
        return <Navigate to="/" replace />
    }

    return (
        <section className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
                <div className="w-full max-w-md rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/70 p-8 shadow-2xl shadow-black/50 backdrop-blur">
                    {status === 'loading' && (
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="inline-block">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31b8c6]"></div>
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold text-[#31b8c6] mb-2">
                                Verifying Email
                            </h1>
                            <p className="text-slate-300">
                                Please wait while we verify your email address...
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h1 className="text-3xl font-bold text-green-400 mb-3">
                                Email Verified!
                            </h1>
                            <p className="text-slate-300 mb-2">
                                {message}
                            </p>
                            <p className="text-sm text-slate-400">
                                Redirecting to login in 3 seconds...
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="text-6xl mb-4">❌</div>
                            <h1 className="text-3xl font-bold text-red-400 mb-3">
                                Verification Failed
                            </h1>
                            <p className="text-slate-300 mb-6">
                                {message}
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full rounded-lg bg-[#31b8c6] px-4 py-3 font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)]"
                                >
                                    Go to Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="w-full rounded-lg border border-[#31b8c6]/40 bg-transparent px-4 py-3 font-semibold text-[#31b8c6] transition hover:bg-[#31b8c6]/10 focus:outline-none"
                                >
                                    Register Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default VerifyEmail
