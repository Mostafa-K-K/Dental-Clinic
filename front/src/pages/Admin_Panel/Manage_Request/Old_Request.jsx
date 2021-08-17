import React, { useState, useEffect } from "react"
import API from "../../../API"

export default function List_Request() {

    const [requests, setRequests] = useState([]);

    async function handleDelete(id) {
        const del = window.confirm("are you sure");
        if (del) await API.delete(`request/${id}`);
        fetchData();
    }

    async function fetchData() {
        await API.get('RP')
            .then(res => {
                let data = res.data.result;
                data = data.filter(res => res.status !== "Watting");
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

                        <button className="addnew" style={{ 'backgroundColor': "red" }} >Delete All</button>
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
                                        <a href="" onClick={() => handleDelete(r.id)} className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons">&#xE5C9;</i></a>
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