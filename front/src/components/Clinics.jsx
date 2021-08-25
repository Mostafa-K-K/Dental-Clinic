import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"

export default function Clinics(props) {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [clinics, setClinics] = useState([]);

    const fetchdata = async () => {
        await API.get(`clinic`, {
            headers: {
                id: id,
                token: token,
                isAdmin: isAdmin
            }
        })
            .then(res => {
                const result = res.data.result;
                setClinics(result);
            });
    }

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <div>
            <select
                name={props.name}
                onChange={props.onChange}
            >

                <option
                    value={null}
                    selected={props.value === ""}
                >
                    Clinic
                </option>

                {clinics.map(clinic => (
                    <option
                        key={clinic.id}
                        selected={props.value === clinic.id}
                        value={clinic.id}
                    >
                        {clinic.name}
                    </option>
                ))}

            </select >
        </div>
    );
}