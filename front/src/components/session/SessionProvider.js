import React, { useState, useEffect } from 'react'
import SessionContext from './SessionContext'
import { getCookie } from '../../cookie'
import API from '../../API'

export default function SessionProvider({ children }) {

    const [session, updateSession] = useState({
        user: {
            id: getCookie('id'),
            token: getCookie('token'),
            role_id: getCookie('role_id')
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
            let id = getCookie('id');
            let token = getCookie('token');

            let reqBody = {
                id: id,
                token: token
            }

            if (id && token) {
                await API.post('getUserData', reqBody, {
                    headers: {
                        id: id,
                        token: token
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        if (data)
                            updateSession(prevSession => ({
                                ...prevSession,
                                user: {
                                    ...prevSession.user,
                                    id: data.id,
                                    token: data.token,
                                    role_id: data.role_id,
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