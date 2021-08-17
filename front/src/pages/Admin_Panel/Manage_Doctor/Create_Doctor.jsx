import React, { useState } from 'react'
import { useHistory } from 'react-router'
import API from '../../../API'

export default function Create_Doctor() {

    const history = useHistory();

    const [state, updateState] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        errPhon: ""
    });

    function setState(nextState){
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e){
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let reqBody = state;

        await API.get(`phonenumber`)
            .then(async res => {
                const result = res.data.result;
                const isPhon = result.find(r => r.phone === state.phone);

                if (isPhon) {
                    setState({ errPhon: "Phone number alredy token" });
                } else {
                    await API.post(`doctor`, reqBody);
                    history.push({ pathname: '/doctor/list' })
                }
            })
    }

    return (
        <div>
            <h1>ADD PATIENT</h1>
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
                {state.errPhon}

                <button type="submit">ADD</button>
            </form>

        </div>
    )
}