import React, { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import SessionContext from '../../../components/session/SessionContext'

export default function Remove_Request() {

    const { session: { user } } = useContext(SessionContext);
    const id = user.id;

    const history = useHistory();

    const [requests, setRequests] = useState([]);

    async function handleDelete(id) {
        await API.delete(`request/${id}`);
        fetchData();
    }

    async function fetchData() {
        await API.get('request')
            .then(res => {
                let data = res.data.result;
                data = data.filter(res => res.status === "Watting");
                data = data.filter(res => res.id_patient === id)
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
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {requests.map(admin => (
                                <tr key={admin.id}>
                                    <td>{admin.description}</td>
                                    <td>{admin.date}</td>
                                    <td>
                                        <a href="" onClick={() => handleDelete(admin.id)} className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons">&#xE5C9;</i></a>
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