import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import API from '../../../API'

export default function Change_Information_Admin() {

    const id = 1;
    const history = useHistory();

    const [state, updateState] = useState({
        id: id,
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        lastPhone: "",
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
        let reqBody = state;

        await API.get(`phonenumber`)
            .then(async res => {
                const phones = res.data.result;
                const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                    .find(r => r.phone === state.phone);
                if (isPhon) {
                    setState({ errPhon: "Phone Number alredy token" });
                } else {
                    await API.put(`admin/${id}`, reqBody);
                    await history.push({ pathname: '/admin/profile' });
                }
            });
    }

    useEffect(() => {
        async function fetData() {
            await API.get(`admin/${id}`)
                .then(res => {
                    const data = res.data.result;
                    setState({
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

                <button type="submit">Update</button>
            </form>

        </div>
    )
}