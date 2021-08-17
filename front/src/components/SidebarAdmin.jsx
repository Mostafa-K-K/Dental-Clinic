import React, { useEffect, useContext } from 'react'
import { getCookie, removeCookie } from '../cookie'
import { Link } from 'react-router-dom'
import API from '../API'
import SessionContext from './session/SessionContext'

import './Sidebar.css'

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
        removeCookie('username');
        removeCookie('id');
        removeCookie('token');
        removeCookie('isAdmin');
        removeCookie('role_id');
        setSession({ user: {} });
    }

    useEffect(() => {
        function getToggle() {
            const showMenu = (headerToggle, navbarId) => {
                const toggleBtn = document.getElementById(headerToggle),
                    nav = document.getElementById(navbarId)
                if (headerToggle && navbarId) {
                    toggleBtn.addEventListener('click', () => {
                        nav.classList.toggle('show-menu')
                        toggleBtn.classList.toggle('bx-x')
                    })
                }
            }

            showMenu('header-toggle', 'navbar')
            const linkColor = document.querySelectorAll('.nav__link')
            function colorLink() {
                linkColor.forEach(link => link.classList.remove('active'))
                this.classList.add('active')
            }
            linkColor.forEach(link => link.addEventListener('click', colorLink))
        }
        getToggle()
    }, []);

    return (
        <div style={{ display: view ? 'block' : 'none' }}>
            <header className="header">
                <div className="header__container">
                    <a href="#" className="header__logo"></a>
                    <div className="header__search">
                        Welcome {name}
                    </div>
                    <div className="header__toggle">
                        <i className='bx bx-menu' id="header-toggle"></i>
                    </div>
                </div>
            </header>

            <div className="nav" id="navbar">
                <nav className="nav__container">

                    <div>
                        <a className="nav__link nav__logo">
                            <i className='bx bx-menu nav__icon' ></i>
                            <span className="nav__logo-name">Menu</span>
                        </a>
                        <div className="nav__list">
                            <div className="nav__items">
                                <h3 className="nav__subtitle">menu</h3>

                                <Link
                                    to="/admin/profile"
                                    className="nav__link active"
                                    style={{ 'display': (user.role_id === 0 ? 'block' : 'none') }}
                                >
                                    <i className='bx bx-home nav__icon sizeicon3' ></i>
                                    <span className="nav__name">Profile</span>
                                </Link>

                                <Link
                                    to="/admin/list"
                                    className="nav__link active"
                                    style={{ 'display': (user.role_id === 0 ? 'block' : 'none') }}
                                >
                                    <i className='bx bx-home nav__icon sizeicon3' ></i>
                                    <span className="nav__name">Admin</span>
                                </Link>

                                <Link to="/appointment/today" className="nav__link active">
                                    <i className='bx bx-home nav__icon sizeicon3' ></i>
                                    <span className="nav__name">Today Appointment</span>
                                </Link>
                                <Link to="/appointment/upcoming" className="nav__link active">
                                    <i className='bx bx-home nav__icon sizeicon3' ></i>
                                    <span className="nav__name">Upcoming Appointment</span>
                                </Link>
                                <Link to="/clinic/list" className="nav__link active">
                                    <i className='bx bi-gear nav__icon' ></i>
                                    <span className="nav__name">Clinic</span>
                                </Link>
                                <Link to="/doctor/lis" className="nav__link">
                                    <i className='bx bx-user nav__icon' ></i>
                                    <span className="nav__name">Doctor</span>
                                </Link>
                                <Link to="/patient/list" className="nav__link">
                                    <i className="bx bi-book nav__icon sizeicon"></i>
                                    <span className="nav__name">Patient</span>
                                </Link>
                                <Link to="/teeth/list" className="nav__link">
                                    <i className='bx bx-book-alt nav__icon'></i>
                                    <span className="nav__name">Teeth</span>
                                </Link>
                                <Link to="/type/list" className="nav__link">
                                    <i className='bx bx-id-card nav__icon sizeicon3'></i>
                                    <span className="nav__name">Acts</span>
                                </Link>
                                <Link to="/procedure/list" className="nav__link">
                                    <i className="bx bi-calendar-check nav__icon sizeicon2"></i>
                                    <span className="nav__name">Procuder</span>
                                </Link>
                                <Link to="/request/list" className="nav__link">
                                    <i className="bx bi-calendar-check nav__icon sizeicon2"></i>
                                    <span className="nav__name">Request</span>
                                </Link>
                                <Link to="/payment/create" className="nav__link">
                                    <i className="bx bi-calendar-check nav__icon sizeicon2"></i>
                                    <span className="nav__name">Add Payment</span>
                                </Link>
                                <Link to="/balance/list" className="nav__link">
                                    <i className="bx bi-calendar-check nav__icon sizeicon2"></i>
                                    <span className="nav__name">Balance</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <a onClick={handleLogout} className="nav__link nav__logout">
                        <i className='bx bx-log-out bx-tada nav__icon'></i>
                        <span className="nav__name">Log Out</span>
                    </a>

                </nav>
            </div>
        </div>
    );
}