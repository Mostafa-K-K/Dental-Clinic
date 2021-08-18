import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router'
import moment from "moment"
import API from "../../../API"

export default function Today_Appointment() {

    const history = useHistory();
    const date = moment().format("YYYY-MM-DD");

    const [appointments, setAppointments] = useState([]);

    async function fetchData() {
        try {
            await API.get('ACP')
                .then(res => {
                    const data = res.data.result;
                    const result = data.filter(d =>
                        d.date.substring(0, 10) == date.substring(0, 10)
                        &&
                        d.status === "Waiting"
                    );
                    setAppointments(result);
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function handleUpdate(id, status) {
        try {
            const del = window.confirm("are you sure");
            if (del) await API.put(`appointment/${id}`, { status: status });
            await fetchData();
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (

        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title row rowspacesp">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2><b>Today's Appointments</b></h2>
                            </div>
                        </div>
                        <button className="addnew" onClick={() => history.push({ pathname: '/appointment/create' })}><i className="fa fa-plus"></i> Add New</button>
                        <button className="addnew" onClick={() => history.push({ pathname: '/appointment/history' })}>History</button>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Clinic</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.first_name} {appointment.middle_name} {appointment.last_name}</td>
                                    <td>{appointment.name}</td>
                                    <td>{appointment.start_at.substring(0, 19).replace("T", " ")}</td>
                                    <td>{appointment.end_at.substring(0, 19).replace("T", " ")}</td>
                                    <td>{appointment.description}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        <a href=""
                                            onClick={() => handleUpdate(appointment.id, "Present")}
                                            className="settings"
                                            title="Settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>
                                        <a href="#"
                                            onClick={() => handleUpdate(appointment.id, "Absent")}
                                            className="delete"
                                            title="Delete"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE5C9;
                                            </i>
                                        </a>

                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}