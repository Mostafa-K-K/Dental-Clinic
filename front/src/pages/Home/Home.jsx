import React from "react"
import { useHistory } from "react-router"

import { makeStyles, Typography } from "@material-ui/core"
import { ExitToApp } from "@material-ui/icons"

import Logo from '../../images/Logo_L.svg'

const useStyles = makeStyles(theme => ({
    container: {
        height: "100vh",
        color: "#FFFFFF",
        backgroundColor: "#8BE3D9",
    },
    bigLogo: {
        width: "50%"
    },
    item2: {
        color: "#FFFFFF",
        cursor: "pointer",
        borderRadius: "5px",
        textDecoration: "none",
        padding: "6px",
        '&:hover': {
            backgroundColor: "#FFFFFF",
            color: "#6DCFF6"
        },
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    text: {
        fontSize: 15,
        fontWeight: 400,
    },
}));

export default function Home() {

    const history = useHistory();
    const classes = useStyles();

    return (
        <div className={classes.container}>

            <a
                onClick={() => history.push({ pathname: "/login" })}
                className={classes.item2}
            >
                <ExitToApp className={classes.icon} />
                <Typography className={classes.text}>Sign in</Typography>
            </a>

            <img src={Logo} className={classes.bigLogo} alt="MOBAYED" />
        </div>
        // <Link to="/login">Login</Link>
        // <br /><br />
        // <Link to="/register">Register</Link>
    )
}