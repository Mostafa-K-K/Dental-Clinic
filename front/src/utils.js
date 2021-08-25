import { Route, Redirect } from 'react-router-dom';

/**
 * Cast variable to Boolean
 * @param {String|Boolean} bool 
 * @returns Boolean
 */
export function castBool(bool) {
    if (bool === 'true' || bool === true) return true;
    return false;
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
            <Redirect {...props} to={(user.isAdmin) ? "/number/patient" : "/patient/panel"} /> :
            <Comp {...props} />
        } />
    )
}


/**
 * 
 * @param {Obj|Component | Props} Route 
 * @returns Route 
 */
export function PrivateRouteSuperAdmin({ user, component, ...props }) {
    let Comp = component;
    return (
        <Route {...props} render={props => user.token && user.isAdmin && parseInt(user.role_id) === 0 ?
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
    return (
        <Route {...props} render={props => user.token && user.isAdmin ?
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
        <Route {...props} render={props => user.token && !user.isAdmin ?
            <Comp {...props} /> :
            <Redirect {...props} to="/" />
        } />
    )
}