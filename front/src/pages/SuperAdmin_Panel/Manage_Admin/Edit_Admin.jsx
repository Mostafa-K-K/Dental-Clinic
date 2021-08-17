import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router'
import API from '../../../API'

export default function Change_Information() {

    const { id } = useParams();
    const history = useHistory();

    const [state, updateState] = useState({
        username: "",
        lastUsername: "",
        password: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        lastPhone: "",
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
                const isUser = usernames.filter(r => r.username !== state.lastUsername)
                    .find(r => r.username === state.username);

                await API.get(`phonenumber`)
                    .then(async res => {
                        const phones = res.data.result;
                        const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                        .find(r => r.phone === state.phone);

                        if (isUser) {
                            setState({ errUser: "Username alredy token" });
                        }
                        if (isPhon) {
                            setState({ errPhon: "Phone Number alredy token" });
                        }

                        if (!isUser && !isPhon) {
                            await API.put(`admin/${id}`, reqBody);
                            history.push({ pathname: '/admin/list' })
                        }
                    });
            });
    }

    useEffect(() => {
        async function fetData() {
            await API.get(`admin/${id}`)
                .then(res => {
                    const data = res.data.result;
                    setState({
                        username: data.username,
                        lastUsername: data.username,
                        password: data.password,
                        first_name: data.first_name,
                        middle_name: data.middle_name,
                        last_name: data.last_name,
                        phone: data.phone,
                        lastPhone: data.phone
                    });
                });
        }
        fetData();
    }, []);

    return (
        <div>
            <h1>EDIT ADMIN</h1>
            <span>ID : {id}</span>

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

                <input
                    type="text"
                    name="username"
                    value={state.username}
                    placeholder="Username"
                    onChange={handleChange}
                />
                <span>{state.errUser}</span>

                <input
                    type="text"
                    name="password"
                    value={state.password}
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">Save</button>
            </form>

        </div>
    )
}