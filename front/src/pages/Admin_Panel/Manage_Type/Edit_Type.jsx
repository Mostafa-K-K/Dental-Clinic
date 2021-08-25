import React, { useState, useEffect, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

export default function Edit_Type() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const { id: id_type } = useParams();
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
                    const success = res.data.success;
                    if (success) {
                        const isDesc = result.find(r => r.description === state.description && String(r.id) !== String(id_type));
                        if (isDesc) setState({ err: "This type alredy exist" });
                        if (!isDesc) {
                            await API.put(`type/${id_type}`, reqBody, {
                                headers: {
                                    id: id,
                                    token: token,
                                    isAdmin: isAdmin
                                }
                            });
                            history.push({ pathname: '/type/list' })
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`type/${id_type}`)
                .then(res => {
                    const data = res.data.result;
                    setState(data)
                });
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>EDIT TYPE</h1>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="description"
                    value={state.description}
                    placeholder="Description"
                    onChange={handleChange}
                />
                <span>{state.err}</span>

                <input
                    type="number"
                    name="bill"
                    value={state.bill}
                    placeholder="Bill"
                    onChange={handleChange}
                />

                <button type="submit">SAVE</button>
            </form>

        </div>
    )
}