import React from "react"
import { Link } from "react-router-dom"

export default function Update_Profile() {
    return (
        <>
            <Link to="/admin/profile/information">Change Information</Link>
            <br />
            <Link to="/admin/profile/username">Change Username</Link>
            <br />
            <Link to="/admin/profile/password">Change Password</Link>
        </>
    )
}