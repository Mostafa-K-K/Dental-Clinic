import React, { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import { Link } from "react-router-dom"
import moment from "moment"
import SessionContext from "../../../components/session/SessionContext"

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Container,
    Paper,
    CssBaseline,
    makeStyles,
    Typography
} from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%"
    },
    deleteIcon: {
        fill: "#ed4f1c",
        "&:hover": {
            fill: "#e24414"
        },
        marginLeft: "1%"
    }
}));

export default function Remove_Request() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [requests, setRequests] = useState([]);

    async function handleDelete(id_req) {
        try {
            await API.delete(`request/${id_req}`, {
                headers: {
                    id: id,
                    token: token
                }
            });
            fetchData();
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function fetchData() {
        try {
            await API.get('request', {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        let result = data.filter(r => r.status === "Waiting");
                        result = result.filter(r => r.id_patient == id);
                        setRequests(result);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <CssBaseline />

            <Typography variant="h3" align="center" className="titlePage">
                Requests
            </Typography>

            <Container className={classes.container}>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>

                        {(requests.length) ?
                            <TableBody>
                                {requests.map(request =>
                                    <TableRow key={request.id}>

                                        <TableCell>
                                            {moment(request.date).format("YYYY-MM-DD")}
                                        </TableCell>

                                        <TableCell>
                                            {moment(request.date).format("h:mm A")}
                                        </TableCell>

                                        <TableCell>
                                            {request.description}
                                        </TableCell>

                                        <TableCell align="center" className={classes.divRow}>
                                            <Link onClick={() => handleDelete(request.id)}>
                                                <DeleteIcon className={classes.deleteIcon} />
                                            </Link>
                                        </TableCell>

                                    </TableRow>
                                )}
                            </TableBody>
                            :
                            <Typography variant="h6" align="center">
                                You don't have any request yet
                            </Typography>
                        }

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}