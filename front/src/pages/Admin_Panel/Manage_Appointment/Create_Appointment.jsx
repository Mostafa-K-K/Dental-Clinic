import React, { useState, useContext } from "react"
import API from "../../../API"
import moment from "moment"
import { useHistory } from 'react-router'
import SessionContext from "../../../components/session/SessionContext"

import Patients from '../../../components/Patients'
import Clinics from "../../../components/Clinics"

import { toast } from "react-toastify" 

import {
    TextareaAutosize,
    Button,
    CssBaseline,
    Typography,
    makeStyles,
    Container
} from '@material-ui/core'

import MomentUtils from '@date-io/moment'

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
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
        marginBottom: 15
    },
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: "#FFFFFF !important"
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(4),
    },
    submit: {
        width: 120,
        marginBottom: 20,
        marginTop: 20
    },
    container: {
        backgroundColor: "#FFFFFF",
        width: "80%",
        paddingBottom: "10px",
        paddingTop: "30px",
        marginBottom: "70px",
        borderRadius: "5px",
    },
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
    textAresDex: {
        padding: 15,
        minWidth: 470,
        maxWidth: 470,
        minHeight: 130,
        maxHeight: 130,
        borderRadius: 5,
        border: "1px solid #8BE3D9",
        '&:focus': {
            border: "2px solid #8BE3D9",
        },
        marginBottom: 15
    },
    formTextDate: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    dateTimeDiv: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: "nowrap",
        justifyContent: "space-between"
    }
}));

export default function Create_Appointment() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const date = moment().format("YYYY-MM-DD");
    const date_start = moment();
    const date_end = moment().add(1, 'hours');

    const [state, updateState] = useState({
        description: "",
        date: date,
        start_at: date_start,
        end_at: date_end,
        status: 'Waiting',
        id_patient: "",
        id_clinic: ""
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
        try {

            let reqBody = {
                description: state.description,
                date: state.date,
                start_at: moment(state.start_at, "HH:mm").format('hh:mm:ss'),
                end_at: moment(state.end_at, "HH:mm").format('hh:mm:ss'),
                status: state.status,
                id_patient: state.id_patient,
                id_clinic: state.id_clinic,
            };
            await API.get('appointment', {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success) {

                        let isApp = data.find(d => (
                            (
                                (
                                    (moment(state.start_at) > moment(d.start_at))
                                    &&
                                    (moment(state.start_at) < moment(d.end_at))
                                )
                                ||
                                (
                                    (moment(state.end_at) > moment(d.start_at))
                                    &&
                                    (moment(state.end_at) < moment(d.end_at))
                                )
                            )
                            &&
                            (
                                moment(d.date).format("YYYY-MM-DD") === moment(state.date).format("YYYY-MM-DD")
                                &&
                                (String(d.id_clinic) === String(state.id_clinic))
                            )
                        ));

                        if (isApp)
                            toast.warning("Time not available");
                        if (state.id_patient === "" || !state.id_patient)
                            toast.warning("Select a patient");

                        if (!isApp && state.id_patient !== "") {
                            API.post('appointment', reqBody, {
                                headers: {
                                    id: id,
                                    token: token,
                                    isAdmin: isAdmin
                                }
                            })
                                .then(history.push({ pathname: '/appointment/upcoming' }))
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <>
            <CssBaseline />

            <Typography variant="h3" align="center" className="titlePage">
            Add Appointmemt
            </Typography>

            <Container className={classes.container}>

                <form onSubmit={handleSubmit}>

                    <Patients
                        onChange={(event, newValue) => {
                            setState({ id_patient: newValue ? newValue.id : "" });
                        }}
                        className={classes.root}
                    />

                    <Clinics
                        onChange={(event, newValue) => {
                            setState({ id_clinic: newValue ? newValue.id : "" });
                        }}
                        className={classes.root}
                    />

                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <KeyboardDatePicker
                            required
                            fullWidth
                            label="Date"
                            variant="outlined"
                            inputVariant="outlined"
                            format="YYYY/MM/DD"
                            value={state.date}
                            onChange={date => setState({ date: moment(date).format("YYYY-MM-DD") })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.root}
                        />
                    </MuiPickersUtilsProvider>

                    <div className={classes.formTextDate}>

                        <div className={classes.dateTimeDiv}>
                            <MuiPickersUtilsProvider utils={MomentUtils} >
                                <KeyboardTimePicker
                                    required
                                    label="Start"
                                    variant="outlined"
                                    inputVariant="outlined"
                                    value={state.start_at}
                                    onChange={date => setState({ start_at: date })}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    className={classes.root}
                                />
                            </MuiPickersUtilsProvider>

                            <MuiPickersUtilsProvider utils={MomentUtils} >
                                <KeyboardTimePicker
                                    required
                                    label="End"
                                    variant="outlined"
                                    inputVariant="outlined"
                                    value={state.end_at}
                                    onChange={date => setState({ end_at: date })}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    className={classes.root}
                                />
                            </MuiPickersUtilsProvider>
                        </div>

                        <TextareaAutosize
                            maxRows={6}
                            name="description"
                            value={state.description}
                            onChange={handleChange}
                            placeholder="Add Note"
                            className={classes.textAresDex}
                        />

                    </div>

                    <div className={classes.flexDiv}>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Add
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            className={classes.submit}
                            onClick={() => history.push({ pathname: "/appointment/upcoming" })}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </Container>
        </>
    );
}