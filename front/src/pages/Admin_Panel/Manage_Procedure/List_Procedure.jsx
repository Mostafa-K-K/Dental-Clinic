import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import ConfirmDelete from "../../../components/ConfirmDelete"

export default function List_Procedure() {

    const history = useHistory()

    const [procedures, setProcedures] = useState([]);
    const [works, setWorks] = useState([]);

    async function fetchData() {
        await API.get('PDP')
            .then(res => {
                const result = res.data.result;
                setProcedures(result);
            });
        await API.get('PTCDP')
            .then(res => {
                const result = res.data.result;
                setWorks(result);
            });
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
                                <h2><b>Procedures</b></h2>
                            </div>
                        </div>
                        <button className="addnew" onClick={() => history.push({ pathname: '/procedure/create' })}><i className="fa fa-plus"></i> Add New</button>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Tooth</th>
                                <th>Act</th>
                                <th>Price</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procedures.map(procedure =>
                                <tr key={procedure.id}>
                                    <td>{procedure.id}</td>
                                    <td>{procedure.f_n_patient} {procedure.m_n_patient} {procedure.l_n_patient}</td>
                                    <td>{procedure.f_n_doctor} {procedure.m_n_doctor} {procedure.l_n_doctor} </td>
                                    <td>{procedure.date.substring(0, 19).replace("T", " ")}</td>
                                    <td>{procedure.payment}</td>
                                    <td>
                                        {works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <li>{(work.id_teeth == 1 || work.id_teeth == 2) ? "All" : work.id_teeth}</li>
                                        ))}
                                    </td>
                                    <td>
                                        {works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <li>{work.description}</li>
                                        ))}
                                    </td>
                                    <td>
                                        {works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <li>{work.price}</li>
                                        ))}
                                    </td>

                                    <td>
                                        <a
                                            href=""
                                            onClick={() => history.push({ pathname: `/procedure/edit/${procedure.id}` })}
                                            className="settings"
                                            title="Settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>
                                        <ConfirmDelete
                                            path={`procedure/${procedure.id}`}
                                            name="procedure"
                                            fetchData={fetchData}
                                        />
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}