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

import CloseIcon from '@material-ui/icons/Cancel'
import DoneIcon from '@material-ui/icons/CheckCircle'

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%"
    },
    rejectIcon: {
        fill: "#ed4f1c",
        "&:hover": {
            fill: "#e24414"
        },
        marginLeft: "1%"
    },
    acceptIcon: {
        fill: "#8BE3D9",
        "&:hover": {
            fill: "#BEF4F4"
        },
        marginRight: "1%"
    },
    historyBtnLink: {
        textDecoration: "none",
        fontSize: 20,
        color: "#000000",
        width: "25%",
        '&:hover': {
            backgroundColor: "#BEF4F4"
        },
        padding: 10,
        textAlign: "center",
        borderRadius: 5
    },
    historyBtnLinkActive: {
        textDecoration: "none",
        fontSize: 20,
        color: "#000000",
        width: "25%",
        backgroundColor: "#8BE3D9",
        padding: 10,
        textAlign: "center",
        borderRadius: 5
    },
    paperFilter: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    }
}));

export default function Today_Appointment() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const date = moment().format("YYYY-MM-DD");

    const [appointments, setAppointments] = useState([]);

    async function handleReject(id_app) {
        try {
            const del = window.confirm("are you sure");
            if (del) await API.put(`appointment/${id_app}`, { status: "Absent" }, {
                headers: {
                    id: id,
                    token: token
                }
            });
            await fetchData();
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function handleAccept(id_appointment, id_patient) {
        try {
            const del = window.confirm("are you sure");
            if (del) history.push({ pathname: `/create/procedure/patient/${id_appointment}/${id_patient}` });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

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
                        const result = data.filter(d =>
                            moment(d.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
                            &&
                            d.status === "Waiting"
                        );
                        setAppointments(result);
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
                Today's Appointments
            </Typography>

            <Container className={classes.container}>

                <Paper className={classes.paperFilter}>
                    <Link
                        onClick={() => history.push({ pathname: '/appointment/today' })}
                        className={classes.historyBtnLinkActive}
                    >
                        Today
                    </Link>

                    <Link
                        onClick={() => history.push({ pathname: '/appointment/upcoming' })}
                        className={classes.historyBtnLink}
                    >
                        Upcoming
                    </Link>

                    <Link
                        onClick={() => history.push({ pathname: '/appointment/history' })}
                        className={classes.historyBtnLink}
                    >
                        History
                    </Link>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell>Clinic</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {appointments.map(appointment =>
                                <TableRow key={appointment.id}>

                                    <TableCell>
                                        {appointment.id_patient}
                                    </TableCell>

                                    <TableCell>
                                        {appointment.first_name} {appointment.middle_name} {appointment.last_name}
                                    </TableCell>

                                    <TableCell>
                                        {appointment.name}
                                    </TableCell>

                                    <TableCell>
                                        {moment(appointment.start_at, "HH:mm").format("h:mm A")}
                                    </TableCell>

                                    <TableCell>
                                        {moment(appointment.end_at, "HH:mm").format("h:mm A")}
                                    </TableCell>

                                    <TableCell>
                                        {appointment.description}
                                    </TableCell>

                                    <TableCell>
                                        {appointment.status}
                                    </TableCell>

                                    <TableCell align="center" className={classes.divRow}>
                                        <Link onClick={() => handleAccept(appointment.id, appointment.id_patient)}>
                                            <DoneIcon className={classes.acceptIcon} />
                                        </Link>

                                        <Link onClick={() => handleReject(appointment.id)}>
                                            <CloseIcon className={classes.rejectIcon} />
                                        </Link>
                                    </TableCell>

                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}