import React, { useContext, useEffect, useState } from 'react'
import { getCookie, removeCookie } from '../cookie'
import { Link } from 'react-router-dom'
import API from '../API'
import SessionContext from './session/SessionContext'
import { toast } from "react-toastify"

import {
    Container,
    makeStyles,
    Typography,
    AppBar,
    Toolbar
} from "@material-ui/core"

import {
    Bookmark,
    List,
    ExitToApp,
    Home,
    Person,
    Settings,
    Storefront,
    Group,
    EventNote,
    Menu,
    ClearAll
} from "@material-ui/icons"

import Logo from '../images/Logo.png'

const useStyles = makeStyles(theme => ({
    container: {
        position: 'absolute',
        height: "100vh",
        color: "#FFFFFF",
        paddingTop: theme.spacing(20),
        backgroundColor: "#8BE3D9",
        position: "sticky",
        top: 0,
        [theme.breakpoints.down('sm')]: {
            display: "none",
            paddingTop: theme.spacing(10),
        },
        [theme.breakpoints.down('sm')]: {
            display: "none",
            paddingTop: theme.spacing(10),
        }
    },
    item: {
        display: "flex",
        alignItems: "center",
        color: "#FFFFFF",
        cursor: "pointer",
        borderRadius: "5px",
        textDecoration: "none",
        padding: "10px",
        '&:hover': {
            backgroundColor: "#FFFFFF",
            color: "#000000"
        },
    },
    item2: {
        display: "flex",
        alignItems: "center",
        color: "#FFFFFF",
        cursor: "pointer",
        borderRadius: "5px",
        textDecoration: "none",
        padding: "6px",
        '&:hover': {
            backgroundColor: "#FFFFFF",
            color: "#000000"
        },
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    text: {
        fontSize: 15,
        fontWeight: 400,
    },
    bottomDiv: {
        paddingTop: theme.spacing(1),
        position: 'absolute',
        bottom: 0,
        width: "80%",
        borderTop: "2px solid #FFFFFF ",
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 3,
        marginRight: 3,
        backgroundColor: "#8BE3D9"
    },
    topDiv: {
        height: "70%",
        overflowX: "hidden",
        overflowY: "visible",
        '&::-webkit-scrollbar-thumb': {
            background: "#FF0000"
        },
        ' &::-webkit-scrollbar': {
            width: 0,
            background: 'transparent',
        }
    },
    smallLogo: {
        width: '10px'
    },
    bigLogo: {
        position: 'absolute',
        top: 5,
        left: 20,
        width: '200px',
        padding: 5,
        [theme.breakpoints.down('sm')]: {
            display: "none",
        },
    },
    btnShowHide: {
        display: "none",
        position: "absolute",
        top: 10,
        right: 10,
        [theme.breakpoints.down('sm')]: {
            display: "block"
        },
    },
    toolbar: {
        display: "none",
        justifyContent: "space-between",
        backgroundColor: "#8BE3D9",
        [theme.breakpoints.down('sm')]: {
            display: "flex"
        },
    },
    logo: {
        display: "block",
    },
    showIcon: {
        alignItems: "center",
        display: (props) => (props.show ? "none" : "block"),
    },
    hideIcon: {
        alignItems: "center",
        display: (props) => (props.show ? "block" : "none"),
    },
}));


export default function Sidebar(props) {

    let view = props.view;
    const name = getCookie('username');
    const [show, setShow] = useState(true);

    const classes = useStyles({ show });

    const {
        session: { user },
        actions: { setSession }
    } = useContext(SessionContext);


    useEffect(() => {
        window.addEventListener('resize', e => {
            (window.innerWidth > 960) ?
                setShow(true) :
                setShow(false);
        })
    }, [show])


    async function handleHideShow() {
        (show) ?
            setShow(false) :
            setShow(true);
    }


    async function handleLogout() {
        try {
            await API.post('logout', { username: name });
        } catch (e) {
            console.log(e);
        }
        removeCookie('id');
        removeCookie('username');
        removeCookie('token');
        removeCookie('isAdmin');
        removeCookie('role_id');
        setSession({ user: {} });
        toast.dark("Bye Bye");
    }

    return (
        <>
            <AppBar

                style={{ display: view ? 'block' : 'none' }}
            >
                <Toolbar className={classes.toolbar}>

                    <img src={Logo} className={classes.smallLogo} alt="MOBAYED" />
                    {/* <Typography variant="h6" className={classes.logo}>
                        MOBAYED CLINIC
                    </Typography> */}

                    <div className={classes.icons}>
                        <a onClick={handleHideShow}>
                            <Menu className={classes.showIcon} />
                            <ClearAll className={classes.hideIcon} />
                        </a>
                    </div>

                </Toolbar>
            </AppBar>

            {
                (user.isAdmin) ?

                    <div style={{ display: view ? 'block' : 'none' }} >

                        <Container
                            className={classes.container}
                            style={{ display: show ? 'block' : 'none' }}
                        >

                            <img src={Logo} className={classes.bigLogo} alt="MOBAYED" />

                            <div className={classes.topDiv}>

                                <Link
                                    to="/admin/panel"
                                    className={classes.item}
                                >
                                    <Home className={classes.icon} />
                                    <Typography className={classes.text}>HOME</Typography>
                                </Link>


                                <Link
                                    to="/appointment/today"
                                    className={classes.item}
                                >
                                    <EventNote className={classes.icon} />
                                    <Typography className={classes.text}>TODAY APPOINTMENT</Typography>
                                </Link>


                                <Link
                                    to="/appointment/upcoming"
                                    className={classes.item}
                                >
                                    <EventNote className={classes.icon} />
                                    <Typography className={classes.text}>UPCOMING APPOINTMENT</Typography>
                                </Link>


                                <Link
                                    to="/procedure/list"
                                    className={classes.item}
                                >
                                    <EventNote className={classes.icon} />
                                    <Typography className={classes.text}>PROCEDURES</Typography>
                                </Link>


                                <Link
                                    to="/request/list"
                                    className={classes.item}
                                >
                                    <Bookmark className={classes.icon} />
                                    <Typography className={classes.text}>REQUESTS</Typography>
                                </Link>


                                <Link
                                    to="/payment/create"
                                    className={classes.item}
                                >
                                    <List className={classes.icon} />
                                    <Typography className={classes.text}>ADD PAYMENT</Typography>
                                </Link>


                                <Link
                                    to="/balance/list"
                                    className={classes.item}
                                >
                                    <List className={classes.icon} />
                                    <Typography className={classes.text}>BALANCE</Typography>
                                </Link>


                                <Link
                                    to="/patient/list"
                                    className={classes.item}
                                >
                                    <Group className={classes.icon} />
                                    <Typography className={classes.text}>PATIENTS</Typography>
                                </Link>


                                <Link
                                    to="/doctor/list"
                                    className={classes.item}
                                >
                                    <Person className={classes.icon} />
                                    <Typography className={classes.text}>DOCTORS</Typography>
                                </Link>


                                <Link
                                    to="/type/list"
                                    className={classes.item}
                                >
                                    <Storefront className={classes.icon} />
                                    <Typography className={classes.text}>ACTS</Typography>
                                </Link>


                                <Link
                                    to="/clinic/list"
                                    className={classes.item}
                                >
                                    <Storefront className={classes.icon} />
                                    <Typography className={classes.text}>CLINICS</Typography>
                                </Link>

                            </div>

                            <div className={classes.bottomDiv}>

                                <div style={{ 'display': (parseInt(user.role_id) === 0 ? 'block' : 'none') }}>

                                    <Link
                                        to="/admin/list"
                                        className={classes.item2}
                                    >
                                        <Group className={classes.icon} />
                                        <Typography className={classes.text}>ADMINS</Typography>
                                    </Link>


                                    <Link
                                        to="/admin/profile"
                                        className={classes.item2}
                                    >
                                        <Settings className={classes.icon} />
                                        <Typography className={classes.text}>PROFILE</Typography>
                                    </Link>
                                </div>

                                <a
                                    onClick={handleLogout}
                                    className={classes.item2}
                                >
                                    <ExitToApp className={classes.icon} />
                                    <Typography className={classes.text}>LOGOUT</Typography>
                                </a>

                            </div>
                        </Container >
                    </div >

                    :

                    <div style={{ display: view ? 'block' : 'none' }} >
                        <Container
                            className={classes.container}
                            style={{ display: show ? 'block' : 'none' }}
                        >

                            <img src={Logo} className={classes.bigLogo} alt="MOBAYED" />

                            <div className={classes.topDiv}>


                                <Link
                                    to="/patient/panel"
                                    className={classes.item}
                                >
                                    <Home className={classes.icon} />
                                    <Typography className={classes.text}>HOME</Typography>
                                </Link>


                                <Link
                                    to="/request/create"
                                    className={classes.item}
                                >
                                    <EventNote className={classes.icon} />
                                    <Typography className={classes.text}>TAKE APPOINTMENT</Typography>
                                </Link>


                                <Link
                                    to="/request/remove"
                                    className={classes.item}
                                >
                                    <EventNote className={classes.icon} />
                                    <Typography className={classes.text}> LIST REQUESTS</Typography>
                                </Link>


                                <Link
                                    to="/patient/appointment"
                                    className={classes.item}
                                >
                                    <EventNote className={classes.icon} />
                                    <Typography className={classes.text}>LIST APPOINTMENTS</Typography>
                                </Link>


                                <Link
                                    to="/patient/procedure"
                                    className={classes.item}
                                >
                                    <Bookmark className={classes.icon} />
                                    <Typography className={classes.text}>LIST PROCEDURES</Typography>
                                </Link>


                            </div>

                            <div className={classes.bottomDiv}>

                                <Link
                                    to="/patient/profile"
                                    className={classes.item2}
                                >
                                    <Settings className={classes.icon} />
                                    <Typography className={classes.text}>PROFILE</Typography>
                                </Link>

                                <a
                                    onClick={handleLogout}
                                    className={classes.item2}
                                >
                                    <ExitToApp className={classes.icon} />
                                    <Typography className={classes.text}>LOGOUT</Typography>
                                </a>
                            </div>

                        </Container >
                    </div >
            }
        </>
    );
}


