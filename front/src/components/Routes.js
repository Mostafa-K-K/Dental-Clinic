import React, { useContext } from 'react'
import { Switch } from 'react-router-dom'

import Update_Profile_Admin from '../pages/SuperAdmin_Panel/Manage_Profile/Update_Profile'
import Change_Password_Admin from '../pages/SuperAdmin_Panel/Manage_Profile/Change_Password_Admin'
import Change_Username_Admin from '../pages/SuperAdmin_Panel/Manage_Profile/Change_Username_Admin'
import Change_Information_Admin from '../pages/SuperAdmin_Panel/Manage_Profile/Change_Information_Admin'

import List_Admin from '../pages/SuperAdmin_Panel/Manage_Admin/List_Admin'
import Create_Admin from '../pages/SuperAdmin_Panel/Manage_Admin/Create_Admin'
import Edit_Admin from '../pages/SuperAdmin_Panel/Manage_Admin/Edit_Admin'

import List_Doctor from '../pages/Admin_Panel/Manage_Doctor/List_Doctor'
import Edit_Doctor from '../pages/Admin_Panel/Manage_Doctor/Edit_Doctor'
import Create_Doctor from '../pages/Admin_Panel/Manage_Doctor/Create_Doctor'

import List_Patient from '../pages/Admin_Panel/Manage_Patient/List_Patient'
import Edit_Patient from '../pages/Admin_Panel/Manage_Patient/Edit_Patient'
import Create_Patient from '../pages/Admin_Panel/Manage_Patient/Create_Patient'

import List_Clinic from '../pages/Admin_Panel/Manage_Clinic/List_Clinic'
import Edit_Clinic from '../pages/Admin_Panel/Manage_Clinic/Edit_Clinic'
import Create_Clinic from '../pages/Admin_Panel/Manage_Clinic/Create_Clinic'

import List_Type from '../pages/Admin_Panel/Manage_Type/List_Type'
import Edit_Type from '../pages/Admin_Panel/Manage_Type/Edit_Type'
import Create_Type from '../pages/Admin_Panel/Manage_Type/Create_Type'

import Old_Request from '../pages/Admin_Panel/Manage_Request/Old_Request'
import List_Request from '../pages/Admin_Panel/Manage_Request/List_Request'
import Create_Appointment_Patient from '../pages/Admin_Panel/Manage_Request/Create_Appointment_Patient'

import Today_Appointment from '../pages/Admin_Panel/Manage_Appointment/Today_Appointment'
import History_Appointment from '../pages/Admin_Panel/Manage_Appointment/History_Appointment'
import Upcoming_Appointment from '../pages/Admin_Panel/Manage_Appointment/Upcoming_Appointment'
import Edit_Appointment from '../pages/Admin_Panel/Manage_Appointment/Edit_Appointment'
import Create_Appointment from '../pages/Admin_Panel/Manage_Appointment/Create_Appointment'

import List_Procedure from '../pages/Admin_Panel/Manage_Procedure/List_Procedure'
import Edit_Procedure from '../pages/Admin_Panel/Manage_Procedure/Edit_Procedure'
import Create_Procedure from '../pages/Admin_Panel/Manage_Procedure/Create_Procedure'

import Create_Payment from '../pages/Admin_Panel/Manage_Payment/Create_Payment'
import List_Balance from '../pages/Admin_Panel/Manage_Payment/List_Balance'
import Details_Balance from '../pages/Admin_Panel/Manage_Payment/Details_Balance'
import Add_Payment from '../pages/Admin_Panel/Manage_Payment/Add_Payment'

import Update_Profile from '../pages/Patient_Panel/Update_Profile'

import All_Procedure from '../pages/Patient_Panel/All_Procedure'
import Next_Appointment from '../pages/Patient_Panel/Next_Appointment'

import Remove_Request from '../pages/Patient_Panel/Manage_Request/Remove_Request'
import Create_Request from '../pages/Patient_Panel/Manage_Request/Create_Request'

import Patient_Panel from '../pages/Patient_Panel/Patient_Panel'
import Admin_Panel from '../pages/Admin_Panel/Admin_Panel'

import Home from '../pages/Home/Home'
import Login from '../pages/Home/Login'
import Register from '../pages/Home/Register'

import SidebarAdmin from './SidebarAdmin'
import SidebarPatient from './SidebarPatient'

import SessionContext from './session/SessionContext'
import { PublicRoute, PrivateRouteSuperAdmin, PrivateRouteAdmin, PrivateRoutePatient } from '../utils'

