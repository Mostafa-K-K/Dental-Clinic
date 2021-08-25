import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

export default function Create_Admin() {

    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        username: "",
        password: "",
        conPassword: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
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

        try {
            let reqBody = {
                username: state.username,
                password: state.password,
                first_name: state.first_name,
                middle_name: state.middle_name,
                last_name: state.last_name,
                phone: state.phone,
            };

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
                                await API.post(`admin`, reqBody, {
                                    headers: {
                                        id: id,
                                        token: token,
                                        isAdmin: isAdmin
                                    }
                                });
                                history.push({ pathname: '/admin/list' })
                            }
                        });
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <div>
            <h1>ADD ADMIN</h1>
            <form onSubmit={handleSubmit}>

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
                <span>{state.errPhon}</span>

                <input
                    required
                    type="text"
                    name="username"
                    value={state.username}
                    placeholder="Username"
                    onChange={handleChange}
                />
                <span>{state.errUser}</span>

                <input
                    required
                    type="password"
                    name="password"
                    value={state.password}
                    placeholder="Password"
                    onChange={handleChange}
                />

                <input
                    required
                    type="password"
                    name="conPassword"
                    value={state.conPassword}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                />
                <span>{state.errPass}</span>

                <button type="submit">ADD</button>
            </form>

        </div>
    )
}