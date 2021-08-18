import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import ConfirmDelete from "../../../components/ConfirmDelete"

export default function List_Type() {

    const history = useHistory()

    const [types, setTypes] = useState([]);

    async function fetchData() {
        try {
            await API.get('type')
                .then(res => {
                    const result = res.data.result;
                    setTypes(result);
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
                                <h2><b>Types</b></h2>
                            </div>
                        </div>
                        <button className="addnew" onClick={() => history.push({ pathname: '/type/create' })}><i className="fa fa-plus"></i> Add New</button>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Description</th>
                                <th>Bill</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {types.map(type => (
                                <tr key={type.id}>
                                    <td>{type.id}</td>
                                    <td>{type.description}</td>
                                    <td>{type.bill}</td>
                                    <td>
                                        <a href=""
                                            onClick={() => history.push({ pathname: `/type/edit/${type.id}` })}
                                            className="settings"
                                            title="Settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>

                                        <ConfirmDelete
                                            path={`type/${type.id}`}
                                            name="type"
                                            fetchData={fetchData}
                                        />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}