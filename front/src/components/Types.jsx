import React, { useState, useEffect, useContext } from "react"
import API from "../API"
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Types(props) {

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await API.get(`type`, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    setTypes(result);
                })
        }

        fetchData();
    }, [props.value])

    return (
        <Autocomplete
            variant="outlined"
            options={types}
            getOptionLabel={(option) => option.description}
            value={props.value != "" ? types.find(t => t.id == props.value) : null}
            onChange={props.onChange}
            renderInput={(params) =>
                <TextField
                    {...params}
                    variant="outlined"
                    label="Acts"
                    className={props.className}
                />
            }
        />
    )
}