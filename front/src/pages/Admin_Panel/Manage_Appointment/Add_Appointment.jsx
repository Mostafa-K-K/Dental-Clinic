import React, { useEffect, useState } from "react"
import API from "../../../API"
import moment from "moment"
import { useHistory, useParams } from 'react-router'
import Clinics from "../../../components/Clinics"

export default function Add_Appointment() {

    const { id, id_patient } = useParams();
    const history = useHistory();
    const date = moment().format("YYYY-MM-DD");
    const date_start = moment().format("hh:mm");
    const date_end = moment().add(1, 'hours').format("hh:mm")

    const [state, updateState] = useState({
        description: "",
        date: date,
        start_at: date_start,
        end_at: date_end,
        status: 'Waiting',
        id_patient: id_patient,
        id_clinic: "",
        patient: "",
        err: "",
        errExist: ""
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
            description: state.description,
            date: state.date,
            start_at: state.start_at,
            end_at: state.end_at,
            status: state.status,
            id_patient: state.id_patient,
            id_clinic: state.id_clinic,
        };

        try {
            await API.get('appointment')
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success) {

                        let isApp = data.find(d => (
                            (
                                (
                                    (
                                        moment(state.start_at, "HH:mm").format('h:mm A')
                                        >
                                        moment(d.start_at, "HH:mm").format('h:mm A')
                                    )
                                    &&
                                    (
                                        moment(state.start_at, "HH:mm").format('h:mm A')
                                        <
                                        moment(d.end_at, "HH:mm").format('h:mm A')
                                    )
                                )
                                ||
                                (
                                    (
                                        moment(state.end_at, "HH:mm").format('h:mm A')
                                        >
                                        moment(d.start_at, "HH:mm").format('h:mm A')
                                    )
                                    &&
                                    (
                                        moment(state.end_at, "HH:mm").format('h:mm A')
                                        <
                                        moment(d.end_at, "HH:mm").format('h:mm A')
                                    )
                                )
                            )
                            &&
                            (
                                (
                                    moment(d.date).format("YYYY-MM-DD")
                                    ===
                                    moment(state.date).format("YYYY-MM-DD")
                                )
                                &&
                                (
                                    String(d.id_clinic) === String(state.id_clinic)
                                )
                            )
                        ));

                        if (isApp) setState({ errExist: "Time not available" });
                        if (state.id_patient === "" || !state.id_patient) setState({ err: "select a patient" });

                        if (!isApp && state.id_patient !== "") {
                            API.post('appointment', reqBody)
                                .then(API.put(`request/${id}`, { status: "Accepted" }))
                                .then(history.push({ pathname: '/appointment/upcoming' }))
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`patient/${id_patient}`)
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success)
                        setState({ patient: data.first_name + " " + data.middle_name + " " + data.last_name });
                })
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>Appointmemt</h1>
            <form onSubmit={handleSubmit}>

                <h3>{state.id_patient} - {state.patient}</h3>

                <span>{state.err}</span>

                <Clinics
                    name="id_clinic"
                    value={state.id_clinic}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    value={state.description}
                    placeholder="Description"
                    onChange={handleChange}
                />

                <input
                    required
                    type="date"
                    name="date"
                    value={state.date}
                    onChange={handleChange}
                />

                <input
                    required
                    type="time"
                    name="start_at"
                    value={state.start_at}
                    onChange={handleChange}
                />

                <input
                    required
                    type="time"
                    name="end_at"
                    value={state.end_at}
                    onChange={handleChange}
                />
                <span>{state.errExist}</span>

                <button type="submit">ADD</button>
            </form>
        </div>
    );
}