import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import { Link } from "react-router-dom"
import API from "../../../API"
import moment from "moment"
import SessionContext from "../../../components/session/SessionContext"

import Patients from '../../../components/Patients'

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Container,
    Paper,
    CssBaseline,
    makeStyles,
    Typography,
    IconButton
} from '@material-ui/core'

import AddBoxIcon from '@material-ui/icons/AddBox'
import EditIcon from '@material-ui/icons/Edit'

import RefreshIcon from '@material-ui/icons/Refresh'

import MomentUtils from '@date-io/moment'

import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers'

import ConfirmDelete from "../../../components/ConfirmDelete"

const useStyles = makeStyles((theme) => ({
    paperFilter: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    root1: {
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
        '& .MuiFormHelperText-contained': {
            display: "none"
        },
        '& label': {
            color: "#8BE3D9 !important",
        },
        '& .PrivateNotchedOutline-root-28': {
            borderColor: "#8BE3D9 !important",
        },
        width: 400
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
        '& .MuiFormHelperText-contained': {
            display: "none"
        },
        '& label': {
            color: "#8BE3D9 !important",
        },
        '& .PrivateNotchedOutline-root-28': {
            borderColor: "#8BE3D9 !important",
        },
        width: 300
    },
    resetSearch: {
        backgroundColor: "#8BE3D9",
        color: "#FFFFFF",
        padding: 6,
        fontSize: 53,
        borderRadius: "5px",
        '&:hover': {
            backgroundColor: "#BEF4F4"
        }
    },
    ddBoxIconBtn: {
        width: 160,
        padding: 6,
        paddingBottom: 10,
        margin: 10,
        backgroundColor: "#FFFFFF",
        color: "#8BE3D9",
        '&:hover': {
            color: "#FFFFFF",
            backgroundColor: "#8BE3D9"
        }
    },
    ddBoxIconBtnLink: {
        width: 160,
        textDecoration: "none",
        fontSize: 16
    },
    ddBoxIcon: {
        position: "relative",
        top: 6,
        right: 10
    },
    widthBtn: {
        width: 20
    },
    editIcon: {
        color: "#8BE3D9",
        '&:hover': {
            color: "#BEF4F4"
        }
    },
    deleteIcon: {
        color: "#ed4f1c",
        '&:hover': {
            color: "#e24414"
        }
    }
}));

export default function List_Procedure() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        procedures: [],
        works: [],
        id_patient: "",
        date: null
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    async function fetchData() {
        try {
            await API.get('PDP', {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    let result = res.data.result;
                    const success = res.data.success;
                    console.log(result);
                    if (success) {
                        if (state.date && state.date !== "")
                            result = result.filter(d => d.date.substring(0, 10) === state.date);

                        if (state.id_patient && state.id_patient !== "")
                            result = result.filter(d => d.id_patient === state.id_patient);

                        setState({ procedures: result });
                    }
                });

            await API.get('PTCDP', {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success)
                        setState({ works: result });
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [JSON.stringify({ id_patient: state.id_patient, date: state.date })])

    return (
        <>
            <CssBaseline />

            <Typography variant="h3" align="center" className="titlePage">
                Procedures
            </Typography>

            <Container className={classes.container}>

                <Link
                    to='/procedure/create'
                    className={classes.ddBoxIconBtnLink}
                >

                    <Paper align="center" className={classes.ddBoxIconBtn}>
                        <AddBoxIcon className={classes.ddBoxIcon} />
                        Add Procedure
                    </Paper>
                </Link>

                <Paper className={classes.paperFilter}>

                    <Patients
                        value={state.id_patient}
                        onChange={(event, newValue) => {
                            setState({ id_patient: newValue ? newValue.id : "" });
                        }}
                        className={classes.root1}
                    />

                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <KeyboardDatePicker
                            focused={state.date != null}
                            label="Date"
                            variant="outlined"
                            inputVariant="outlined"
                            format="YYYY/MM/DD"
                            value={state.date}
                            onChange={(date) => setState({ date: moment(date).format("YYYY-MM-DD") })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.root}
                        />
                    </MuiPickersUtilsProvider>

                    <Link
                        onClick={() => {
                            setState({ date: null });
                            setState({ id_patient: "" });
                        }}
                    >
                        <RefreshIcon className={classes.resetSearch} />
                    </Link>

                </Paper>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell align="center">Payment</TableCell>
                                <TableCell align="center">Tooth</TableCell>
                                <TableCell align="center">Act</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {state.procedures.map(procedure =>
                                <TableRow key={procedure.id}>

                                    <TableCell align="center">
                                        {moment(procedure.date).format("YYYY-MM-DD")}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(procedure.date).format("h:mm A")}
                                    </TableCell>

                                    <TableCell>
                                        {procedure.f_n_patient} {procedure.m_n_patient} {procedure.l_n_patient}
                                    </TableCell>

                                    <TableCell>
                                        {procedure.f_n_doctor} {procedure.m_n_doctor} {procedure.l_n_doctor}
                                    </TableCell>

                                    <TableCell align="center">
                                        {procedure.payment}
                                    </TableCell>

                                    <TableCell align="center">
                                        {state.works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <div key={work.id}>
                                                <span key={work.id}>
                                                    {(work.id_teeth == 1 || work.id_teeth == 2) ? "All" : work.id_teeth}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell align="center">
                                        {state.works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <div key={work.id}>
                                                <span>
                                                    {work.description}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell align="center">
                                        {state.works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <div key={work.id}>
                                                <span key={work.id}>
                                                    {work.price}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>


                                    <TableCell align="center">
                                        <Link
                                            onClick={() => history.push({ pathname: `/procedure/edit/${procedure.id}` })}
                                            className={classes.widthBtn}
                                        >
                                            <IconButton>
                                                <EditIcon className={classes.editIcon} />
                                            </IconButton>
                                        </Link>

                                        <ConfirmDelete
                                            path={`procedure/${procedure.id}`}
                                            name="Procedure"
                                            fetchData={fetchData}
                                            classNameLink={classes.widthBtn}
                                            className={classes.deleteIcon}
                                        />
                                    </TableCell>

                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}