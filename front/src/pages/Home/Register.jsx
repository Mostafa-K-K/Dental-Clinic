import React, { useState } from 'react'
import { Link } from "react-router-dom"
import API from '../../API'

import Radio from '../../components/Radio'

export default function Register() {

    const [state, updateState] = useState({
        username: "",
        password: "",
        conPassword: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        gender: "Male",
        birth: "",
        marital: "Single",
        health: "",
        address: "",
        errPass: "",
        errPhon: "",
        errUser: ""
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

        await API.get(`username`)
            .then(async res => {
                const usernames = res.data.result;
                const isUser = usernames.find(r => r.username === state.username);

                await API.get(`phonenumber`)
                    .then(async res => {
                        const phones = res.data.result;
                        const isPhon = phones.find(r => r.phone === state.phone);

                        if (isUser) {
                            setState({ errUser: "Username alredy token" });
                        }
                        if (isPhon) {
                            setState({ errPhon: "Phone Number alredy token" });
                        }
                        if (state.conPassword !== state.password) {
                            setState({ errPass: "Password incorrect" });
                        }

                        if (!isUser && !isPhon && state.conPassword === state.password) {
                            await API.post(`signup`, reqBody);
                        }
                    });
            });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>

                <input
                    required
                    type="text"
                    name="username"
                    value={state.username}
                    placeholder="Username"
                    onChange={handleChange}
                />

                <input
                    required
                    type="text"
                    name="password"
                    value={state.password}
                    placeholder="Password"
                    onChange={handleChange}
                />
                {state.errPass}

                <input
                    required
                    type="text"
                    name="conPassword"
                    value={state.conPassword}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                />

                <input
                    required
                    type="text"
                    name="first_name"
                    value={state.first_name}
                    placeholder="First Name"
                    onChange={handleChange}
                />

                <input
                    required
                    type="text"
                    name="middle_name"
                    value={state.middle_name}
                    placeholder="Middle Name"
                    onChange={handleChange}
                />

                <input
                    required
                    type="text"
                    name="last_name"
                    value={state.last_name}
                    placeholder="Last Name"
                    onChange={handleChange}
                />

                <input
                    required
                    type="text"
                    name="phone"
                    value={state.phone}
                    placeholder="Phone Number"
                    onChange={handleChange}
                />

                <input
                    required
                    type="date"
                    name="birth"
                    value={state.birth}
                    onChange={handleChange}
                />

                <Radio
                    type="radio"
                    name="gender"
                    check={state.gender}
                    value1="Male"
                    value2="Female"
                    id1="male"
                    id2="female"
                    onChange={handleChange}
                />

                <Radio
                    type="radio"
                    name="marital"
                    check={state.marital}
                    value1="Single"
                    value2="Married"
                    id1="single"
                    id2="married"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="health"
                    value={state.health}
                    placeholder="Health Problem"
                    onChange={handleChange}
                />

                <input
                    required
                    type="text"
                    name="address"
                    value={state.address}
                    placeholder="Address"
                    onChange={handleChange}
                />

                <button type="submit">Register</button>
                <Link to="/login">Login</Link>
            </form>

        </div>
    )
}