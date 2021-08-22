import React, { useEffect, useContext } from 'react'
import { getCookie, removeCookie } from '../cookie'
import { Link } from 'react-router-dom'
import API from '../API'
import SessionContext from './session/SessionContext'

export default function Sidebar(props) {

    let view = props.view;
    const name = getCookie('username');

    const {
        session: { user },
        actions: { setSession }
    } = useContext(SessionContext);

    async function handleLogout() {
        try {
            await API.post('logout', { username: name });
        } catch (e) {
            console.log(e);
        }
        removeCookie('id');
        removeCookie('username');
        removeCookie('token');
        removeCookie('isAdmin');
        removeCookie('role_id');
        setSession({ user: {} });
    }

    return (
        <div style={{ display: view ? 'block' : 'none' }}>
            <div style={{ display: 'flex', flexFlow: 'column' }}>

                <Link
                    to="/admin/profile"
                    style={{ 'display': (parseInt(user.role_id) === 0 ? 'block' : 'none') }}
                >
                    Profile
                </Link>

                <Link
                    to="/admin/list"
                    style={{ 'display': (parseInt(user.role_id) === 0 ? 'block' : 'none') }}
                >
                    Admin
                </Link>

                <Link to="/appointment/today">
                    Today Appointment
                </Link>

                <Link to="/appointment/upcoming">
                    Upcoming Appointment
                </Link>

                <Link to="/clinic/list">
                    Clinic
                </Link>

                <Link to="/doctor/list">
                    Doctor
                </Link>

                <Link to="/patient/list">
                    Patient
                </Link>

                <Link to="/type/list">
                    Acts
                </Link>

                <Link to="/procedure/list">
                    Procuder
                </Link>

                <Link to="/request/list">
                    Request
                </Link>

                <Link to="/payment/create">
                    Add Payment
                </Link>

                <Link to="/balance/list">
                    Balance
                </Link>


                <a onClick={handleLogout}>
                    Log Out
                </a>

            </div>
        </div >
    );
}