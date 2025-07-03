import React from 'react'
import { Navigate } from 'react-router-dom'

export const ProtectRouter = ({children}) => {
    const user = localStorage.getItem('user')
    if(!user) {
        return <Navigate to={'/login'} replace />
    }
    return children
}
