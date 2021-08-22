import React, { useEffect, useState, useContext } from "react"
import API from "../../API"
import moment from "moment"
import SessionContext from '../../components/session/SessionContext'

export default function Next_Appointment() {

    const { session: { user: { id } } } = useContext(SessionContext);

    const [appointments, setAppointments] = useState([]);

    async function fetchData() {
        try {
            await API.get('ACP')
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        let result = data.filter(d => d.status === "Waiting" && d.id_patient == id);
                        setAppointments(result);
                    }
                });
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
                                    <td>{moment(appointment.date).format("YYYY-MM-DD")}</td>
                                    <td>{moment(appointment.start_at, "HH:mm").format('h:mm A')}</td>
                                    <td>{moment(appointment.end_at, "HH:mm").format('h:mm A')}</td>
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