export default function Routes() {

    let { session: { user } } = useContext(SessionContext);

    return (
        <div>
            {(user.isAdmin) ?
                <SidebarAdmin view={user.token ? true : false} /> :
                <SidebarPatient view={user.token ? true : false} />
            }

            <Switch>

                <PublicRoute user={user} path="/" component={Home} exact />
                <PublicRoute user={user} path="/login" component={Login} />
                <PublicRoute user={user} path="/register" component={Register} />




                <PrivateRouteSuperAdmin user={user} path="/admin/profile" component={Update_Profile_Admin} exact />

                <PrivateRouteSuperAdmin user={user} path="/admin/profile/information" component={Change_Information_Admin} />
                <PrivateRouteSuperAdmin user={user} path="/admin/profile/username" component={Change_Username_Admin} />
                <PrivateRouteSuperAdmin user={user} path="/admin/profile/password" component={Change_Password_Admin} />

                <PrivateRouteSuperAdmin user={user} path="/admin/list" component={List_Admin} />
                <PrivateRouteSuperAdmin user={user} path="/admin/edit/:id" component={Edit_Admin} />
                <PrivateRouteSuperAdmin user={user} path="/admin/create" component={Create_Admin} />




                <PrivateRouteAdmin user={user} path="/admin/panel" component={Admin_Panel} />

                <PrivateRouteAdmin user={user} path="/doctor/list" component={List_Doctor} />
                <PrivateRouteAdmin user={user} path="/doctor/edit/:id" component={Edit_Doctor} />
                <PrivateRouteAdmin user={user} path="/doctor/create" component={Create_Doctor} />

                <PrivateRouteAdmin user={user} path="/patient/list" component={List_Patient} />
                <PrivateRouteAdmin user={user} path="/patient/edit/:id" component={Edit_Patient} />
                <PrivateRouteAdmin user={user} path="/patient/create" component={Create_Patient} />

                <PrivateRouteAdmin user={user} path="/clinic/list" component={List_Clinic} />
                <PrivateRouteAdmin user={user} path="/clinic/edit/:id" component={Edit_Clinic} />
                <PrivateRouteAdmin user={user} path="/clinic/create" component={Create_Clinic} />

                <PrivateRouteAdmin user={user} path="/type/list" component={List_Type} />
                <PrivateRouteAdmin user={user} path="/type/edit':id" component={Edit_Type} />
                <PrivateRouteAdmin user={user} path="/type/create" component={Create_Type} />

                <PrivateRouteAdmin user={user} path="/appointment/today" component={Today_Appointment} />
                <PrivateRouteAdmin user={user} path="/appointment/history" component={History_Appointment} />
                <PrivateRouteAdmin user={user} path="/appointment/upcoming" component={Upcoming_Appointment} />
                <PrivateRouteAdmin user={user} path="/appointment/edit/:id" component={Edit_Appointment} />
                <PrivateRouteAdmin user={user} path="/appointment/create" component={Create_Appointment} />

                <PrivateRouteAdmin user={user} path="/request/old" component={Old_Request} />
                <PrivateRouteAdmin user={user} path="/request/list" component={List_Request} />
                <PrivateRouteAdmin user={user} path="/create/appointment/patient/:id/:id_patient" component={Create_Appointment_Patient} />

                <PrivateRouteAdmin user={user} path="/procedure/list" component={List_Procedure} />
                <PrivateRouteAdmin user={user} path="/procedure/edit/:id" component={Edit_Procedure} />
                <PrivateRouteAdmin user={user} path="/procedure/create" component={Create_Procedure} />

                <PrivateRouteAdmin user={user} path="/payment/create" component={Create_Payment} />
                <PrivateRouteAdmin user={user} path="/balance/list" component={List_Balance} />
                <PrivateRouteAdmin user={user} path="/balance/details/:id" component={Details_Balance} />
                <PrivateRouteAdmin user={user} path="/balance/add/payment/:id" component={Add_Payment} />




                <PrivateRoutePatient user={user} path="/patient/panel" component={Patient_Panel} />

                <PrivateRoutePatient user={user} path="/patient/panel" component={Patient_Panel} />
                <PrivateRoutePatient user={user} path="/patient/profile" component={Update_Profile} />

                <PrivateRoutePatient user={user} path="/patient/procedure" component={All_Procedure} />
                <PrivateRoutePatient user={user} path="/patient/appointment" component={Next_Appointment} />

                <PrivateRoutePatient user={user} path="/request/create" component={Create_Request} />
                <PrivateRoutePatient user={user} path="/request/remove" component={Remove_Request} />

            </Switch>
        </div>
    )
}