import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export default function Patients(props) {


    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [patients, setPatients] = useState([]);
    const [patient, setPatient] = useState({ });

    useEffect(() => {

        async function fetchdata() {
            if (!patients.length)
                await API.get(`patient`, {
                    headers: {
                        id: id,
                        token: token
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        let data = result.find(p => p.id == props.value)
                        setPatients(result);
                        setPatient(data)
                        console.log(result);
                        console.log(data);
                        console.log(props);
                    });
        }
        fetchdata();
    }, []);

    return (
        <>
            <Autocomplete
                options={patients}
                getOptionLabel={(option) => option.first_name + " " + option.middle_name + " " + option.last_name + " - " + option.id}

                // defaultvalue={patient}
                // defaultValue={{ address: "Tripoli", birth: "2021-08-30T21:00:00.000Z", first_name: "Bara'a", gender: "Female", health: "Null", id: 1, last_name: "Nasser", marital: "Married", middle_name: "Bilal", password: "$2a$10$kUxMpEgDJXBGBz4nGoLageEkvu0heGz1S1Zz.SlADe6ntsQI1naX6", phone: "111541", role_id: "paTI__enT?/@cc!untQq", token: null, username: "bara'a@n" }}
                onChange={props.onChange}
                renderInput={(params) =>
                    <TextField
                        fullWidth
                        required
                        defaultvalue={null}
                        {...params}
                        variant="outlined"
                        label="Patient"
                        className={props.className}
                    />
                }
            />
        </>
    );
}