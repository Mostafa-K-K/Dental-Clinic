import React, { useState, useEffect } from 'react'
import SessionContext from './SessionContext'
import { getCookie } from '../../cookie'
import { castBool } from '../../utils'
import API from '../../API'

export default function SessionProvider({ children }) {

    const [session, updateSession] = useState({
        user: {
            id: getCookie('id'),
            username: getCookie('username'),
            token: getCookie('token'),
            isAdmin: castBool(getCookie('isAdmin')),
            role_id: parseInt(getCookie('role_id'))
        }
    });

    function setSession(nextSession) {
        updateSession(prevSession => ({
            ...prevSession,
            ...nextSession
        }));
    }

    useEffect(() => {

        async function initializeUser() {
            let token = getCookie('token');
            let username = getCookie('username');
            let isAdmin = castBool(getCookie('isAdmin'));

            let reqBody = {
                username: username,
                isAdmin: isAdmin
            }

            // const body = JSON.stringify({ id, token, isAdmin });
            // const headers = { 'Content-Type': 'application/json' };
            // const response = await API.get('getUserData', { headers, body });

            if (token && username) {
                await API.post('getUserData', reqBody)
                    .then(res => {
                        const data = res.data.result;
                        if (data)
                            updateSession(prevSession => ({
                                ...prevSession,
                                user: {
                                    ...prevSession.user,
                                    token: data.token,
                                    role_id: data.role_id,
                                    id: data.id,
                                    username: data.username
                                }
                            }));
                    });
            }
        }
        initializeUser();
    }, []);

    let context = { session, actions: { setSession } }

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}