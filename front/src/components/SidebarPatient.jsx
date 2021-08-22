import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import API from '../API';
import { getCookie, removeCookie } from '../cookie';
import SessionContext from './session/SessionContext';

export default function Sidebar(props) {

    let view = props.view;
    const name = getCookie('username');

    const {
        session: { user },
        actions: { setSession }
    } = useContext(SessionContext);

    const handleLogout = async () => {
        try {
            await API.post('logout', { username: name });
        } catch (e) {
            console.log(e);
        }
        setSession({ user: {} });
        removeCookie('username');
        removeCookie('id');
        removeCookie('token');
        removeCookie('isAdmin');
    }

    return (
        <div style={{ display: view ? 'block' : 'none' }}>
            <div style={{ display: 'flex', flexFlow: 'column' }}>

                <Link to="/patient/panel">
                    Home
                </Link>

                <Link to="/patient/profile">
                    Edit Profile
                </Link>

                <Link to="/request/create">
                    Take Appointment
                </Link>

                <Link to="/request/remove">
                    List Request
                </Link>

                <Link to="/patient/appointment">
                    List Appointment
                </Link>

                <Link to="/patient/procedure">
                    List Procedure
                </Link>


                <a onClick={handleLogout}>
                    Log Out
                </a>

            </div >
        </div >
    );
}