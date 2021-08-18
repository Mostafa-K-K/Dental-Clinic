import React, { useState } from "react"
import API from "../../../API"
import moment from "moment"
import { useHistory } from 'react-router'
import Patients from '../../../components/Patients'
import Clinics from "../../../components/Clinics"

export default function Create_Appointment() {

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
        id_patient: "",
        id_clinic: "",
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
        try {
            let arr = state.id_patient.split('-');
            let id = arr[1];

            let reqBody = {
                description: state.description,
                date: state.date,
                start_at: state.start_at,
                end_at: state.end_at,
                status: state.status,
                id_patient: id,
                id_clinic: state.id_clinic,
            };
            await API.get('appointment')
                .then(res => {
                    const data = res.data.result;

                    const isApp = data.find(d => (
                        (
                            (
                                d.data == state.date
                                &&
                                new Date(state.start_at).getTime() > new Date(d.start_at).getTime()
                                &&
                                new Date(state.start_at).getTime() < new Date(d.end_at).getTime()
                            )
                            ||
                            (
                                d.data == state.date
                                &&
                                new Date(state.end_at).getTime() > new Date(d.start_at).getTime()
                                &&
                                new Date(state.end_at).getTime() < new Date(d.end_at).getTime()
                            )
                        )
                        &&
                        (String(d.id_clinic) === String(state.id_clinic))
                    ));

                    if (isApp) setState({ errExist: "Time not available" });
                    if (state.id_patient === "" || !state.id_patient) setState({ err: "select a patient" });

                    if (!isApp && state.id_patient !== "") {
                        API.post('appointment', reqBody);
                        history.push({ pathname: '/appointment/upcoming' })
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <div>
            <h1>Appointmemt</h1>
            <form onSubmit={handleSubmit}>

                <span>{state.err}</span>
                <Patients
                    value={state.id_patient}
                    name="id_patient"
                    onChange={handleChange}
                    resetValue={() => setState({ id_patient: "" })}
                />

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