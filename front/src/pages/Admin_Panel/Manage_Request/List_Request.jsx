import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"

export default function List_Request() {

    let history = useHistory();
    const [requests, setRequests] = useState([]);

    async function handleAccept(id, id_patient) {
        await history.push({ pathname: `/create/appointment/patient/${id}/${id_patient}` });
    }

    async function handleReject(id) {
        const del = window.confirm("are you sure");
        if (del) await API.put(`request/${id}`, { status: "Rejected" });
        fetchData();
    }

    async function fetchData() {
        await API.get('RP')
            .then(res => {
                let data = res.data.result;
                data = data.filter(res => res.status === "Watting");
                setRequests(data);
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
                                <th>Status</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {requests.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.first_name} {r.middle_name} {r.last_name}</td>
                                    <td>{r.description}</td>
                                    <td>{r.date}</td>
                                    <td>{r.status}</td>
                                    <td>
                                        <a
                                            href="#"
                                            onClick={() => handleAccept(r.id, r.id_patient)}
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
                                            onClick={() => handleReject(r.id)}
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