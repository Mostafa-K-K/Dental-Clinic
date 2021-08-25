import React, { useState, useEffect, useContext } from "react"
import API from "../API"
import SessionContext from "./session/SessionContext"

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
        <select
            name={props.name}
            onChange={props.onChange}
        >
            <option value="" selected={props.value === ""}>Type</option>

            {types.map(type =>
                <option
                    key={type.id}
                    value={type.id}
                    selecte={props.value === type.id}
                >
                    {type.description}
                </option>
            )}

        </select>
    )
}