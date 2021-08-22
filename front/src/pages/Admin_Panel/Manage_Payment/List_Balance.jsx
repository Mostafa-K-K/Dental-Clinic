import React, { useEffect, useState } from "react"
import { useHistory } from 'react-router'
import moment from "moment"
import API from "../../../API"

export default function List_Balance() {

    const history = useHistory();

    const [state, updateState] = useState({
        isFetch: true,
        balances: [],
        name: "",
        dateFrom: "",
        dateTo: "",
        max: '',
        min: ''
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

    useEffect(() => {

        async function fetchData() {
            try {

                if (state.isFetch) {
                    await API.get(`maxmindate`)
                        .then(res => {
                            const result = res.data.result;
                            const success = res.data.success;
                            if (success)
                                setState({
                                    dateFrom: result.min.substring(0, 10),
                                    dateTo: result.max.substring(0, 10),
                                    min: result.min.substring(0, 10),
                                    max: result.max.substring(0, 10)
                                });
                        });
                    setState({ isFetch: false });
                }


                let reqBody = {
                    dateFrom: moment(state.dateFrom).add(-1, 'days').format("YYYY-MM-DD"),
                    dateTo: moment(state.dateTo).add(1, 'days').format("YYYY-MM-DD")
                }

                await API.post(`balance`, reqBody)
                    .then(res => {
                        const data = res.data.result;
                        const success = res.data.success;
                        if (success) {
                            console.log(data);
                            if (state.name && state.name != "") {
                                let length = state.name.length;
                                let result = data.filter(d =>
                                    ((d.first_name.substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                    ||
                                    ((d.last_name.substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                    ||
                                    (((d.first_name + " " + d.last_name).substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                    ||
                                    (((d.first_name + " " + d.middle_name + " " + d.last_name).substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                    ||
                                    (d.id == parseInt(state.name))
                                );
                                setState({ balances: result });
                            } else {
                                setState({ balances: data });
                            }
                        }
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [JSON.stringify([state.name, state.dateFrom, state.dateTo])])

    return (
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title row rowspacesp">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2><b>Balances</b></h2>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input
                            type="search"
                            placeholder="Search"
                            className="form-control"
                            name="name"
                            value={state.name}
                            onChange={handleChange}
                        />
                    </div>
                    <input
                        type="date"
                        value={state.dateFrom}
                        name="dateFrom"
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        value={state.dateTo}
                        name="dateTo"
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setState({
                                dateFrom: state.min,
                                dateTo: state.max
                            })
                        }}
                    > Reset </button>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>balance</th>
                                <th>Payment</th>
                                <th>Remaining</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>

                            {state.balances.map(balance => (
                                <tr key={balance.id}>
                                    <td>{balance.id}</td>
                                    <td>{balance.first_name} {balance.middle_name} {balance.last_name}</td>
                                    <td>{balance.balance}</td>
                                    <td>{balance.payment}</td>
                                    <td>{balance.balance - balance.payment}</td>
                                    <td>
                                        {((balance.balance && balance.balance != 0) || (balance.payment && balance.payment != 0)) ?
                                            <a href=""
                                                onClick={() => history.push({ pathname: `/balance/details/${balance.id}` })}
                                                className="settings"
                                                title="Settings"
                                                data-toggle="tooltip"
                                            >
                                                <i className="material-icons">
                                                    &#xE8B8;
                                                </i>
                                            </a>
                                            : null
                                        }
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}