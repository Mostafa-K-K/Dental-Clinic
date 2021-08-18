import React, { useState, useEffect, useContext } from 'react'
import SessionContext from './SessionContext'
import { getCookie } from '../../cookie'
import { castBool } from '../../utils';
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

            let reqBody = {
                username: getCookie('username'),
                isAdmin: castBool(getCookie('isAdmin'))
            }

            if (token && username) {
                await API.post(`getusername`, reqBody)
                    .then(res => {
                        const data = res.data.result;
                        if (data)
                            updateSession(prevSession => ({
                                ...prevSession,
                                user: {
                                    ...prevSession.user,
                                    ...data,
                                    token: data.token
                                }
                            }));
                    });
            }
        }
        initializeUser();
    }, [session.user.id]);

    let context = { session, actions: { setSession } }

    return (
        <SessionContext.Provider value={context}>
            {children}
        </SessionContext.Provider>
    )
}