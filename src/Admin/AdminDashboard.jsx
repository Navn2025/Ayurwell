import React from 'react'
import {Navigate} from 'react-router-dom'

const AdminDashboard=() =>
{
    // Redirect to dashboard (main admin view)
    return <Navigate to="/admin/dashboard" replace />
}

export default AdminDashboard