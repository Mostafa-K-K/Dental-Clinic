import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router'
import API from '../../../API'

export default function Edit_Doctor() {

    const { id } = useParams();
    const history = useHistory();

    const [state, updateState] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        errPhon: ""
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
            await API.get(`doctor`)
                .then(async res => {
                    const result = res.data.result;
                    const isPhon = result.find(r => r.phone === state.phone && String(r.id) !== String(id));
                    if (isPhon) setState({ errPhon: "Phone Number alredy token" });
                    if (!isPhon) {
                        await API.put(`doctor/${id}`, reqBody);
                        await history.push({ pathname: '/doctor/list' });
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function fetData() {
        try {
            await API.get(`doctor/${id}`)
                .then(res => {
                    const data = res.data.result;
                    setState(data)
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetData();
    }, []);

    return (
        <div>
            <h1>Edit Doctor</h1>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="first_name"
                    value={state.first_name}
                    placeholder="First Name"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="middle_name"
                    value={state.middle_name}
                    placeholder="Middle Name"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="last_name"
                    value={state.last_name}
                    placeholder="Last Name"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="phone"
                    value={state.phone}
                    placeholder="Phone Number"
                    onChange={handleChange}
                />
                <span>{state.errPhon}</span>

                <button type="submit">SAVE</button>
            </form>

        </div>
    )
}