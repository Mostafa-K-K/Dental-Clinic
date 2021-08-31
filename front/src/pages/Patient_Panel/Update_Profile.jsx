import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import API from "../../API"
import SessionContext from '../../components/session/SessionContext'

import { injectStyle } from "react-toastify/dist/inject-style"
import { toast } from "react-toastify"

import {
    FormControl,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Grid,
    Typography,
    makeStyles,
    Container,
    RadioGroup,
    FormLabel,
    Radio
} from '@material-ui/core'

import { Person } from "@material-ui/icons"

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
        borderRadius: "5px"
    },
    FormLabel: {
        textAlign: "center",
        marginTop: 12
    },
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
    FormControl: {
        display: "flex",
        flexFlow: "row",
        marginLeft: 20,
        '& .radioR2': {
            display: "flex",
            flexFlow: "row",
            marginLeft: 75,
            '& .MuiFormControlLabel-root:nth-child(2)': {
                marginLeft: 25
            }
        },
        marginBottom: 15
    },
}));

export default function Update_Profile() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        phone: "",
        lastPhone: "",
        marital: "",
        health: "",
        address: "",
        errPhon: ""
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
                phone: state.phone,
                marital: state.marital,
                health: state.health,
                address: state.address,
            };

            await API.get(`phonenumber`)
                .then(async res => {
                    const phones = res.data.result;
                    const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                        .find(r => r.phone === state.phone);
                    if (isPhon) {
                        toast.error("Phone Number alredy token");
                    } else {
                        await API.put(`patient/${id}`, reqBody, {
                            headers: {
                                id: id,
                                token: token,
                                isAdmin: isAdmin
                            }
                        })
                            .then(toast.success("Profile Update Successfuly"))
                            .then(history.push({ pathname: "/patient/panel" }))

                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetData() {
            try {
                await API.get(`patient/${id}`, {
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
                                phone: data.phone,
                                marital: data.marital,
                                health: data.health,
                                address: data.address,
                                lastPhone: data.phone
                            });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetData();
    }, []);

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>

            <Typography variant="h3" align="center" className="titlePage">
            </Typography>

            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <Person />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Update Profile
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>

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

                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Health Problem"
                            name="health"
                            value={state.health}
                            onChange={handleChange}
                            className={classes.root}
                        />
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
                            onClick={() => history.push({ pathname: "/patient/panel" })}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </div>
        </Container>
    )
}