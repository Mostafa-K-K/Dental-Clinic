import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Clinics(props) {

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [clinics, setClinics] = useState([]);

    useEffect(() => {

        async function fetchData() {
            await API.get(`clinic`, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    setClinics(result);
                });

        }

        fetchData();
    }, [props.value]);

    return (
        <Autocomplete
            variant="outlined"
            options={clinics}
            getOptionLabel={(option) => option.name}
            onChange={props.onChange}
            value={props.value != "" ? clinics.find(c => c.id == props.value) : null}
            renderInput={(params) =>
                <TextField
                    required
                    {...params}
                    variant="outlined"
                    label="Clinic"
                    className={props.className}
                />
            }
        />
    );
}