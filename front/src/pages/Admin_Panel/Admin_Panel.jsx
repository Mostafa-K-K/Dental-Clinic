import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import { Link } from "react-router-dom"
import moment from 'moment'
import API from "../../API"
import SessionContext from "../../components/session/SessionContext"

import {
    Container,
    Paper,
    CssBaseline,
    makeStyles,
    Typography,
    Grid
} from '@material-ui/core'

import Patients from "../../components/Patients"
import Doctors from "../../components/Doctors"
import Clinics from "../../components/Clinics"
import Types from "../../components/Types"

const useStyles = makeStyles((theme) => ({
    container: { },
    bigPaper: {
        // width: "36%",
        height: 200,
        backgroundColor: '#BEF4F4',
        margin: 50
    },
    smallPaper: {
        width: "30%",
        height: "50%",
        backgroundColor: "#FFFFFF",
        position: "relative",
        top: -70,
        left: -15
    },
    smallPaperText: {
        width: "80%",
        height: "28%",
        backgroundColor: "#FFFFFF",
        position: "relative",
        top: -10,
        left: "10%"
    },
    smallPaperInside: {
        width: "50%",
        height: "30%",
        backgroundColor: "#FFFFFF",
        position: "relative",
        top: 60,
        left: "40%",
    },
    paperFilter: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
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
}));

export default function Admin_Panel() {

    const classes = useStyles();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        nbPatient: 0,
        nbType: 0,
        nbDoctor: 0,
        nbClinic: 0
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
            await API.post(`patientcount`, { name: "" }, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        setState({ nbPatient: result });
                    }
                });

            await API.get(`clinic`, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        setState({ nbClinic: result.length });
                    }
                });

            await API.get(`doctor`, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        setState({ nbDoctor: result.length });
                    }
                });


            await API.get(`type`, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        setState({ nbType: result.length });
                    }
                });
        }
        fetchData();
    }, []);

    return (
        <>
            <CssBaseline />
            <Typography variant="h3" align="center" className="titlePage">
                Mobayed Dental Clinic
            </Typography>

            <Container className={classes.container}>
                <Grid container spacing={1}>

                    <Grid item xs={6}>
                        <Paper className={classes.bigPaper}>

                            <Paper className={classes.smallPaperInside}>
                                <Typography align="center">
                                    {state.nbPatient} patients
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaper}>
                                <Typography align="center">
                                    Patient
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaperText}>
                                <Patients className={classes.root} />
                            </Paper>

                        </Paper>
                    </Grid>


                    <Grid item xs={6}>
                        <Paper className={classes.bigPaper}>

                            <Paper className={classes.smallPaperInside}>
                                <Typography align="center">
                                    {state.nbDoctor} doctors
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaper}>
                                <Typography align="center">
                                    Doctor
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaperText}>
                                <Doctors className={classes.root} />
                            </Paper>

                        </Paper>
                    </Grid>


                    <Grid item xs={6}>
                        <Paper className={classes.bigPaper}>

                            <Paper className={classes.smallPaperInside}>
                                <Typography align="center">
                                    {state.nbClinic} clinics
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaper}>
                                <Typography align="center">
                                    Clinic
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaperText}>
                                <Clinics className={classes.root} />
                            </Paper>

                        </Paper>
                    </Grid>


                    <Grid item xs={6}>
                        <Paper className={classes.bigPaper}>

                            <Paper className={classes.smallPaperInside}>
                                <Typography align="center">
                                    {state.nbType} acts
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaper}>
                                <Typography align="center">
                                    Act
                                </Typography>
                            </Paper>

                            <Paper className={classes.smallPaperText}>
                                <Types className={classes.root} />
                            </Paper>

                        </Paper>
                    </Grid>


                </Grid>

            </Container>
        </>
    )
}