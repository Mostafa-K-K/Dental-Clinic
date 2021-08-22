import React from "react"
import { Link } from "react-router-dom"
import moment from "moment";

export default function Home() {

    return (
        <>
            <Link to="/login">Login</Link>
            <br /><br />
            <Link to="/register">Register</Link>
        </>
    )
}