import React, { useState, useContext } from "react"
import API from "../../../API"
import moment from "moment"
import { useHistory } from "react-router-dom";
import SessionContext from '../../../components/session/SessionContext'

export default function Create_Request() {

    const { session: { user } } = useContext(SessionContext);
    const id = user.id;

    const history = useHistory();
    const date = moment().format("YYYY-MM-DD hh:mm:ss");

    const [state, updateState] = useState({
        description: "",
        date: date,
        status: "Watting",
        id_patient: id
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let reqBody = state;
        await API.post(`request`, reqBody);
        await history.push({ pathname: "/patient/panel" })
    }

    return (
        <div>
            <h1>ADD REQUEST</h1>
            <form onSubmit={handleSubmit}>

                <textarea
                    name="description"
                    value={state.description}
                    placeholder="Description"
                    onChange={handleChange}
                />

                <button type="submit">ADD</button>
            </form>

        </div>
    )
}