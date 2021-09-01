import React, { useEffect, useState, useContext } from "react"
import API from "../../API"
import moment from "moment"
import SessionContext from '../../components/session/SessionContext'

import {
    TableContainer,
    Table,
    TableCell,
    TableRow,
    Container,
    Paper,
    CssBaseline,
    makeStyles,
    Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: 5,
        marginBottom: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
}));

export default function Next_Appointment() {

    const classes = useStyles();
    const date = moment().format("YYYY-MM-DD");

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [appointment, setAppointment] = useState("");

    useEffect(() => {

        async function fetchData() {
            try {
                await API.get('ACP', {
                    headers: {
                        id: id,
                        token: token
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        const success = res.data.success;
                        if (success) {
                            let result = data.filter(d => d.status === "Waiting" && d.id_patient == id && date <= moment(d.date).format("YYYY-MM-DD"));
                            setAppointment(result[0]);
                        }
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }

        fetchData();
    }, [])

    return (
        <>
            <CssBaseline />

            <Typography variant="h3" align="center" className="titlePage">
                Next Appointment
            </Typography>

            <Container className={classes.container}>

                <TableContainer component={Paper} style={{ marginTop: 20, width: 400 }}>

                    {(appointment) ?
                        <Table>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>{moment(appointment.date).format("YYYY-MM-DD")}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Start</TableCell>
                                <TableCell>{moment(appointment.start_at, "HH:mm").format('h:mm A')}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>End</TableCell>
                                <TableCell>{moment(appointment.end_at, "HH:mm").format('h:mm A')}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Clinic</TableCell>
                                <TableCell>{appointment.name}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{appointment.description}</TableCell>
                            </TableRow>
                        </Table>
                        :
                        <Typography variant="h6" align="center">
                            You don't have an appointment
                        </Typography>

                    }

                </TableContainer>
            </Container>
        </>
    )
}