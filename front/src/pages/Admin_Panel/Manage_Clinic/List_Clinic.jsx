import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import SessionContext from "../../../components/session/SessionContext"

import ConfirmDelete from "../../../components/ConfirmDelete"

export default function List_Clinic() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory()

    const [clinics, setClinics] = useState([]);

    async function fetchData() {
        try {
            await API.get('clinic', {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success)
                        setClinics(result);
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
                                <h2><b>Clinics</b></h2>
                            </div>
                        </div>
                        <button className="addnew" onClick={() => history.push({ pathname: '/clinic/create' })}><i className="fa fa-plus"></i> Add New</button>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {clinics.map(clinic => (
                                <tr key={clinic.id}>
                                    <td>{clinic.id}</td>
                                    <td>{clinic.name}</td>
                                    <td>
                                        <a href=""
                                            onClick={() => history.push({ pathname: `/clinic/edit/${clinic.id}` })}
                                            className="settings"
                                            title="Settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>
                                        <ConfirmDelete
                                            path={`clinic/${clinic.id}`}
                                            name="clinic"
                                            fetchData={fetchData}
                                        />
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