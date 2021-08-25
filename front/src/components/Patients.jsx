import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"

export default function Patients(props) {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [patients, setPatients] = useState([]);

    async function fetchdata() {
        await API.get(`patient`, {
            headers: {
                id: id,
                token: token,
                isAdmin: isAdmin
            }
        })
            .then(res => {
                const result = res.data.result;
                let data = [];
                result.map(res =>
                    data.push({
                        id: res.id,
                        name: res.first_name + " " + res.middle_name + " " + res.last_name
                    })
                )
                setPatients(data);
            });
    }

    function handleBlur(value) {
        let isTrue = patients.filter(p => p.name + " - " + p.id === value)
        if (!isTrue.length) {
            props.resetValue();
        }
    }

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <div>
            <input
                required
                list="patient"
                name={props.name}
                value={props.value}
                placeholder="Patient"
                onChange={props.onChange}
                onBlur={e => handleBlur(e.target.value)}
            />

            <datalist
                id="patient"
            >

                {patients.map(patient =>
                    <option key={patient.id}>
                        {patient.name} - {patient.id}
                    </option>
                )}

            </datalist>
        </div>
    );
}