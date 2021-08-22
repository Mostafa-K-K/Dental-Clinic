import React, { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import moment from "moment"
import SessionContext from '../../../components/session/SessionContext'

export default function Remove_Request() {

    const { session: { user: { id } } } = useContext(SessionContext);

    const [requests, setRequests] = useState([]);

    async function handleDelete(id) {
        try {
            await API.delete(`request/${id}`);
            fetchData();
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function fetchData() {
        try {
            await API.get('request')
                .then(res => {
                    let data = res.data.result;
                    console.log(data);
                    const success = res.data.success;
                    if (success) {
                        data = data.filter(res => res.status === "Watting");
                        data = data.filter(res => res.id_patient === id)
                        setRequests(data);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id])

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
                                <th>Hours</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {requests.map(request => (
                                <tr key={request.id}>
                                    <td>{request.description}</td>
                                    <td>{moment(request.date).format("YYYY-MM-DD")}  &nbsp;&nbsp;&nbsp;</td>
                                    <td>{moment(request.date).format("h:mm A")}  &nbsp;&nbsp;&nbsp;</td>
                                    <td>
                                        <a href="" onClick={() => handleDelete(request.id)} className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons">&#xE5C9;</i></a>
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