import React, { useEffect, useState, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import API from "../../../API"
import SessionContext from "../../../components/session/SessionContext"

import Teeth from "../../../components/Teeth"
import Types from "../../../components/Types"
import moment from "moment"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Edit_Procedure() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory();
    const { id: id_pro } = useParams();

    const [state, updateState] = useState({
        payment: "",
        date: "",
        id_patient: "",
        id_doctor: "",

        patients: [],
        doctors: [],
        acts: [],

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
        let id;
        (work.length) ?
            id = work[work.length - 1].id + 1 :
            id = 0;

        try {
            if (state.id_teeth != "" && state.types != "") {

                work.push({
                    id: id,
                    teeth: (state.id_teeth == 1 || state.id_teeth == 2) ? "All Teeth" : state.id_teeth,
                    description: state.types.description,
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
        let w = work.find(r => r.id == id);
        w.price = value;
        setState({ works: work });

        let total = 0;
        work.map(w => { if (w.price != "") total += parseInt(w.price) });
        setState({ total: total });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        console.log(state);
        console.log("ddddata",state.patients.find(p => p.id == state.id_patient));
        // try {

        //     let dd = moment(state.date).format("YYYY-MM-DD HH:mm");

        //     let reqBody = {
        //         payment: state.payment,
        //         date: dd,
        //         id_patient: state.id_patient,
        //         id_doctor: state.id_doctor,
        //         balance: state.total
        //     };

        //     await API.put(`procedure/${id_pro}`, reqBody, {
        //         headers: {
        //             id: id,
        //             token: token,
        //             isAdmin: isAdmin
        //         }
        //     })
        //         .then(
        //             API.delete(`PTCALL/${id_pro}`, {
        //                 headers: {
        //                     id: id,
        //                     token: token,
        //                     isAdmin: isAdmin
        //                 }
        //             })
        //         )
        //         .then(
        //             state.works.map(work => {
        //                 let PTCReqBody = {
        //                     id_procedure: id_pro,
        //                     id_type: work.id_type,
        //                     id_teeth: work.id_teeth,
        //                     price: (work.price == "" || !work.price) ? 0 : work.price
        //                 };
        //                 API.post(`PTC`, PTCReqBody, {
        //                     headers: {
        //                         id: id,
        //                         token: token,
        //                         isAdmin: isAdmin
        //                     }
        //                 });
        //             })
        //         )
        //         .then(history.push({ pathname: "/procedure/list" }));
        // } catch (e) {
        //     console.log("ERROR", e);
        // }

    }

    useEffect(() => {
        async function fetchData() {
            try {

                await API.get(`procedure/${id_pro}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        const success = res.data.success;
                        if (success) {
                            setState({
                                id_patient: result.id_patient,
                                id_doctor: result.id_doctor,
                                payment: result.payment,
                                date: moment(result.date).format("YYYY-MM-DDTHH:mm"),
                                total: result.balance
                            });
                        }
                    });

                await API.get('PTCDP', {
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
                            data = data.filter(r => r.id_procedure == id_pro);
                            setState({ works: data });
                        }
                    });

                await API.get(`patient`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        setState({ patients: result });
                    });


                await API.get(`doctor`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        setState({ doctors: result });
                    });


                await API.get(`type`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        setState({ acts: result });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            {console.log("page", state)}
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

                <Autocomplete
                    options={state.patients}
                    getOptionLabel={(option) => option.first_name + " " + option.middle_name + " " + option.last_name + " - " + option.id}
                    defaultValue={state.id_patient != "" ? state.patients.find(p => p.id == state.id_patient) : ""}
                    onChange={(event, newValue) => {
                        setState({ id_patient: newValue ? newValue.id : "" });
                    }}
                    renderInput={(params) =>
                        <TextField
                            required
                            fullWidth
                            {...params}
                            variant="outlined"
                            label="Patient"
                        />
                    }
                />

                <Autocomplete
                    options={state.doctors}
                    defaultValue={state.id_doctor != "" ? state.doctors.find(d => d.id == state.id_doctor) : ""}
                    getOptionLabel={(option) => option.first_name + " " + option.middle_name + " " + option.last_name}
                    variant="outlined"
                    onChange={(event, newValue) => {
                        setState({ id_doctor: newValue ? newValue.id : "" });
                    }}
                    renderInput={(params) =>
                        <TextField
                            fullWidth
                            {...params}
                            variant="outlined"
                            label="Doctor"
                        />
                    }
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