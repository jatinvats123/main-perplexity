import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31b8c6] mx-auto mb-4"></div>
                    <p className="text-slate-200">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }


    return children
}

export default Protected