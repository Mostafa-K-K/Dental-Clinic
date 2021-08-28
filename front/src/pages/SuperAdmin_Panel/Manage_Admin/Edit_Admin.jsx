import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

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
    Grid,
    Typography,
    makeStyles,
    Container,
    InputAdornment,
} from '@material-ui/core'

import {
    Visibility,
    LockOutlined,
    VisibilityOff
} from '@material-ui/icons'

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

export default function Change_Information() {

    const { id: id_adm } = useParams();

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        username: "",
        lastUsername: "",
        password: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        lastPhone: "",
        show: false
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

    function handleShow() {
        state.show ?
            setState({ show: false }) :
            setState({ show: true });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            let reqBody = {
                username: state.username,
                first_name: state.first_name,
                middle_name: state.middle_name,
                last_name: state.last_name,
                phone: state.phone,
            };
            if (state.password && state.password !== "") reqBody['password'] = state.password;

            await API.get(`username`)
                .then(async res => {
                    const usernames = res.data.result;
                    const isUser = usernames.filter(r => r.username !== state.lastUsername)
                        .find(r => r.username === state.username);

                    await API.get(`phonenumber`)
                        .then(async res => {
                            const phones = res.data.result;
                            const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                                .find(r => r.phone === state.phone);

                            if (isUser) toast.error("Username alredy token");
                            if (isPhon) toast.error("Phone Number alredy token");

                            if (!isUser && !isPhon) {
                                await API.put(`admin/${id_adm}`, reqBody, {
                                    headers: {
                                        id: id,
                                        token: token,
                                        isAdmin: isAdmin
                                    }
                                })
                                    .then(toast.success("Update Admin Successfuly"))
                                    .then(history.push({ pathname: '/admin/list' }));
                            }
                        });
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetData() {
            try {
                await API.get(`admin/${id_adm}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setState({
                                username: data.username,
                                lastUsername: data.username,
                                first_name: data.first_name,
                                middle_name: data.middle_name,
                                last_name: data.last_name,
                                phone: data.phone,
                                lastPhone: data.phone
                            });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetData();
    }, [])

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <CssBaseline />

            <div className={classes.paper}>

                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Update Admin
                </Typography>

                <form
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                readonly
                                fullWidth
                                variant="outlined"
                                label="ID"
                                value={id_adm}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                autoFocus
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
                            <FormControl fullWidth variant="outlined" className={classes.root}>
                                <InputLabel>New Password</InputLabel>
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
                                    labelWidth={100}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>

                    <div className={classes.flexDiv}>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Update
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            className={classes.submit}
                            onClick={() => history.push({ pathname: `/admin/list` })}
                        >
                            Cancel
                        </Button>

                    </div>

                </form>
            </div>
        </Container>
    )
}