import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import { Link } from "react-router-dom"
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
    CssBaseline,
    makeStyles,
    Typography,
    IconButton
} from '@material-ui/core'

import AddBoxIcon from '@material-ui/icons/AddBox'
import EditIcon from '@material-ui/icons/Edit'

import ConfirmDelete from "../../../components/ConfirmDelete"

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: 5,
        marginBottom: 30
    },
    paperFilter: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
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

export default function List_Admin() {

    const classes = useStyles();
    const history = useHistory();

    const [admins, setAdmins] = useState([]);

    let { session: { user: { id, token } } } = useContext(SessionContext);

    async function fetchData() {
        try {
            await API.get('admin', {
                headers: {
                    id: id,
                    token: token
                }
            })
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    console.log(data);
                    if (success)
                        setAdmins(data);
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <CssBaseline />

            <Typography variant="h3" align="center" className="titlePage">
                Admins
            </Typography>

            <Container className={classes.container}>

                <Link
                    onClick={() => history.push({ pathname: '/admin/create' })}
                    className={classes.ddBoxIconBtnLink}
                >

                    <Paper align="center" className={classes.ddBoxIconBtn}>
                        <AddBoxIcon className={classes.ddBoxIcon} />
                        Add Admin
                    </Paper>
                </Link>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {admins.map(admin =>
                                <TableRow key={admin.id}>

                                    <TableCell>
                                        {admin.id}
                                    </TableCell>

                                    <TableCell>
                                        {admin.first_name} {admin.middle_name} {admin.last_name}
                                    </TableCell>

                                    <TableCell>
                                        {admin.username}
                                    </TableCell>

                                    <TableCell>
                                        {admin.phone}
                                    </TableCell>

                                    <TableCell align="center">

                                        <Link
                                            onClick={() => history.push({ pathname: `/admin/edit/${admin.id}` })}
                                            className={classes.widthBtn}
                                        >
                                            <IconButton>
                                                <EditIcon className={classes.editIcon} />
                                            </IconButton>
                                        </Link>

                                        <ConfirmDelete
                                            path={`admin/${admin.id}`}
                                            name="Admin"
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