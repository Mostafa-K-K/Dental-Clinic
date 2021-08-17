import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"

export default function Change_Password() {

    const id = 1;
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

    async function updateAdmin() {
        let reqBody = { username: state.username }
        await API.put(`admin/${id}`, reqBody);
    }

    async function handleSubmit(e) {
        e.nativeEvent.preventDefault();

        await API.get(`username`)
            .then(async res => {
                const usernames = res.data.result;
                const isUser = usernames.filter(r => r.username !== state.lastUsername)
                    .find(r => r.username === state.username);

                if (isUser) {
                    setState({ msg: "Username alredy token" });
                } else {
                    if (state.password === state.conPass) {
                        updateAdmin();

                        setState({
                            oldPass: "",
                            newPass: "",
                            newPassC: "",
                            msg: "Password changed successfully"
                        });

                        history.push({ pathname: '/admin/profile' });
                    }
                    else {
                        setState({
                            conPass: "",
                            msg: "Password incorrect"
                        });
                    }
                }
            });
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`admin/${id}`)
                .then(res => {
                    const result = res.data.result;
                    setState({
                        id: result.id,
                        username: result.username,
                        lastUsername: result.username,
                        password: result.password
                    })
                })
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