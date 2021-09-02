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
    Typography,
    FormControl,
    FormControlLabel,
    RadioGroup,
    FormLabel,
    Radio,
} from '@material-ui/core'

import RefreshIcon from '@material-ui/icons/Refresh'

import MomentUtils from '@date-io/moment'

import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers'

const useStyles = makeStyles((theme) => ({
    root: {
        '& label.Mui-focused': {
            color: theme.palette.primary.main,
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.primary.main,
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
        '& .MuiFormHelperText-contained': {
            display: "none"
        },
        '& label': {
            color: "#8BE3D9 !important",
        },
        '& .PrivateNotchedOutline-root-28': {
            borderColor: "#8BE3D9 !important",
        }
    },
    container: {
        width: "100%",
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
    },
    resetSearch: {
        backgroundColor: "#8BE3D9",
        color: "#FFFFFF",
        padding: 6,
        fontSize: 53,
        borderRadius: "5px",
        '&:hover': {
            backgroundColor: "#BEF4F4"
        }
    },
    FormLabel: {
        textAlign: "center",
        marginTop: 12
    },
    FormControl: {
        display: "flex",
        flexFlow: "row",
        marginLeft: 20,
        '& .radioR1': {
            display: "flex",
            flexFlow: "row",
            marginLeft: 70,
            '& .MuiFormControlLabel-root:nth-child(2)': {
                marginLeft: 35
            }
        },
        '& .radioR2': {
            display: "flex",
            flexFlow: "row",
            marginLeft: 75,
            '& .MuiFormControlLabel-root:nth-child(2)': {
                marginLeft: 25
            }
        }
    },
}));

export default function Today_Appointment() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [appointments, setAppointments] = useState([]);

    const [state, updateState] = useState({
        date: null,
        status: ""
    })

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
                        let result = data.filter(d => d.status !== "Waiting");
                        if (state.date && state.date !== "")
                            result = result.filter(d => d.start_at.substring(0, 10) === state.date);
                        if (state.status && state.status !== "")
                            result = result.filter(d => d.status === state.status);
                        setAppointments(result);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(state)])

    return (
        <>
            <CssBaseline />

            <Typography variant="h3" align="center" className="titlePage">
                History Appointments
            </Typography>

            <Container className={classes.container}>

                <Paper className={classes.paperFilter}>
                    <Link
                        onClick={() => history.push({ pathname: '/appointment/today' })}
                        className={classes.historyBtnLink}
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
                        className={classes.historyBtnLinkActive}
                    >
                        History
                    </Link>
                </Paper>

                <Paper className={classes.paperFilter}>

                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <KeyboardDatePicker
                            focused={state.date != null}
                            label="Date"
                            variant="outlined"
                            inputVariant="outlined"
                            format="YYYY/MM/DD"
                            value={state.date}
                            onChange={(date) => setState({ date: moment(date).format("YYYY-MM-DD") })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.root}
                        />
                    </MuiPickersUtilsProvider>

                    <FormControl className={classes.FormControl}>
                        <RadioGroup
                            name="status"
                            value={state.status}
                            onChange={handleChange}
                            className="radioR1"
                        >
                            <FormControlLabel value="Present" control={<Radio />} label="Present" />
                            <FormControlLabel value="Absent" control={<Radio />} label="Absent" />
                        </RadioGroup>
                    </FormControl>

                    <Link
                        onClick={() => {
                            setState({ date: null});
                            setState({status: ""});
                        }}
                    >
                        <RefreshIcon className={classes.resetSearch} />
                    </Link>

                </Paper>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell>Clinic</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Start</TableCell>
                                <TableCell>End</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
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
                                        {moment(appointment.date).format("YYYY-MM-DD")}
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

                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}