import React, { useState, useEffect, useContext } from "react"
import API from "../API"
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Teeth(props) {

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [teeth, setTeeth] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (props.category && props.category != "") {
                let reqBody = {
                    category: props.category
                }
                await API.post(`tooth`, reqBody, {
                    headers: {
                        id: id,
                        token: token
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        setTeeth(result);
                    });
            } else {
                setTeeth([]);
            }
        }
        fetchData();
    }, [JSON.stringify(props.category, props.value)])

    return (
        <Autocomplete
            id="teethValue"
            options={teeth}
            getOptionLabel={(option) => (option.id) ? ((option.id == 1 || option.id == 2) ? "All Teeth" : (option.id).toString()) : null}
            value={props.value != "" ? teeth.find(t => t.id == props.value) : null}
            variant="outlined"
            onChange={props.onChange}
            renderInput={(params) =>
                <TextField
                    fullWidth
                    {...params}
                    variant="outlined"
                    label="Tooth"
                    className={props.className}
                />
            }
        />
    )
}