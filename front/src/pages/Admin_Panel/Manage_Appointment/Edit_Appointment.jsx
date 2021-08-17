import React, { useState, useEffect } from "react"
import API from "../../../API"
import { useHistory, useParams } from 'react-router'
import Patients from '../../../components/Patients'
import Clinics from "../../../components/Clinics"

export default function Edit_Appointment() {

    const history = useHistory();
    const { id } = useParams();

    const [state, updateState] = useState({
        description: "",
        start_at: "",
        end_at: "",
        status: "",
        id_patient: "",
        id_clinic: "",
        err: "",
        errExist: ""
    });

    function setState(nextState){
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e){
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        let arr = state.id_patient.split('-');
        let id_p = arr[1];

        let reqBody = {
            description: state.description,
            start_at: state.start_at,
            end_at: state.end_at,
            status: state.status,
            id_patient: id_p,
            id_clinic: state.id_clinic,
        };

        await API.get('appointment')
            .then(res => {
                const data = res.data.result;

                const isApp = data.find(d => (
                    ((state.start_at > d.start_at && state.start_at < d.end_at)
                        ||
                        (state.end_at > d.start_at && state.end_at < d.end_at))
                    &&
                    (String(d.id_clinic) === String(state.id_clinic))
                    &&
                    (String(d.id) !== String(id))
                ));

                if (isApp) setState({ errExist: "Time not available" });
                if (state.id_patient === "" || !state.id_patient) setState({ err: "select a patient" });

                if (!isApp && state.id_patient !== "") {
                    API.put(`appointment/${id}`, reqBody);
                    history.push({ pathname: '/appointment/list' })
                }
            });
    }


    useEffect(() => {
        async function fetchData() {
            await API.get('ACP')
                .then(res => {
                    const data = res.data.result;
                    const result = data.find(d => String(d.id) === String(id))
                    setState({
                        description: result.description,
                        start_at: result.start_at.substring(0, 16),
                        end_at: result.end_at.substring(0, 16),
                        status: result.status,
                        id_patient: result.first_name + " " + result.middle_name + " " + result.last_name + "-" + result.id_patient,
                        id_clinic: result.id_clinic,
                    });
                })
        }
        fetchData();
    }, [])


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
                    type="datetime-local"
                    name="start_at"
                    value={state.start_at}
                    onChange={handleChange}
                />

                <input
                    required
                    type="datetime-local"
                    name="end_at"
                    value={state.end_at}
                    onChange={handleChange}
                />
                <span>{state.errExist}</span>

                <button type="submit">Save</button>
            </form>
        </div>
    );
}