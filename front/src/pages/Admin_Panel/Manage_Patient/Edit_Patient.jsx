import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router'
import API from '../../../API'
import moment from 'moment'
import SessionContext from "../../../components/session/SessionContext"

import Radio from '../../../components/Radio'

export default function Edit_Patient() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const { id: id_pat } = useParams();
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
        gender: "Male",
        birth: "",
        marital: "Single",
        health: "",
        address: "",
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
                first_name: state.first_name,
                middle_name: state.middle_name,
                last_name: state.last_name,
                phone: state.phone,
                gender: state.gender,
                birth: state.birth,
                marital: state.marital,
                health: state.health,
                address: state.address
            };
            if (state.password && state.password !== "") reqBody['password'] = state.password;

            await API.get(`username`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(async res => {
                    const usernames = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        const isUser = usernames.filter(r => r.username !== state.lastUsername)
                            .find(r => r.username === state.username);

                        await API.get(`phonenumber`, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        })
                            .then(async res => {
                                const phones = res.data.result;
                                const suc = res.data.success;
                                if (suc) {
                                    const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                                        .find(r => r.phone === state.phone);

                                    if (isUser) setState({ errUser: "Username alredy token" });
                                    if (isPhon) setState({ errPhon: "Phone Number alredy token" });
                                    if (!isUser && !isPhon) {
                                        await API.put(`patient/${id_pat}`, reqBody, {
                                            headers: {
                                                id: id,
                                                token: token,
                                                isAdmin: isAdmin
                                            }
                                        });
                                        history.push({ pathname: '/patient/list' })
                                    }
                                }
                            });
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetData() {
            try {
                await API.get(`patient/${id_pat}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        setState({
                            username: data.username,
                            lastUsername: data.username,
                            first_name: data.first_name,
                            middle_name: data.middle_name,
                            last_name: data.last_name,
                            phone: data.phone,
                            lastPhone: data.phone,
                            birth: moment(data.birth).format("YYYY-MM-DD"),
                            gender: data.gender,
                            marital: data.marital,
                            health: data.health,
                            address: data.address
                        });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetData();
    }, []);

    return (
        <div>
            <h1>ADD PATIENT</h1>
            <span>ID : {id_pat}</span>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username"
                    value={state.username}
                    placeholder="Username"
                    onChange={handleChange}
                />
                <span>{state.errUser}</span>

                <input
                    type="password"
                    name="password"
                    value={state.password}
                    placeholder="New Password"
                    onChange={handleChange}
                />

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
                    type="text"
                    name="address"
                    value={state.address}
                    placeholder="Address"
                    onChange={handleChange}
                />

                <button type="submit">SAVE</button>
            </form>

        </div>
    )
}