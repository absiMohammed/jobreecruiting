import React from "react";
import Login from "./screens/Login";
import Splash from "./screens/Splash";
import Main from "./screens/Main";
import AddCompany from "./screens/AddCompany";
import JobSearchList from "./screens/JobSearchList";
import AddSkill from "./screens/AddSkill";
import AddJob from "./screens/AddJob";
import EditJob from "./screens/EditJob";
import ManageCompanies from "./screens/MyJobList";
import MyJobList from "./screens/MyJobList";
import ManageSkills from "./screens/ManageSkills";
import ManageJobs from "./screens/ManageJobs";
import EditCompany from "./screens/EditCompany";
import ViewJobUsers from "./screens/ViewJobUsers";
import ViewUser from "./screens/ViewUser";
import EditEmployee from "./screens/EditEmployee";
import ViewCompany from "./screens/ViewCompany";
import ViewEmployee from "./screens/ViewEmployee";
import ViewJob from "./screens/ViewJob";
import SideBar from "./screens/SideBar";
import EditSkill from "./screens/EditSkill";
import ViewSkill from "./screens/ViewSkill";

import { createDrawerNavigator, createStackNavigator, createAppContainer , createSwitchNavigator } from "react-navigation";


const auth = createStackNavigator({ Login : Login },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    });

const splash = createStackNavigator({ Splash : Splash },
    {
        headerMode: 'none',
        navigationOptions: {
            header: null,
        },
        navigationBarStyle : {navBarHidden: true },
    });


const drawer1 =  createStackNavigator(
    {
        Main: { screen: Main },
        AddCompany: { screen: AddCompany },
        AddSkill: { screen: AddSkill },
        ManageCompanies: { screen: ManageCompanies },
        JobSearchList: { screen: JobSearchList },
        MyJobList: { screen: MyJobList },
        EditSkill: { screen: EditSkill },
        ManageSkills: { screen: ManageSkills },
        EditCompany: { screen: EditCompany },
        EditEmployee: { screen: EditEmployee },
        ViewUser: { screen: ViewUser },
        AddJob: { screen: AddJob },
        EditJob: { screen: EditJob },
        ViewCompany: { screen: ViewCompany },
        ManageJobs: { screen: ManageJobs },
        ViewJobUsers: { screen: ViewJobUsers },
        ViewJob: { screen: ViewJob },
        ViewSkill: { screen: ViewSkill },
        ViewEmployee: { screen: ViewEmployee },
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }

);

const DrawerRouter = createDrawerNavigator(
    {
        drawer1: { screen: drawer1 }
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);


const HomeScreenRouter = createAppContainer(
    createSwitchNavigator(
            {
                splashRoute: splash,
                authRoute: auth,
                app: DrawerRouter
            },
            {
                initialRouteName: 'splashRoute',
            })
);








export default (HomeScreenRouter)

