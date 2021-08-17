import React, { useState, useEffect } from 'react'
import API from '../API'

export default function Clinics(props) {

    const [clinics, setClinics] = useState([]);

    const fetchdata = async () => {
        await API.get(`clinic`)
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