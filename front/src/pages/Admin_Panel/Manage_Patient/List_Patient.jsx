import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import API from '../../../API'
import ConfirmDelete from '../../../components/ConfirmDelete'

export default function List_Patient() {

    const history = useHistory();

    const [state, updateState] = useState({
        patients: [],
        rows: 0,
        pages: 0,
        nbPatient: 0,
        page: 1,
        pagination: [],
        orderBy: "id",
        desc: false,

        name: "",
        gender: "Male",
        marital: "Single"
    });

    function setState(nextState){
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e){
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function fetchData() {

        let reqBody = {
            rows: state.rows,
            orderBy: state.orderBy,
            desc: state.desc,
            name: state.name
        }

        await API.post(`paginpatient`, reqBody)
            .then(res => {
                const data = res.data.result;
                setState({ patients: data });
            });

        await API.post(`patientcount`, reqBody)
            .then(res => {
                const result = res.data.result;
                setState({ nbPatient: result });
                let pages = Math.ceil(result / 10);
                setState({ pages: pages });

                if (pages !== state.pages) {

                    setState({
                        page: 1,
                        rows: 0
                    });

                    if (pages >= 10) {
                        setState({ pagination: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
                    } else {
                        var i = 1;
                        let arr = [];
                        while (i <= pages) {
                            arr.push(i);
                            i++;
                        }
                        setState({ pagination: arr });
                    }
                }
            });
    }

    async function handlePagination(pg) {
        if ((pg >= 1) && (pg <= state.pages)) {
            setState({ page: pg });
            setState({ rows: (pg - 1) * 10 });

            let arr = [];
            if (pg > state.pagination[9]) {

                state.pagination.forEach(i => {
                    arr.push(i + 1);
                })
                setState({ pagination: arr });
            }

            if (pg < state.pagination[0]) {
                state.pagination.forEach(i => {
                    arr.push(i - 1);
                })
                setState({ pagination: arr });
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(state)]);

    return (
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title row rowspacesp">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2><b>Patients</b></h2>
                            </div>
                        </div>
                        <button className="addnew" onClick={() => history.push({ pathname: '/patient/create' })}><i className="fa fa-plus"></i> Add New</button>
                    </div>

                    <div>
                        <input
                            type="search"
                            placeholder="Search"
                            className="form-control"
                            name="name"
                            value={state.name}
                            onChange={handleChange}
                        />
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>
                                    <a href="#" onClick={() => setState({ orderBy: "id" })}>
                                        #
                                    </a>
                                    {(state.orderBy === "id") ?
                                        <a href="#" onClick={() => (state.desc) ? setState({ desc: false }) : setState({ desc: true })}>
                                            {(state.desc) ?
                                                <i className='fas fa-angle-down'></i> :
                                                <i className='fas fa-angle-up'></i>
                                            }
                                        </a>
                                        : null}
                                </th>
                                <th>
                                    <a href="#" onClick={() => setState({ orderBy: "first_name" })}>
                                        Full Name
                                    </a>
                                    {(state.orderBy === "first_name") ?
                                        <a href="#" onClick={() => (state.desc) ? setState({ desc: false }) : setState({ desc: true })}>
                                            {(state.desc) ?
                                                <i className='fas fa-angle-down'></i> :
                                                <i className='fas fa-angle-up'></i>
                                            }
                                        </a> :
                                        null}
                                </th>
                                <th>Gender</th>
                                <th>Marital</th>
                                <th>Birth</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Health</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {state.patients.map(patient => (
                                <tr key={patient.id}>
                                    <td>{patient.id}</td>
                                    <td>{patient.first_name} {patient.middle_name} {patient.last_name}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.marital}</td>
                                    <td>{patient.birth.substring(0, 10)}</td>
                                    <td>{patient.phone}</td>
                                    <td>{patient.address}</td>
                                    <td>{patient.health}</td>
                                    <td>
                                        <a href=""
                                            onClick={() => history.push({ pathname: `/patient/edit/${patient.id}` })}
                                            className="settings"
                                            title="Settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>
                                        <ConfirmDelete
                                            path={`patient/${patient.id}`}
                                            name="patient"
                                            fetchData={fetchData}
                                        />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <div className="clearfix">
                        <div className="hint-text">Showing <b>{(state.rows + 10 > state.nbPatient) ? state.nbPatient : state.rows + 10}</b> of <b>{state.nbPatient}</b> patients</div>

                        <ul className="pagination">
                            <li className="page-item"><button onClick={() => handlePagination(state.page - 1)} className="page-link">Previous</button></li>
                            {state.pagination.map(pg =>
                                <li key={pg} className={(state.page === pg) ? "page-item active" : "page-item"}>
                                    <button onClick={() => handlePagination(pg)} className="page-link">
                                        {pg}
                                    </button>
                                </li>
                            )}
                            <li className="page-item"><button onClick={() => handlePagination(state.page + 1)} className="page-link">Next</button></li>
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    )
}