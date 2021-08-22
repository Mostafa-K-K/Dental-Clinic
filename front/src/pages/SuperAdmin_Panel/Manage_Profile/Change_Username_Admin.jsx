import React, { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import SessionContext from '../../../components/session/SessionContext'

const bcrypt = require("bcryptjs")

export default function Change_Username_Admin() {

    const { session: { user: { id } } } = useContext(SessionContext);
    const history = useHistory();

    const [state, updateState] = useState({
        id: id,
        username: "",
        lastUsername: "",
        conPass: "",
        password: "",
        msg: ""
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
            let reqBody = { username: state.username }
            let isMatch = await bcrypt.compare(state.conPass, state.password);

            await API.get(`username`)
                .then(async res => {
                    const usernames = res.data.result;
                    const isUser = usernames.filter(r => r.username !== state.lastUsername)
                        .find(r => r.username === state.username);

                    if (isUser) {
                        setState({ msg: "Username alredy token" });
                    } else {
                        if (isMatch) {
                            await API.put(`admin/${id}`, reqBody);

                            setState({
                                username: "",
                                lastUsername: "",
                                conPass: "",
                                password: "",
                                msg: "Password changed successfully"
                            });

                            await history.push({ pathname: '/admin/profile' });
                        }
                        else {
                            setState({
                                conPass: "",
                                msg: "Password incorrect"
                            });
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await API.get(`admin/${id}`)
                    .then(res => {
                        const result = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setState({
                                id: result.id,
                                username: result.username,
                                lastUsername: result.username,
                                password: result.password
                            });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            <span>Change Your username</span>

            <input
                type="text"
                name="username"
                value={state.username}
                placeholder="Username"
                onChange={handleChange}
            />

            <input
                type="password"
                name="conPass"
                value={state.conPass}
                placeholder="Your Password"
                onChange={handleChange}
            />

            <label>{state.msg}</label>
            <button type="submit">Update</button>

        </form>
    )
}