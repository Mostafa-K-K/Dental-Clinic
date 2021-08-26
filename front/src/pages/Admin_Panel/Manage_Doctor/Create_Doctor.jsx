import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

import { toast } from "react-toastify"

import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    makeStyles,
    Container
} from '@material-ui/core'

import { LockOutlined } from '@material-ui/icons'

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
        color: "white !important"
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
        backgroundColor: "white",
        paddingBottom: "10px",
        marginBottom: "70px",
        marginTop: "50px",
        borderRadius: "5px"
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
    linkTo: {
        color: "gray",
        textDecoration: "none",
        '&:hover': {
            textDecoration: "underline",
        },
        '& .linkSing:hover': {
            color: theme.palette.secondary.dark,
        },
        '& .linkSing': {
            color: "gray",
            textDecoration: "none",
        }
    },
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
}));

export default function Create_Doctor() {

    const classes = useStyles();
    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory();

    const [state, updateState] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: ""
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
            let reqBody = state;
            await API.get(`phonenumber`)
                .then(async res => {
                    const result = res.data.result;
                    const isPhon = result.find(r => r.phone === state.phone);

                    if (isPhon) {
                        toast.error("Phone Number alredy token");
                    } else {
                        await API.post(`doctor`, reqBody, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        })
                            .then(toast.success("Added Doctor Successfuly"))
                            .then(history.push({ pathname: '/doctor/list' }));
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <CssBaseline />

            <div className={classes.paper}>

                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Add Doctor
                </Typography>

                <form
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                label="First Name"
                                name="first_name"
                                value={state.first_name}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                label="Middle Name"
                                name="middle_name"
                                value={state.middle_name}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                label="Last Name"
                                name="last_name"
                                value={state.last_name}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField
                                required
                                fullWidth
                                type="number"
                                variant="outlined"
                                label="Phone Number"
                                name="phone"
                                value={state.phone}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                    </Grid>

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
                            onClick={() => history.push({ pathname: `/doctor/list` })}
                        >
                            Cancel
                        </Button>

                    </div>

                </form>
            </div>
        </Container>
    )
}