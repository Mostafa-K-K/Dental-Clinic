import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import API from "../../API"
import SessionContext from "../../components/session/SessionContext"

export default function Number_Patient() {

    const history = useHistory();
    const [number, setNumber] = useState("");

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await API.post(`intialpatient`, { number: number }, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            });
            await history.push({ pathname: "/admin/panel" });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`patient`)
                .then(res => {
                    const data = res.data.result;
                    if (data && data.length)
                        history.push({ pathname: '/admin/panel' });
                });
        }
        fetchData();
    }, [])

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={number}
                    placeholder="Number Patients"
                    onChange={(e) => setNumber(e.target.value)}
                />
                <button
                    type="submit"
                >
                    Create
                </button>
            </form>
        </div>
    )
}