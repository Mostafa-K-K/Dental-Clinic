import React, { useState, useEffect, useContext } from "react"
import API from "../../API"
import moment from "moment"
import SessionContext from '../../components/session/SessionContext'

export default function All_Procedure() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [procedures, setProcedures] = useState([]);
    const [works, setWorks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                await API.get('PTCDP', {
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
                            setWorks(result);
                    });

                await API.get('PDP', {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        const data = result.filter(r => r.id_patient == id);
                        let proc = [];
                        data.map(d =>
                            proc.push({
                                id_procedure: d.id,
                                f_n_doctor: d.f_n_doctor,
                                m_n_doctor: d.m_n_doctor,
                                l_n_doctor: d.l_n_doctor,
                                date: d.date,
                                payment: (d.payment && d.payment != "" && d.payment != 0) ? d.payment : 0
                            })
                        );
                        setProcedures(proc);
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
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
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Hours</th>
                                <th>Doctor</th>
                                <th>Payment</th>
                                <th>Tooth</th>
                                <th>Act</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>

                            {procedures.map((procedure, i = 1) =>
                                <tr>
                                    <td>{i += 1}</td>
                                    <td>{moment(procedure.date).format("YYYY-MM-DD")}  &nbsp;&nbsp;&nbsp;</td>
                                    <td>{moment(procedure.date).format("h:mm A")}  &nbsp;&nbsp;&nbsp;</td>
                                    <td>{procedure.f_n_doctor} {procedure.m_n_doctor} {procedure.l_n_doctor}</td>
                                    <td>{procedure.payment}</td>
                                    <td>
                                        {works.filter(work => work.id_procedure == procedure.id_procedure).map(work => (
                                            <li>{(work.id_teeth == 1 || work.id_teeth == 2) ? "All" : work.id_teeth}</li>
                                        ))}
                                    </td>
                                    <td>
                                        {works.filter(work => work.id_procedure == procedure.id_procedure).map(work => (
                                            <li>{work.description}</li>
                                        ))}
                                    </td>
                                    <td>
                                        {works.filter(work => work.id_procedure == procedure.id_procedure).map(work => (
                                            <li>{work.price}</li>
                                        ))}
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