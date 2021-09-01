import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router'
import API from '../../../API'
import SessionContext from '../../../components/session/SessionContext'

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

import { Person } from '@material-ui/icons'

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
        marginBottom: 8
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
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
}));

export default function Change_Information_Admin() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        id: id,
        first_name: "",
        middle_name: "",
        last_name: "",
        phone: "",
        lastPhone: ""
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
                    const phones = res.data.result;
                    const isPhon = phones.filter(r => r.phone !== state.lastPhone)
                        .find(r => r.phone === state.phone);

                    if (isPhon) {
                        toast.error("Phone Number alredy token");
                    } else {
                        await API.put(`admin/${id}`, reqBody, {
                            headers: {
                                id: id,
                                token: token
                            }
                        })
                            .then(toast.success("Update Profile Successfuly"))
                            .then(history.push({ pathname: '/admin/profile' }));
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetData() {
            try {
                await API.get(`admin/${id}`, {
                    headers: {
                        id: id,
                        token: token
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setState({
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
                            label="First Name"
                            name="first_name"
                            value={state.first_name}
                            onChange={handleChange}
                            className={classes.root}
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            required
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
                            fullWidth
                            required
                            variant="outlined"
                            label="Last Name"
                            name="last_name"
                            value={state.last_name}
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
                            onClick={() => history.push({ pathname: "/admin/profile" })}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </div>
        </Container>
    )
}