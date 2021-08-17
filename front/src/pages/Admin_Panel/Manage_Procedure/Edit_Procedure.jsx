import React, { useEffect, useState } from "react"
import { useHistory, useParams } from 'react-router'
import API from "../../../API"

import Patients from "../../../components/Patients"
import Doctors from "../../../components/Doctors"
import Teeth from "../../../components/Teeth"
import Types from "../../../components/Types"

export default function Edit_Procedure() {

    const history = useHistory();
    const { id } = useParams();

    const [state, updateState] = useState({
        payment: "",
        date: "",
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

        if (state.id_teeth != "" && state.id_type != "") {

            API.get(`type/${state.id_type}`)
                .then(res => {
                    const result = res.data.result;

                    work.push({
                        id: id,
                        teeth: (state.id_teeth == 1 || state.id_teeth == 2) ? "All Teeth" : state.id_teeth,
                        description: result.description,
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
    }

    async function changePriceWork(id, value) {
        let work = state.works;
        let w = work.find(r => r.id == id);
        w.price = value;
        setState({ works: work });

        let total = 0;
        work.map(w => { if (w.price != "") total += parseInt(w.price) });
        setState({ total: total });
    }

    async function handleSubmit(e) {
        e.preventDefault();
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

        await API.put(`procedure/${id}`, reqBody)
            .then(
                API.delete(`PTCALL/${id}`)
            )
            .then(
                state.works.map(work => {
                    let PTCReqBody = {
                        id_procedure: id,
                        id_type: work.id_type,
                        id_teeth: work.id_teeth,
                        price: (work.price == "" || !work.price) ? 0 : work.price
                    };
                    API.post(`PTC`, PTCReqBody);
                })
            )
            .then(history.push({ pathname: "/procedure/list" }))

    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`procedure/${id}`)
                .then(res => {
                    const result = res.data.result;
                    if (result.id_patient && result.id_patient !== "") {
                        API.get(`patient/${result.id_patient}`)
                            .then(res => {
                                const patient = res.data.result;
                                const str = patient.first_name + " " + patient.middle_name + " " + patient.last_name + " - " + patient.id;
                                console.log(str);
                                setState({ id_patient: str });
                            });
                    }
                    if (result.id_doctor && result.id_doctor !== "") {
                        API.get(`doctor/${result.id_doctor}`)
                            .then(res => {
                                const doctor = res.data.result;
                                const str = doctor.first_name + " " + doctor.middle_name + " " + doctor.last_name + " - " + doctor.id;
                                console.log(str);
                                setState({ id_doctor: str });
                            });
                    }
                    setState({
                        payment: result.payment,
                        date: result.date.substring(0, 19),
                        total: result.balance
                    })
                })
            await API.get('PTCDP')
                .then(res => {
                    const result = res.data.result;
                    let data = result.filter(r => r.id_procedure == id);
                    setState({ works: data });
                })
        }

        fetchData();
    }, [])

    return (
        <div>
            <h1>Edit Procedure</h1>
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
                        <th></th>
                    </tr>

                    {state.works.map(work =>
                        <tr>
                            <td>{(work.id_teeth == 1 || work.id_teeth == 2) ? "All Teeth" : work.id_teeth}</td>
                            <td>{work.description}</td>
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

                <button type="submit">SAVE</button>
            </form>
        </div>
    )
}