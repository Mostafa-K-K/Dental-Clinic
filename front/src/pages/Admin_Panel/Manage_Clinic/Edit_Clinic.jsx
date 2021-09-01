import React, { useState, useEffect, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

import { toast } from "react-toastify"

import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    makeStyles,
    Container
} from '@material-ui/core'

import ClinicIcon from "../../../images/Clinic.svg"

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
    img: {
        width: '15%',
        margin: 20,
        alignSelf: 'center'
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
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
}));

export default function Edit_Clinic() {

    const classes = useStyles();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const { id: id_cli } = useParams();
    const history = useHistory();

    const [state, updateState] = useState({
        name: "",
        err: ""
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
            await API.get(`clinic`, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(async res => {
                    const result = res.data.result;
                    const isClinic = result.find(r => r.name === state.name && String(r.id) !== String(id_cli));

                    if (isClinic) {
                        toast.error("Clinic alredy Exist");
                    } else {
                        await API.put(`clinic/${id_cli}`, reqBody, {
                            headers: {
                                id: id,
                                token: token
                            }
                        })
                            .then(toast.success("Update Clinic Successfuly"))
                            .then(history.push({ pathname: '/clinic/list' }));
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await API.get(`clinic/${id_cli}`, {
                    headers: {
                        id: id,
                        token: token
                    }
                })
                    .then(res => {
                        const data = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setState(data);
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, []);

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>

            <Typography variant="h3" align="center" className="titlePage">
            </Typography>

            <CssBaseline />

            <div className={classes.paper}>

                <img src={ClinicIcon} alt="" className={classes.img} />

                <Typography component="h1" variant="h5">
                    Edit Clinic
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
                                label="Name clinic"
                                name="name"
                                value={state.name}
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
                            Save
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            className={classes.submit}
                            onClick={() => history.push({ pathname: `/clinic/list` })}
                        >
                            Cancel
                        </Button>

                    </div>

                </form>
            </div>
        </Container>
    )
}