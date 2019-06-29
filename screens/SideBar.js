import React, {Component} from "react";
import {AppRegistry,View, Image, StatusBar, Platform, StyleSheet, Dimensions, AsyncStorage, Alert} from "react-native";
import { Container, Content, Text, List, ListItem, Left, Icon } from "native-base";

const drawerCover = require("../assets/drawer-cover.png");
const drawerImage = require("../assets/logo-kitchen-sink.png");
const routes_1 =  [
    {
        name: "الرئيسية",
        route: "Main",
        icon: "md-filing"
    },
    {
        name: "تسجيل الخروج",
        route: "Login",
        icon: "md-power"
    }

    ];

const routes_2 =  [
    {
        name: "الرئيسية",
        route: "Main",
        icon: "md-filing"
    },
    {
        name: "اضافة مهمة",
        route: "AddJob",
        icon: "md-add"
    },
    {
        name: "ادارة المهام",
        route: "ManageJobs",
        icon: "md-list"
    },
    {
        name: "اضافة مهارة",
        route: "AddSkill",
        icon: "person-add"
    },
    {
        name: "مهاراتي",
        route: "ManageSkills",
        icon: "md-create"
    },

    {
        name: "تسجيل الخروج",
        route: "Login",
        icon: "md-power"
    }

];

const routes_3 =  [
    {
        name: "الرئيسية",
        route: "Main",
        icon: "md-filing"
    },
    {
        name: "اضافة مهارة",
        route: "AddSkill",
        icon: "person-add"
    },
    {
        name: "ادارة المهارات",
        route: "ManageSkills",
        icon: "md-create"
    },
    {
        name: "تسجيل الخروج",
        route: "Login",
        icon: "md-power"
    }

];

export default class SideBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shadowOffsetWidth: 1,
            shadowRadius: 4,
            user: []
        };
    }

    componentDidMount = async() => {

        try {
            const value = await AsyncStorage.getItem('api/user');
            const user = await AsyncStorage.getItem('api/userInfo');
            this.setState({userToken: JSON.parse(value),user: JSON.parse(user) });
        } catch (error) {
            this.props.navigation.navigate("Login");
            Alert.alert(
                "Error",
                "Your session expired, please login again",
                [
                    {text: "Ok", onPress: () => console.log('OK Pressed')}
                ],
                {cancelable: false}
            )
        }
    }

    render() {
        let vary;
        vary = this.state.user.role_id ? parseInt(this.state.user.role_id)  : 3;

            return (
                <Container>
                    <Content
                        bounces={false}
                        style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
                    >
                        <Image source={drawerCover} style={styles.drawerCover} />
                        <Image square style={styles.drawerImage} source={drawerImage} />

                        <List
                            dataArray={vary === 1 ? routes_1 : (vary === 2 ?  routes_2 :  routes_2)}
                            renderRow={data =>

                                <ListItem
                                    button
                                    noBorder
                                    onPress={async () => {
                                        const { navigation : {navigate} } = this.props;
                                        if(data.route == "Login"){
                                            await AsyncStorage.removeItem('api/user')
                                            await AsyncStorage.removeItem('api/role')
                                        }
                                        return navigate(data.route)

                                    }}
                                >
                                    <Left>
                                        <Icon
                                            active
                                            name={data.icon}
                                            style={{ color: "#777", fontSize: 26, width: 30 }}
                                        />
                                        <Text style={styles.text}>
                                            {data.name}
                                        </Text>
                                    </Left>
                                </ListItem>}
                        />

                    </Content>
                </Container>
            );


    }


}
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    drawerCover: {
        alignSelf: "stretch",
        height: deviceHeight / 3.5,
        width: null,
        position: "relative",
        marginBottom: 10

    },
    drawerImage: {
        position: "absolute",
        left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
        top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
        width: 210,
        height: 130,
        resizeMode: "cover"
    },
    text: {
        fontWeight: Platform.OS === "ios" ? "500" : "400",
        fontSize: 16,
        fontFamily: "GE SS Two Light",
        marginLeft: 20
    },
    badgeText: {
        fontSize: Platform.OS === "ios" ? 13 : 11,
        fontWeight: "400",
        textAlign: "center",
        marginTop: Platform.OS === "android" ? -3 : undefined
    }
})
