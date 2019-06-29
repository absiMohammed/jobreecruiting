import React, { Component } from 'react';
import { Container, Header, Content, Left, Button, Icon, Right, Text } from 'native-base';
import { Link, LinkingIOS, AsyncStorage, Alert, ListView, StatusBar, ImageBackground, Dimensions, StyleSheet, Platform } from 'react-native';
import { DrawerActions } from 'react-navigation'
import Constants from "../config";
import Spinner from "react-native-loading-spinner-overlay";

const launchscreenBg = require("../assets/launchscreen-bg.png");


const datas = [];

export default class Main extends Component {
     constructor(props) {
         super(props);
         this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
         this.state = {
             basic: true,
             listViewData: datas,
             spinnerVisible: true,
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

         try {

             let response = await fetch(Constants.urls.root+'api/employee/view', {
                 method: 'GET',
                 headers: {
                     Accept: 'application/json',
                     'Content-Type': 'application/json',
                     'Authorization': 'Bearer '+this.state.userToken.token
                 }
             });
             let responseJson = await response.json()

             this.setState({ spinnerVisible: false });
             this.setState({listViewData: responseJson})
             console.log("response:", responseJson);

         } catch (e) {
             this.setState({spinnerVisible: false});
             Alert.alert(
                 "Error",
                 "An error occurred, please ensure you are connected to the internet and try again",
                 [
                     {text: "Try Again", onPress: () => console.log('OK Pressed')}
                 ],
                 {cancelable: false}
             )
             console.log("caught", e)
         }
     };

    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };

    render() {


        let vary;
        vary = this.state.user.role_id ? this.state.user.role_id  : 3;
        return (

            <Container>
                <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
                <Header transparent
                        hasTabs androidStatusBarColor="#263238">
                    <Left>
                        <Button transparent
                                onPress={this.toggleDrawer}>

                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Right />
                </Header>
                <StatusBar barStyle="light-content"/>
                <Spinner visible={this.state.spinnerVisible}
                         textStyle={{ color: '#8bb4c2', fontSize: 16, marginTop: -30 }}
                         color={'#8bb4c2'}
                         textContent={'Logging In'} />
                    <Content>
                        <Button
                            onPress={() => this.props.navigation.navigate("ManageSkills")}
                            block primary style={styles.buttonForwardTop}>
                            <Text style={ styles.textForward}>مهاراتي</Text>
                        </Button>
                        <Button
                            onPress={() => this.props.navigation.navigate("AddSkill")}
                            block primary style={styles.buttonForward}>
                            <Text style={ styles.textForward}>اضافة مهارة</Text>
                        </Button>
                        <Button
                            onPress={() => this.props.navigation.navigate("MyJobList")}
                            block primary  style={styles.buttonForward}>
                            <Text style={ styles.textForward}>مهماتي</Text>
                        </Button>
                        <Button
                            onPress={() => this.props.navigation.navigate("JobSearchList")}
                            block primary style={styles.buttonForward}>
                            <Text style={ styles.textForward}>بحث عن مهمة</Text>
                        </Button>


                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    searchIcon: {
        marginTop:10,
        color:'white',
        padding: 13,
        backgroundColor: '#005063'
    },
    imageContainer: {
        flex: 1,
        width: null,
        height: null
    },
    logoContainer: {
        flex: 1,
        marginTop: deviceHeight / 12,
        // marginBottom: 30
    },
    logo: {
        position: "absolute",
        left: Platform.OS === "android" ? 40 : 50,
        top: Platform.OS === "android" ? 35 : 60,
        width: 280,
        height: 200,
    },
    buttonForward: {
        alignSelf: 'stretch',
        borderWidth: 0.5,
        borderColor: '#6582a3',
        backgroundColor: 'transparent',
        marginLeft: 70,
        height:50,
        marginRight: 70,
        marginBottom: 10,
        borderRadius:10
    },

    buttonForwardTop: {

        alignSelf: 'stretch',
        borderWidth: 0.5,
        borderColor: '#6582a3',
        backgroundColor: 'transparent',
        marginLeft: 70,
        height:50,
        marginRight: 70,
        marginBottom: 10,
        borderRadius:10,
        marginTop: 120,
    },
    textForward: {
        fontFamily: "GE SS Two Light",
        fontSize: 30,
        color:'#6582a3'
    },
    text: {
        color: "#D8D8D8",
        bottom: 6,
        marginTop: 5
    },
    text2: {
        color: "#fde428",
        bottom: 6,
        marginTop: 5,
    },
})
