import React, { useState, useEffect, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import moment from "moment"
import API from "../../../API"
import SessionContext from "../../../components/session/SessionContext"

export default function Add_Payment() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    let { id: id_pat } = useParams();
    let history = useHistory();
    const date = moment().format("YYYY-MM-DDThh:mm:ss");

    const [state, updateState] = useState({
        patient: {},
        payment: "",
        date: date,
        id_patient: id_pat,
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
            let dd = moment().format("YYYY-MM-DD hh:mm:ss");

            let reqBody = {
                payment: state.payment,
                date: dd,
                id_patient: state.id_patient
            };

            await API.post(`procedure`, reqBody, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            });
            await history.push({ pathname: `/balance/details/${id_pat}` });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await API.get(`patient/${id_pat}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setState({ patient: result });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <h1>add payment</h1>
            <form onSubmit={handleSubmit}>

                <label>{state.patient.id}</label>
                <br />
                <label>{state.patient.first_name} {state.patient.middle_name} {state.patient.last_name}</label>
                <br />
                <input
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