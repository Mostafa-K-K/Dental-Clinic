import React, { useState, useEffect, useContext } from "react"
import { useHistory } from "react-router-dom"
import API from "../../API"
import SessionContext from "../../components/session/SessionContext"

import { toast } from "react-toastify"

import {
    Container,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    makeStyles
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
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
        marginBottom: 20,
        marginTop: 20
    },
    container: {
        width: "80%",
        backgroundColor: "white",
        paddingBottom: "10px",
        marginBottom: "70px",
        marginTop: "50px",
        borderRadius: "5px"
    }
}));

export default function Number_Patient() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [number, setNumber] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await API.post(`intialpatient`, { number: number }, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(toast.success("Initial Patients Successfuly"))
                .then(history.push({ pathname: "/admin/panel" }));
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`patient`)
                .then(res => {
                    const data = res.data.result;
                    if (data && data.length)
                        history.push({ pathname: '/admin/panel' });
                });
        }
        fetchData();
    }, [])

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <Person />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Insert Initial Patient
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>

                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            required
                            variant="outlined"
                            label="Number Patients"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className={classes.root}
                        />
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </Container>
    )
}