import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router'
import API from '../../../API'
import moment from 'moment'
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
    VisibilityOff
} from '@material-ui/icons'

import PersonIcon from '@material-ui/icons/Person'

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
        width: 120,
        marginBottom: 20,
        marginTop: 20
    },
    container: {
        width: "80%",
        backgroundColor: "white",
        paddingBottom: "10px",
        marginBottom: "70px",
        borderRadius: "5px"
    },
    FormLabel: {
        textAlign: "center",
        marginTop: 12
    },
    FormControl: {
        display: "flex",
        flexFlow: "row",
        justifyContent: "space-around",
        '& .radioR1': {
            display: "flex",
            flexFlow: "row",
            justifyContent: "space-between",
            '& .MuiFormControlLabel-root:nth-child(2)': {
                // marginLeft: "9%"
            }
        },
        '& .radioR2': {
            display: "flex",
            flexFlow: "row",
            '& .MuiFormControlLabel-root:nth-child(2)': {
                // marginLeft: "8%"
            }
        }
    },
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
}));

export default function Edit_Patient() {

    const classes = useStyles();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const { id: id_pat } = useParams();
    const history = useHistory();

    const [state, updateState] = useState({
        username: "",
        lastUsername: "",
        password: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        lastPhone: "",
        gender: "Male",
        birth: moment().format('YYYY-MM-DD'),
        marital: "Single",
        health: "",
        address: "",
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
        try {
            let reqBody = {
                username: state.username,
                first_name: state.first_name,
                middle_name: state.middle_name,
                last_name: state.last_name,
                phone: state.phone,
                gender: state.gender,
                birth: state.birth,
                marital: state.marital,
                health: state.health,
                address: state.address
            };
            if (state.password && state.password !== "") reqBody['password'] = state.password;

            await API.get(`username`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(async res => {
                    const usernames = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        const isUser = usernames.filter(r => r.username !== state.lastUsername)
                            .find(r => r.username === state.username);

                        await API.get(`phonenumber`, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        })
                            .then(async res => {
                                const phones = res.data.result;
                                const suc = res.data.success;
                                if (suc) {
                                    const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                                        .find(r => r.phone === state.phone);

                                    if (isUser) toast.error("Username alredy token");
                                    if (isPhon) toast.error("Phone Number alredy token");

                                    if (!isUser && !isPhon) {
                                        await API.put(`patient/${id_pat}`, reqBody, {
                                            headers: {
                                                id: id,
                                                token: token,
                                                isAdmin: isAdmin
                                            }
                                        })
                                            .then(toast.success("Update Patient Successfuly"))
                                            .then(history.push({ pathname: '/patient/list' }))
                                    }
                                }
                            });
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetData() {
            try {
                await API.get(`patient/${id_pat}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        setState({
                            username: data.username,
                            lastUsername: data.username,
                            first_name: data.first_name,
                            middle_name: data.middle_name,
                            last_name: data.last_name,
                            phone: data.phone,
                            lastPhone: data.phone,
                            birth: moment(data.birth).format("YYYY-MM-DD"),
                            gender: data.gender,
                            marital: data.marital,
                            health: data.health,
                            address: data.address
                        });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetData();
    }, []);

    return (
        <Container component="main" className={classes.container}>

            <Typography variant="h3" align="center" className="titlePage">
            </Typography>

            <CssBaseline />
            <div className={classes.paper}>

                <Avatar className={classes.avatar}>
                    <PersonIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Update Patient
                </Typography>

                <form
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={1}>

                        <Grid item xs={6}>
                            <TextField
                                readOnly
                                fullWidth
                                variant="outlined"
                                label="ID"
                                value={id_pat}
                                className={classes.root}
                            />
                        </Grid>

                        <Grid item xs={6}>
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

                        <Grid item xs={6}>
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6} >
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

                        <Grid item xs={6}   >
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
                            onClick={() => history.push({ pathname: `/patient/list` })}
                        >
                            Cancel
                        </Button>

                    </div>

                </form>
            </div>
        </Container>
    )
}