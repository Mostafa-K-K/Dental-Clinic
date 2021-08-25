import React, { useState, useEffect, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

export default function Edit_Clinic() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const { id: id_cli } = useParams();
    const history = useHistory();

    const [state, updateState] = useState({
        name: "",
        err: ""
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let reqBody = state;
            await API.get(`clinic`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(async res => {
                    const result = res.data.result;
                    const isClinic = result.find(r => r.name === state.name && String(r.id) !== String(id_cli));
                    if (isClinic) setState({ err: "This clinic alredy exist" });
                    if (!isClinic) {
                        await API.put(`clinic/${id_cli}`, reqBody, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        });
                        await history.push({ pathname: '/clinic/list' })
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await API.get(`clinic/${id_cli}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setState(data);
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>EDIT CLINIC</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="name clinic"
                    value={state.name}
                    onChange={handleChange}
                />
                <span>{state.err}</span>

                <button type="submit">SAVE</button>
            </form>

        </div>
    )
}