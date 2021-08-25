import React, { useState, useEffect, useContext } from "react"
import API from "../API"
import SessionContext from "./session/SessionContext"

export default function Teeth(props) {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [teeth, setTeeth] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let reqBody = {
                category: props.category
            }

            await API.post(`tooth`, reqBody, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    const result = res.data.result;
                    setTeeth(result)

                })
        }

        fetchData();
    }, [props.category])

    return (
        <select
            name={props.name}
            onChange={props.onChange}
        >
            <option value="" selected={props.value === ""}>Tooth</option>

            {teeth.map(tooth =>
                <option
                    key={tooth.id}
                    value={tooth.id}
                    selected={parseInt(tooth.id) === parseInt(props.value)}
                >
                    {(parseInt(tooth.id) === 1 || parseInt(tooth.id) === 2) ? "All Teeth" : tooth.id}
                </option>
            )}

        </select>
    )
}