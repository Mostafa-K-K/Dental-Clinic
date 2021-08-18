import React, { useEffect, useState } from "react"
import moment from "moment"
import API from "../../../API"
import { useHistory } from "react-router"

import Patients from "../../../components/Patients"
import Doctors from "../../../components/Doctors"
import Teeth from "../../../components/Teeth"
import Types from "../../../components/Types"

export default function Create_Procedure() {

    const history = useHistory();
    const date = moment().format("YYYY-MM-DDThh:mm:ss");

    const [state, updateState] = useState({
        payment: "",
        date: date,
        id_patient: "",
        id_doctor: "",

        works: [],
        total: 0,

        category: "Adult",
        id_teeth: "",
        id_type: "",
        price: ""
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

    async function removeRow(id) {
        let work = state.works;
        let w = work.filter(r => r.id != id);
        setState({ works: w });

        let total = 0;
        w.map(r => total += r.price);
        setState({ total: total });
    }

    async function handleRow() {
        let work = state.works;
        let id;
        (work.length) ?
            id = work[work.length - 1].id + 1 :
            id = 0;
        try {
            if (state.id_teeth != "" && state.id_type != "") {

                API.get(`type/${state.id_type}`)
                    .then(res => {
                        const result = res.data.result;

                        work.push({
                            id: id,
                            teeth: (state.id_teeth == 1 || state.id_teeth == 2) ? "All Teeth" : state.id_teeth,
                            type: result.description,
                            id_teeth: state.id_teeth,
                            id_type: result.id,
                            price: result.bill
                        });

                        setState({ works: work });

                        setState({
                            category: "Adult",
                            id_teeth: "",
                            id_type: ""
                        });

                    })
                    .then(() => {
                        let total = 0;
                        work.map(w => { if (w.price != "") total += parseInt(w.price) });
                        setState({ total: total });
                    });
            }
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function changePriceWork(id, value) {
        let work = state.works;
        work[id].price = value;
        setState({ works: work });

        let total = 0;
        work.map(w => { if (w.price != "") total += parseInt(w.price) });
        setState({ total: total });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            let p_id = "";
            let d_id = "";

            if (state.id_patient && state.id_patient !== '') {
                let p_arr = state.id_patient.split('-');
                p_id = p_arr[1];
            }
            if (state.id_doctor && state.id_doctor !== '') {
                let d_arr = state.id_doctor.split('-');
                d_id = d_arr[1];
            }
            let dd = state.date.replace("T", " ");

            let reqBody = {
                payment: state.payment,
                date: dd,
                id_patient: p_id,
                id_doctor: d_id,
                balance: state.total
            };

            await API.post(`procedure`, reqBody)
                .then(res => {
                    const result = res.data.result;
                    const id_procedure = result.insertId;

                    state.works.map(work => {
                        let PTCReqBody = {
                            id_procedure: id_procedure,
                            id_type: work.id_type,
                            id_teeth: work.id_teeth,
                            price: (work.price == "" || !work.price) ? 0 : work.price
                        };

                        API.post(`PTC`, PTCReqBody);
                    });
                })
                .then(history.push({ pathname: "/procedure/list" }));
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <div>
            <h1>Create Procedure</h1>
            <form onSubmit={handleSubmit}>

                <input
                    type="number"
                    name="payment"
                    placeholder="Payment"
                    value={state.payment}
                    onChange={handleChange}
                />

                <input
                    type="datetime-local"
                    name="date"
                    value={state.date}
                    onChange={handleChange}
                />

                <Patients
                    value={state.id_patient}
                    name="id_patient"
                    onChange={handleChange}
                    resetValue={() => setState({ id_patient: "" })}
                />

                <Doctors
                    value={state.id_doctor}
                    name="id_doctor"
                    onChange={handleChange}
                    resetValue={() => setState({ id_doctor: "" })}
                />

                <select name="category" onChange={handleChange}>
                    <option value="Adult" selected={state.category === "Adult"}>Adult</option>
                    <option value="Child" selected={state.category === "Child"}>Child</option>
                </select>

                <Teeth
                    category={state.category}
                    name='id_teeth'
                    value={state.id_teeth}
                    onChange={handleChange}
                />

                <Types
                    name='id_type'
                    value={state.id_type}
                    onChange={handleChange}
                />

                <button type="button" onClick={handleRow}>+++</button>

                <table>

                    <tr>
                        <th>Number Tooth</th>
                        <th>Procedure Type</th>
                        <th>Price</th>
                    </tr>

                    {state.works.map(work =>
                        <tr>
                            <td>{work.teeth}</td>
                            <td>{work.type}</td>
                            <td>
                                <input
                                    type="number"
                                    value={work.price}
                                    onChange={e => changePriceWork(work.id, e.target.value)}
                                />
                            </td>
                            <td><button type="button" onClick={() => removeRow(work.id)}>Remove</button></td>
                        </tr>
                    )}
                    <tr>
                        <th>Total</th>
                        <th></th>
                        <th><input readOnly name="total" value={state.total} onChange={handleChange} /></th>
                    </tr>
                </table>

                <button type="submit">ADD</button>
            </form>
        </div>
    )
}