import { Route, Redirect } from 'react-router-dom'


/**
 * 
 * @param {Obj|Component | Props} Route 
 * @returns Route 
 */
export function PrivateRouteSuperAdmin({ user, component, ...props }) {
    let Comp = component;
    return (
        <Route {...props} render={props => (user.token && user.role_id == "_SuPE8/@DmIn&^%(0)__") ?
            <Comp {...props} /> :
            <Redirect {...props} to="/" />
        } />
    )
}


/**
 * 
 * @param {Obj|Component | Props} Route 
 * @returns Route 
 */
export function PrivateRouteAdmin({ user, component, ...props }) {
    let Comp = component;
    console.log("heyyy userrr", user);
    return (
        <Route {...props} render={props => (user.token && (user.role_id == "_SuPE8/@DmIn&^%(0)__" || user.role_id == "AD&Mii#iin(,.<1)>mEe")) ?
            <Comp {...props} /> :
            <Redirect {...props} to="/" />
        } />
    )
}


/**
 * 
 * @param {Obj|Component | Props} Route 
 * @returns Route 
 */
export function PrivateRoutePatient({ user, component, ...props }) {
    let Comp = component;
    return (
        <Route {...props} render={props => (user.token && user.role_id === "paTI__enT?/@cc!untQq") ?
            <Comp {...props} /> :
            <Redirect {...props} to="/" />
        } />
    )
}


/**
 * 
 * @param {Obj|Component | Props} Route 
 * @returns Route 
 */
export function PublicRoute({ user, component, ...props }) {
    let Comp = component;
    return (
        <Route {...props} render={props => user.token ?
            <Redirect {...props} to={(user.role_id === "_SuPE8/@DmIn&^%(0)__" || user.role_id === "AD&Mii#iin(,.<1)>mEe") ? "/admin/panel" : ((user.role_id === "paTI__enT?/@cc!untQq") ? "/patient/panel" : "/")} /> :
            <Comp {...props} />
        } />
    )
}