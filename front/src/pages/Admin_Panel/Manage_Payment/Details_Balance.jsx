import React, { useState, useEffect, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import API from "../../../API"
import moment from "moment"
import SessionContext from "../../../components/session/SessionContext"

export default function Details_Balance() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory();
    const { id: id_bal } = useParams();

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
            try {
                if (state.isTrue) {
                    await API.post(`balance`, { id: id_bal }, {
                        headers: {
                            id: id,
                            token: token,
                            isAdmin: isAdmin
                        }
                    })
                        .then(res => {
                            const data = res.data.result;
                            const success = res.data.success;
                            if (success)
                                setState({ patient: data });
                        });
                    setState({ isTrue: false });
                }

                await API.get(`balance/${id_bal}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        let data = res.data.result;
                        const success = res.data.success;
                        if (success) {
                            if (state.date && state.date != "") {
                                data = data.filter(d => d.date.substring(0, 10) == state.date);
                                setState({ details: data });
                            }
                        }
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
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
                onClick={() => history.push({ pathname: `/balance/add/payment/${id_bal}` })}
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
                        <td>{moment(detail.date).format("YYYY-MM-DD")}  &nbsp;&nbsp;&nbsp;</td>
                        <td>{moment(detail.date).format("h:mm A")}  &nbsp;&nbsp;&nbsp;</td>
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