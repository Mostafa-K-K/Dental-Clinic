import React, { useState, useEffect, useContext } from "react"
import API from "../../API"
import SessionContext from '../../components/session/SessionContext'

export default function Patient_Panel() {

    const { session: { user: { id } } } = useContext(SessionContext);

    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        console.log({ id });
        async function fetchData() {
            await API.post(`balance`)
                .then(res => {
                    let data = res.data.result;
                    const result = data.find(d => d.id == id);
                    console.log(result);
                    let balance = (result.balance) ? result.balance : 0;
                    let payment = (result.payment) ? result.payment : 0;
                    setRemaining(balance - payment);
                });
        }
        fetchData();
    }, [])

    return <h1>Remaining : {remaining}</h1>
}