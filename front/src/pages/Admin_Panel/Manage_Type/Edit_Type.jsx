import React, { useState, useEffect } from "react"
import { useHistory, useParams } from 'react-router'
import API from '../../../API'

export default function Edit_Type() {

    const { id } = useParams();
    const history = useHistory();

    const [state, updateState] = useState({
        description: "",
        bill: "",
        err: ""
    });

    function setState(nextState){
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e){
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let reqBody = state;

        await API.get(`type`)
            .then(async res => {
                const result = res.data.result;
                const isDesc = result.find(r => r.description === state.description && String(r.id) !== String(id));
                if (isDesc) setState({ err: "This type alredy exist" });
                if (!isDesc) {
                    await API.put(`type/${id}`, reqBody);
                    history.push({ pathname: '/type/list' })
                }
            })
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`type/${id}`)
                .then(res => {
                    const data = res.data.result;
                    setState(data)
                });
        }
        fetchData();
    }, []);

    return (
        <div>
            <h1>EDIT TYPE</h1>
            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="description"
                    value={state.description}
                    placeholder="Description"
                    onChange={handleChange}
                />
                <span>{state.err}</span>

                <input
                    type="number"
                    name="bill"
                    value={state.bill}
                    placeholder="Bill"
                    onChange={handleChange}
                />

                <button type="submit">SAVE</button>
            </form>

        </div>
    )
}