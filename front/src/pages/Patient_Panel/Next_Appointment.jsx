import React, { useEffect, useState, useContext } from "react"
import API from "../../API"
import SessionContext from '../../components/session/SessionContext'

export default function Next_Appointment() {

    let { session: { user } } = useContext(SessionContext);
    let id = user.id;

    const [appointments, setAppointments] = useState([]);

    async function fetchData() {
        await API.get('ACP')
            .then(res => {
                const data = res.data.result;
                let result = data.filter(d => d.status === "Waiting" && d.id_patient == id)
                setAppointments(result);
            })
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
                                <h2><b>Next Appointments</b></h2>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Clinic</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>

                            {appointments.map((appointment, i = 1) => (
                                <tr key={appointment.id}>
                                    <td>{i += 1}</td>
                                    <td>{appointment.date.substring(0, 10)}</td>
                                    <td>{appointment.start_at.substring(0, 5)}</td>
                                    <td>{appointment.end_at.substring(0, 5)}</td>
                                    <td>{appointment.name}</td>
                                    <td>{appointment.description}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}