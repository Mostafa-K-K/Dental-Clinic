import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import API from "../../API"
import SessionContext from '../../components/session/SessionContext'

import Radio from "../../components/Radio"

export default function Update_Profile() {

    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        phone: "",
        lastPhone: "",
        marital: "",
        health: "",
        address: "",
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
            let reqBody = {
                phone: state.phone,
                marital: state.marital,
                health: state.health,
                address: state.address,
            };

            await API.get(`phonenumber`)
                .then(async res => {
                    const phones = res.data.result;
                    const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                        .find(r => r.phone === state.phone);
                    if (isPhon) {
                        setState({ errPhon: "Phone Number alredy token" });
                    } else {
                        await API.put(`patient/${id}`, reqBody, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        });
                        history.push({ pathname: '/patient/panel' })
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetData() {
            try {
                await API.get(`patient/${id}`)
                    .then(res => {
                        const data = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setState({
                                phone: data.phone,
                                marital: data.marital,
                                health: data.health,
                                address: data.address,
                                lastPhone: data.phone
                            });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetData();
    }, []);

    return (
        <form onSubmit={handleSubmit}>
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
                required
                type="text"
                name="address"
                value={state.address}
                placeholder="Address"
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
                name="phone"
                value={state.phone}
                placeholder="Phone Number"
                onChange={handleChange}
            />
            <span>{state.errPhon}</span>

            <button type="submit">update</button>
        </form>
    )
}