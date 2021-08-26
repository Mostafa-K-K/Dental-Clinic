import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

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
                result.map(p =>
                    data.push({
                        id: p.id,
                        name: p.first_name + " " + p.middle_name + " " + p.last_name + " - " + p.id
                    })
                )
                setPatients(data);
            });
    }

    useEffect(() => {
        fetchdata();
    }, []);

    return (
        <Autocomplete
            id="id_patient"
            options={patients}
            getOptionLabel={(option) => option.name} variant="outlined"
            value={props.value}
            onChange={props.onChange}
            renderInput={(params) =>
                <TextField
                    required
                    fullWidth
                    {...params}
                    variant="outlined"
                    label="Patient"
                    className={props.className}
                />
            }
        />
    );
}