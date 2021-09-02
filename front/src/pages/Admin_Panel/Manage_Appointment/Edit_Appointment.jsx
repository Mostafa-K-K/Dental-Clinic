import React, { useState, useEffect, useContext } from "react"
import API from "../../../API"
import moment from "moment"
import { useHistory, useParams } from 'react-router'
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

export default function Edit_Appointment() {

    const classes = useStyles();
    const history = useHistory();
    const { id: id_app } = useParams();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        description: "",
        date: "2000-01-01",
        start_at: "2000-01-01T11:11:11",
        end_at: "2000-01-01T11:11:11",
        status: "",
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
                start_at: moment(state.start_at, "HH:mm").format('HH:mm'),
                end_at: moment(state.end_at, "HH:mm").format('HH:mm'),
                status: state.status,
                id_patient: state.id_patient,
                id_clinic: state.id_clinic,
            };

            await API.get('appointment', {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        const result = data.filter(d => d.id != id_app);

                        let isApp = result.find(d => (
                            (
                                (
                                    (
                                        (
                                            moment(state.start_at, "HH:mm").format("HH:mm")
                                            >
                                            moment(d.start_at, "HH:mm").format("HH:mm")
                                        )
                                        &&
                                        (
                                            moment(state.start_at, "HH:mm").format("HH:mm")
                                            <
                                            moment(d.end_at, "HH:mm").format("HH:mm")
                                        )
                                    )
                                    ||
                                    (
                                        (
                                            moment(state.end_at, "HH:mm").format("HH:mm")
                                            >
                                            moment(d.start_at, "HH:mm").format("HH:mm")
                                        )
                                        &&
                                        (
                                            moment(state.end_at, "HH:mm").format("HH:mm")
                                            <
                                            moment(d.end_at, "HH:mm").format("HH:mm")
                                        )
                                    )
                                    ||
                                    (
                                        (
                                            moment(state.start_at, "HH:mm").format("HH:mm")
                                            <
                                            moment(d.start_at, "HH:mm").format("HH:mm")
                                        )
                                        &&
                                        (
                                            moment(state.end_at, "HH:mm").format("HH:mm")
                                            >
                                            moment(d.end_at, "HH:mm").format("HH:mm")
                                        )
                                    )
                                    ||
                                    (
                                        moment(state.start_at, "HH:mm").format("HH:mm")
                                        ==
                                        moment(d.start_at, "HH:mm").format("HH:mm")
                                    )
                                    ||
                                    (
                                        moment(state.end_at, "HH:mm").format("HH:mm")
                                        ==
                                        moment(d.end_at, "HH:mm").format("HH:mm")
                                    )
                                )
                                &&
                                (
                                    moment(d.date).format("YYYY-MM-DD") == moment(state.date).format("YYYY-MM-DD")
                                    &&
                                    (d.id_clinic == state.id_clinic)
                                )
                            )
                            ||
                            (
                                moment(state.start_at, "HH:mm").format("HH:mm")
                                >
                                moment(state.end_at, "HH:mm").format("HH:mm")
                            )
                        ));


                        if (isApp)
                            toast.warning("Time not available");

                        if (!isApp) {
                            API.put(`appointment/${id_app}`, reqBody, {
                                headers: {
                                    id: id,
                                    token: token
                                }
                            });
                            history.push({ pathname: '/appointment/upcoming' })
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

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
                            const result = data.find(d => String(d.id) === String(id_app));
                            setState({ description: result.description });
                            setState({ date: moment(result.date).format("YYYY-MM-DD") });
                            setState({ start_at: "2000-01-01T" + result.start_at.toString() });
                            setState({ end_at: "2000-01-01T" + result.end_at.toString() });
                            setState({ status: result.status });
                            setState({ id_patient: result.id_patient });
                            setState({ id_clinic: result.id_clinic });
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
                Update Appointmemt
            </Typography>

            <Container className={classes.container}>

                <form onSubmit={handleSubmit}>

                    <Patients
                        onChange={(event, newValue) => {
                            setState({ id_patient: newValue ? newValue.id : "" });
                        }}
                        className={classes.root}
                        value={state.id_patient}
                    />

                    <Clinics
                        onChange={(event, newValue) => {
                            setState({ id_clinic: newValue ? newValue.id : "" });
                        }}
                        className={classes.root}
                        value={state.id_clinic}
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
                            Save
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