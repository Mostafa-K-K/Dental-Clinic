import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";
import API from "../../API";

export default function Number_Patient() {

    const history = useHistory();
    const [number, setNumber] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await API.post(`intialpatient`, { number: number });
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