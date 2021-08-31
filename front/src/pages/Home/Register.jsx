import React, { useState, useContext } from 'react'
import { Link } from "react-router-dom"
import API from '../../API'
import moment from 'moment'
import { setCookie } from '../../cookie'
import SessionContext from "../../components/session/SessionContext"

import { toast } from "react-toastify"

import {
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Grid,
    Typography,
    makeStyles,
    Container,
    InputAdornment,
    RadioGroup,
    FormLabel,
    Radio
} from '@material-ui/core'

import {
    Visibility,
    LockOutlined,
    VisibilityOff
} from '@material-ui/icons'

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
        margin: theme.spacing(3, 0, 2),
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
    }
}));


export default function Register() {

    const classes = useStyles();

    const [state, updateState] = useState({
        username: "",
        password: "",
        conPassword: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        gender: "Male",
        birth: moment().format('YYYY-MM-DD'),
        marital: "Single",
        health: "",
        address: "",
        show: false
    });

    let { actions: { setSession } } = useContext(SessionContext);

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

    function handleDateChange(date) {
        let d = moment(date).format("YYYY-MM-DD")
        setState({ birth: d });
    }

    function handleShow() {
        state.show ?
            setState({ show: false }) :
            setState({ show: true });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let reqBody = state;
        try {
            await API.get(`username`)
                .then(async res => {
                    const usernames = res.data.result;
                    const isUser = usernames.find(r => r.username === state.username);

                    await API.get(`phonenumber`)
                        .then(async res => {
                            const phones = res.data.result;
                            const isPhon = phones.find(r => r.phone === state.phone);

                            if (isUser) toast.error("Username alredy token");
                            if (isPhon) toast.error("Phone Number alredy token");
                            if (state.conPassword !== state.password) toast.error("Password incorrect")

                            if (!isUser && !isPhon && state.conPassword === state.password) {
                                await API.post(`signup`, reqBody)
                                    .then(res => {
                                        const answer = res.data.result;

                                        let user = {
                                            id: answer.id,
                                            username: state.username,
                                            token: answer.token,
                                            isAdmin: answer.isAdmin
                                        }

                                        setCookie('id', answer.id, 30);
                                        setCookie('username', state.username, 30);
                                        setCookie('token', answer.token, 30);
                                        setCookie('isAdmin', answer.isAdmin, 30);
                                        setSession({ user });
                                    })
                                    .then(toast.success("Welcome!"));
                            }
                        });
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
                    Sign up
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
                                variant="outlined"
                                label="Username"
                                name="username"
                                value={state.username}
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

                        <Grid item xs={12} >
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="health Problem"
                                name="health"
                                value={state.health}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                label="Address"
                                name="address"
                                value={state.address}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <MuiPickersUtilsProvider utils={MomentUtils} >
                                <KeyboardDatePicker
                                    fullWidth
                                    required
                                    label="Date Of Birth"
                                    variant="outlined"
                                    inputVariant="outlined"
                                    format="YYYY/MM/DD"
                                    value={state.birth}
                                    onChange={(date) => handleDateChange(date)}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    className={classes.root}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl fullWidth variant="outlined" className={classes.root}>
                                <InputLabel>Password</InputLabel>
                                <OutlinedInput
                                    type={state.show ? 'text' : 'password'}
                                    name="password"
                                    value={state.password}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShow}>
                                                {state.show ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={70}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl fullWidth variant="outlined" className={classes.root}>
                                <InputLabel>Confirm Password</InputLabel>
                                <OutlinedInput
                                    type={state.show ? 'text' : 'password'}
                                    name="conPassword"
                                    value={state.conPassword}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShow}>
                                                {state.show ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    labelWidth={135}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                            <FormControl fullWidth className={classes.FormControl}>
                                <FormLabel className={classes.FormLabel}>Gender</FormLabel>
                                <RadioGroup
                                    name="gender"
                                    value={state.gender}
                                    onChange={handleChange}
                                    className="radioR1"
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}   >
                            <FormControl className={classes.FormControl}>
                                <FormLabel xs={4} className={classes.FormLabel}>Status</FormLabel>
                                <RadioGroup
                                    name="marital"
                                    value={state.marital}
                                    onChange={handleChange}
                                    className="radioR2"
                                >
                                    <FormControlLabel xs={4} value="Single" control={<Radio />} label="Single" />
                                    <FormControlLabel xs={4} value="Married" control={<Radio />} label="Married" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                    </Grid>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>

                    <Grid container justifyContent="center">
                        <Grid item className={classes.linkTo}>
                            Already have an account?
                            <Link
                                to="/login"
                                className="linkSing"
                            >
                                Sign in
                            </Link>
                        </Grid>
                    </Grid>

                </form>
            </div>
        </Container>
    )
}