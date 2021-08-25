import React, { useState, useContext } from "react"
import { useHistory } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

export default function Create_Type() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory();

    const [state, updateState] = useState({
        description: "",
        bill: "",
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
        let reqBody = state;
        try {
            await API.get(`type`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(async res => {
                    const result = res.data.result;
                    const isDesc = result.find(r => r.description === state.description);
                    if (isDesc) setState({ err: "This type alredy exist" });
                    if (!isDesc) {
                        await API.post(`type`, reqBody, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        });
                        history.push({ pathname: '/type/list' })
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <div>
            <h1>ADD TYPE</h1>
            <form onSubmit={handleSubmit}>

                <input
                    required
                    type="text"
                    name="description"
                    value={state.description}
                    placeholder="Description"
                    onChange={handleChange}
                />
                <span>{state.err}</span>

                <input
                    required
                    type="number"
                    name="bill"
                    value={state.bill}
                    placeholder="Bill"
                    onChange={handleChange}
                />

                <button type="submit">ADD</button>
            </form>

        </div>
    )
}