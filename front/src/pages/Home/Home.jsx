import React from "react"

import { CssBaseline } from "@material-ui/core"

export default function Home() {

    return (
        <>
            <CssBaseline />
            <div className="containerSvg">
                <svg className="svgStyle" viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet">
                    <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" style={{ stroke: 'none', fill: 'white' }}></path>
                </svg>
            </div>
        </>
    )
}