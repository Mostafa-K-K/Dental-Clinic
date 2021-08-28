import React, { useEffect, useState, useContext } from "react"
import moment from "moment"
import API from "../../../API"
import { useHistory, useParams } from "react-router"
import SessionContext from "../../../components/session/SessionContext"

import Doctors from "../../../components/Doctors"
import Teeth from "../../../components/Teeth"
import Types from "../../../components/Types"

export default function Add_Procedure() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const { id_appointment, id_patient } = useParams();
    const history = useHistory();
    const date = moment().format("YYYY-MM-DDTHH:mm");

    const [state, updateState] = useState({
        patient: "",
        payment: "",
        date: date,
        id_patient: id_patient,
        doctor: "",

        works: [],
        total: 0,

        category: "Adult",
        id_teeth: "",
        types: "",
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
        let id_w;
        (work.length) ?
            id_w = work[work.length - 1].id + 1 :
            id_w = 0;
        try {
            if (state.id_teeth != "" && state.types != "") {


                work.push({
                    id: id_w,
                    teeth: (state.id_teeth == 1 || state.id_teeth == 2) ? "All Teeth" : state.id_teeth,
                    type: state.types.description,
                    id_teeth: state.id_teeth,
                    id_type: state.types.id,
                    price: state.types.bill
                });

                setState({ works: work });

                setState({
                    category: "Adult",
                    id_teeth: "",
                    types: ""
                });

                let total = 0;
                work.map(w => { if (w.price != "") total += parseInt(w.price) });
                setState({ total: total });

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
            let d_id = "";

            if (state.doctor && state.doctor !== '')
                d_id = state.doctor.id;

            let dd = moment(state.date).format("YYYY-MM-DD HH:mm");

            let reqBody = {
                payment: state.payment,
                date: dd,
                id_patient: state.id_patient,
                id_doctor: d_id,
                balance: state.total
            };

            await API.post(`procedure`, reqBody, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
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

                        API.post(`PTC`, PTCReqBody, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        });
                    });
                })
                .then(API.put(`appointment/${id_appointment}`, { status: "Present" }, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                }))
                .then(history.push({ pathname: "/procedure/list" }));
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`patient/${state.id_patient}`, {
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
                        setState({ patient: data.first_name + " " + data.middle_name + " " + data.last_name })
                })
        }
        fetchData();
    }, []);

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

                <h3>{state.id_patient} - {state.patient}</h3>

                <Doctors
                    value={state.doctor}
                    onChange={(event, newValue) => {
                        setState({ doctor: newValue });
                    }}
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
                    value={state.types}
                    onChange={(event, newValue) => {
                        setState({ types: newValue });
                    }}
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