import React, { useState, useEffect } from "react"
import { useHistory, useParams } from 'react-router'
import API from "../../../API";

export default function Details_Balance() {

    const history = useHistory();
    const { id } = useParams();

    const [state, updateState] = useState({
        isTrue: true,
        patient: {},
        details: [],
        date: '',
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

    useEffect(() => {
        async function fetchData() {

            if (state.isTrue) {
                await API.post(`balance`, { id: id })
                    .then(res => {
                        const data = res.data.result;
                        setState({ patient: data })
                    });
                setState({ isTrue: false })
            }

            await API.get(`balance/${id}`)
                .then(res => {
                    let data = res.data.result;
                    if (state.date && state.date != "")
                        data = data.filter(d => d.date.substring(0, 10) == state.date)
                    setState({ details: data })
                });
        }
        fetchData();
    }, [state.date])

    return (
        <div>
            <h1>details balance</h1>
            <label>{state.patient.id}</label>
            <br />
            <label>{state.patient.first_name} {state.patient.middle_name} {state.patient.last_name}</label>
            <br />

            <button
                type="button"
                onClick={() => history.push({ pathname: `/balance/add/payment/${id}` })}
            >
                Add Payment
            </button>

            <br />
            <label>{state.patient.balance - state.patient.payment}</label>
            <br />
            <input
                type="date"
                value={state.date}
                name="date"
                onChange={handleChange}
            />
            <button type="button" onClick={() => setState({ date: "" })}>All date</button>

            <table>
                <tr>
                    <th>Date</th>
                    <th>Hours</th>
                    <th>Balance &nbsp;&nbsp;&nbsp;</th>
                    <th>Payment</th>
                </tr>
                {state.details.map(detail =>
                    <tr key={detail.id}>
                        <td>{detail.date.substring(0, 10)} &nbsp;&nbsp;&nbsp;</td>
                        <td>{detail.date.substring(11, 16)} &nbsp;&nbsp;&nbsp;</td>
                        <td>{detail.balance}</td>
                        <td>{detail.payment}</td>
                    </tr>
                )}
                {(state.date && state.date != "") ?
                    null :
                    <tr style={{ 'border-top': "1px solid blue" }}>
                        <td> Totale </td>
                        <td></td>
                        <td>{state.patient.balance}</td>
                        <td>{state.patient.payment}</td>
                    </tr>
                }
            </table>
        </div>
    )
}