import React, { useState, useEffect } from "react"
import API from "../API";

export default function Types(props) {

    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            await API.get(`type`)
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