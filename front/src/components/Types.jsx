import React, { useState, useEffect, useContext } from "react"
import API from "../API"
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Types(props) {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await API.get(`type`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    const result = res.data.result;
                    setTypes(result);
                })
        }

        fetchData();
    }, [])

    return (
        <Autocomplete
            variant="outlined"
            options={types}
            getOptionLabel={(option) => option.description}
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