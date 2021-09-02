import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import { Link } from "react-router-dom"
import moment from 'moment'
import API from "../../../API"
import SessionContext from "../../../components/session/SessionContext"

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Container,
    Paper,
    TextField,
    CssBaseline,
    makeStyles,
    Typography,
    IconButton,
    Button
} from '@material-ui/core'

import AddBoxIcon from '@material-ui/icons/AddBox'
import EditIcon from '@material-ui/icons/Edit'

import {
    ArrowDropUp,
    ArrowDropDown
} from '@material-ui/icons'

import ConfirmDelete from "../../../components/ConfirmDelete"

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: 5,
        marginBottom: 30,
    },
    paperFilter: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
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
    },
    iconDownUp: {
        position: "relative",
        top: 6,
        textDecoration: "none",
        color: "#272727"
    },
    iconDU: {
        fontSize: 26
    },
    linkOrder: {
        textDecoration: "none",
        color: "#272727"
    },
    paginationDiv: {
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10
    },
    btnPagination: {
        display: "flex",
        flexDirection: "row",
        '& Button': {
            marginLeft: 4,
        },
        '& .BtnPageActive': {
            backgroundColor: "#BEF4F4"
        },
        '& .BtnPage': {
            '&:hover': {
                backgroundColor: "#e0e0e0"
            }
        }
    },
    buttonNextPrev: {
        width: 100,
        padding: 3,
        fontWeight: "none",
        fontSize: 12
    },
}));

export default function List_Patient() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        patients: [],
        rows: 0,
        pages: 0,
        nbPatient: 0,
        page: 1,
        pagination: [],
        orderBy: "id",
        desc: false,

        name: "",
        gender: "Male",
        marital: "Single"
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

    async function fetchData() {
        try {
            let reqBody = {
                rows: state.rows,
                orderBy: state.orderBy,
                desc: state.desc,
                name: state.name
            }

            await API.post(`paginpatient`, reqBody, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success)
                        setState({ patients: data });
                });

            await API.post(`patientcount`, reqBody, {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        setState({ nbPatient: result });
                        let pages = Math.ceil(result / 10);
                        setState({ pages: pages });

                        if (pages !== state.pages) {

                            setState({ page: 1, rows: 0 });

                            if (pages >= 10) {
                                setState({ pagination: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
                            } else {
                                var i = 1;
                                let arr = [];
                                while (i <= pages) {
                                    arr.push(i);
                                    i++;
                                }
                                setState({ pagination: arr });
                            }
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function handlePagination(pg) {
        if ((pg >= 1) && (pg <= state.pages)) {
            setState({ page: pg, });
            setState({ rows: (pg - 1) * 10 });

            let arr = [];
            if (pg > state.pagination[9]) {
                state.pagination.forEach(i => { arr.push(i + 1); });
                setState({ pagination: arr });
            }

            if (pg < state.pagination[0]) {
                state.pagination.forEach(i => { arr.push(i - 1); });
                setState({ pagination: arr });
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(state)]);

    return (
        <>
            <CssBaseline />
            <Typography variant="h3" align="center" className="titlePage">
                Patients
            </Typography>

            <Container className={classes.container}>

                <Link
                    onClick={() => history.push({ pathname: '/patient/create' })}
                    className={classes.ddBoxIconBtnLink}
                >

                    <Paper align="center" className={classes.ddBoxIconBtn}>
                        <AddBoxIcon className={classes.ddBoxIcon} />
                        Add Patient
                    </Paper>
                </Link>

                <Paper className={classes.paperFilter}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Search"
                        name="name"
                        value={state.name}
                        onChange={handleChange}
                        className={classes.root}
                    />
                </Paper>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>

                                <TableCell align="center">
                                    <Link
                                        onClick={() => setState({ orderBy: "id" })}
                                        className={classes.linkOrder}
                                    >
                                        #
                                    </Link>
                                    {(state.orderBy === "id") ?
                                        <Link
                                            onClick={() => (state.desc) ? setState({ desc: false }) : setState({ desc: true })}
                                            className={classes.iconDownUp}
                                        >
                                            {(state.desc) ?
                                                <ArrowDropDown className={classes.iconDU} /> :
                                                <ArrowDropUp className={classes.iconDU} />
                                            }
                                        </Link>
                                        : null}
                                </TableCell>

                                <TableCell align="center">
                                    <Link
                                        onClick={() => setState({ orderBy: "first_name" })}
                                        className={classes.linkOrder}
                                    >
                                        Full Name
                                    </Link>
                                    {(state.orderBy === "first_name") ?
                                        <Link
                                            onClick={() => (state.desc) ? setState({ desc: false }) : setState({ desc: true })}
                                            className={classes.iconDownUp}
                                        >
                                            {(state.desc) ?
                                                <ArrowDropDown className={classes.iconDU} /> :
                                                <ArrowDropUp className={classes.iconDU} />
                                            }
                                        </Link> :
                                        null}
                                </TableCell>

                                <TableCell align="center">Gender</TableCell>
                                <TableCell align="center">Marital</TableCell>
                                <TableCell align="center">Birth</TableCell>
                                <TableCell align="center">Phone</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">Health</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {state.patients.map(patient =>
                                <TableRow key={patient.id}>

                                    <TableCell align="center">
                                        {patient.id}
                                    </TableCell>

                                    <TableCell align="center">
                                        {patient.first_name} {patient.middle_name} {patient.last_name}
                                    </TableCell>

                                    <TableCell align="center">
                                        {patient.gender}
                                    </TableCell>

                                    <TableCell align="center">
                                        {patient.marital}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(patient.birth).format("YYYY-MM-DD")}
                                    </TableCell>

                                    <TableCell align="center">
                                        {patient.phone}
                                    </TableCell>

                                    <TableCell align="center">
                                        {patient.address}
                                    </TableCell>

                                    <TableCell align="center">
                                        {patient.health}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Link
                                            onClick={() => history.push({ pathname: `/patient/edit/${patient.id}` })}
                                            className={classes.widthBtn}
                                        >
                                            <IconButton>
                                                <EditIcon className={classes.editIcon} />
                                            </IconButton>
                                        </Link>

                                        <ConfirmDelete
                                            path={`patient/${patient.id}`}
                                            name="Patient"
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

                <Paper className={classes.paginationDiv}>
                    <Typography>
                        Showing  <b>{(state.rows + 10 > state.nbPatient) ? state.nbPatient : state.rows + 10}</b> of <b>{state.nbPatient}</b> patients
                    </Typography>


                    <div className={classes.btnPagination}>
                        <Button
                            type="button"
                            variant="contained"
                            className={classes.buttonNextPrev}
                            onClick={() => handlePagination(state.page - 1)}
                        >
                            Previous
                        </Button>

                        {state.pagination.map(pg =>
                            <Button
                                className={(state.page === pg) ? "BtnPageActive" : "BtnPage"}
                                onClick={() => handlePagination(pg)}
                            >
                                {pg}
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            className={classes.buttonNextPrev}
                            onClick={() => handlePagination(state.page + 1)}
                        >
                            Next
                        </Button>

                    </div>
                </Paper>
            </Container>
        </>
    )
}