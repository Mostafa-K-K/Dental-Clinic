import React, { useState, useEffect } from "react"
import { useHistory, useParams } from 'react-router'
import API from '../../../API'

export default function Edit_Clinic() {

    const { id } = useParams();
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
            await API.get(`clinic`)
                .then(async res => {
                    const result = res.data.result;
                    const isClinic = result.find(r => r.name === state.name && String(r.id) !== String(id));
                    if (isClinic) setState({ err: "This clinic alredy exist" });
                    if (!isClinic) {
                        await API.put(`clinic/${id}`, reqBody);
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
                await API.get(`clinic/${id}`)
                    .then(res => {
                        const data = res.data.result;
                        setState(data)
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