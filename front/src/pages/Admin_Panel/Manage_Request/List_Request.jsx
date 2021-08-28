import React, { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import moment from "moment"
import SessionContext from "../../../components/session/SessionContext"

export default function List_Request() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    let history = useHistory();
    const [requests, setRequests] = useState([]);

    async function handleAccept(id_req, id_patient) {
        const del = window.confirm("are you sure");
        if (del) await history.push({ pathname: `/create/appointment/patient/${id_req}/${id_patient}` });
    }

    async function handleReject(id_req) {
        try {
            const del = window.confirm("are you sure");
            if (del) await API.put(`request/${id_req}`, { status: "Rejected" }, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            });
            fetchData();
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function fetchData() {
        try {
            await API.get('RP', {
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
                        data = data.filter(res => res.status === "Watting");
                        setRequests(data);
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
                                <h2><b>Request</b></h2>
                            </div>
                        </div>
                        <button className="addnew" onClick={() => history.push({ pathname: '/request/old' })}>History</button>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Status</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {requests.map(request => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.first_name} {request.middle_name} {request.last_name}</td>
                                    <td>{request.description}</td>
                                    <td>{moment(request.date).format("YYYY-MM-DD")}  &nbsp;&nbsp;&nbsp;</td>
                                    <td>{moment(request.date).format("h:mm A")}  &nbsp;&nbsp;&nbsp;</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <a
                                            href="#"
                                            onClick={() => handleAccept(request.id, request.id_patient)}
                                            className="settings"
                                            title="settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>

                                        <a
                                            href="#"
                                            onClick={() => handleReject(request.id)}
                                            className="delete" title="Delete"
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