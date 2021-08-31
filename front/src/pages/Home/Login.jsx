import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import API from '../../API'
import { setCookie } from '../../cookie'
import SessionContext from '../../components/session/SessionContext'

import { toast } from "react-toastify"

import {
    Container,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
    InputAdornment,
    makeStyles
} from '@material-ui/core'


import {
    Visibility,
    LockOutlined,
    VisibilityOff
} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    root: {
        '&:nth-child(1)': {
            marginBottom: "20px",
        },
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
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.light,
        color: "white"
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        backgroundColor: "white",
        borderRadius: "5px",
        paddingBottom: "10px"
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
    }
}));

export default function Login() {

    const classes = useStyles();

    const [state, updateState] = useState({
        username: "",
        password: "",
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

    function handleShow() {
        state.show ?
            setState({ show: false }) :
            setState({ show: true });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(":heyyyy");
        try {
            await API.post('login', state)
                .then(res => {
                    const answer = res.data.result;

                    console.log({ res });
                    const success = res.data.success;
                    if (success) {
                        if (answer.isAdmin || answer.isAdmin == true) {

                            let user = {
                                id: answer.admin.id,
                                username: state.username,
                                token: answer.token,
                                isAdmin: answer.isAdmin,
                                role_id: `${answer.admin.role_id}`
                            }

                            setCookie('token', answer.token, 30);
                            setCookie('username', state.username, 30);
                            setCookie('id', answer.admin.id, 30);
                            setCookie('isAdmin', answer.isAdmin, 30);
                            setCookie('role_id', `${answer.admin.role_id}`, 30);
                            setSession({ user });
                        }
                        else if (!answer.isAdmin || answer.isAdmin == false) {

                            let user = {
                                id: answer.patient.id,
                                username: state.username,
                                token: answer.token,
                                isAdmin: answer.isAdmin
                            }

                            setCookie('token', answer.token, 30);
                            setCookie('username', state.username, 30);
                            setCookie('id', answer.patient.id, 30);
                            setCookie('isAdmin', answer.isAdmin, 30);
                            setSession({ user });
                        }
                    }
                    else {
                        toast.error("Wrong Username or Password")
                        setState({ username: "", password: "" });
                    }
                });
        } catch (e) {
            console.log("ERROR : ", e);
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
                    Sign in
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        label="Username"
                        name="username"
                        className={classes.root}
                        value={state.username}
                        onChange={handleChange}
                    />

                    <FormControl variant="outlined" fullWidth className={classes.root}>
                        <InputLabel htmlFor="pass">Password</InputLabel>
                        <OutlinedInput
                            required
                            id="pass"
                            type={state.show ? 'text' : 'password'}
                            name="password"
                            value={state.password}
                            onChange={handleChange}

                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        type="button"
                                        onClick={handleShow}
                                    >
                                        {state.show ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item className={classes.linkTo}>
                            Don't have an account?
                            <Link
                                to="/register"
                                className='linkSing'
                                variant="body2">
                                Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}