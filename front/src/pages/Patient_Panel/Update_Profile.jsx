import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom";
import API from "../../API"
import SessionContext from '../../components/session/SessionContext'

import Radio from "../../components/Radio"

export default function Update_Profile() {

    const history = useHistory();

    let { session: { user } } = useContext(SessionContext);
    let id = user.id;

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
                    await API.put(`patient/${id}`, reqBody);
                    history.push({ pathname: '/patient/panel' })
                }
            })
    }

    useEffect(() => {
        async function fetData() {
            await API.get(`patient/${id}`)
                .then(res => {
                    const data = res.data.result;
                    setState({
                        phone: data.phone,
                        marital: data.marital,
                        health: data.health,
                        address: data.address,
                        lastPhone: data.phone
                    });
                });
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