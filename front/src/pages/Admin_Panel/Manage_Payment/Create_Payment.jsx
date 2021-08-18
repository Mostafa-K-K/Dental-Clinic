import React, { useState } from "react"
import moment from "moment"
import { useHistory } from 'react-router'
import API from "../../../API"

import Patients from "../../../components/Patients"

export default function Create_Payment() {

    let history = useHistory();
    const date = moment().format("YYYY-MM-DDThh:mm:ss");

    const [state, updateState] = useState({
        payment: "",
        date: date,
        id_patient: ""
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
            let p_arr = state.id_patient.split(' ');
            let p_str = p_arr.length - 1;
            let p_id = p_arr[p_str];

            let dd = state.date.replace("T", " ");

            let reqBody = {
                payment: state.payment,
                date: dd,
                id_patient: p_id
            };

            await API.post(`procedure`, reqBody);
            await history.push({ pathname: `/balance/list` });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <div>
            <h1>add payment</h1>
            <form onSubmit={handleSubmit}>

                <Patients
                    value={state.id_patient}
                    name="id_patient"
                    onChange={handleChange}
                    resetValue={() => setState({ id_patient: "" })}
                />

                <input
                    required
                    type="number"
                    name="payment"
                    placeholder="Payment"
                    value={state.payment}
                    onChange={handleChange}
                />

                <button type="submit">ADD</button>
            </form>
        </div>
    )

}