import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export default function Patients(props) {


    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [patients, setPatients] = useState([]);

    useEffect(() => {

        async function fetchData() {
            await API.get(`patient`, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    setPatients(result);
                });
        }
        fetchData();
    }, [props.value]);

    return (
        <Autocomplete
            options={patients}
            getOptionLabel={(option) => option.first_name + " " + option.middle_name + " " + option.last_name + " - " + option.id}
            value={props.value != "" ? patients.find(p => p.id == props.value) : null}
            onChange={props.onChange}
            renderInput={(params) =>
                <TextField
                    fullWidth
                    required
                    {...params}
                    variant="outlined"
                    label="Patient"
                    className={props.className}
                />
            }
        />
    );
}