import React from "react";
import {StyleSheet, ListView, AsyncStorage, Alert, ImageBackground} from "react-native";
import { Container, Body, Content, Header, Left, Right, List, ListItem, Thumbnail, Button, Text, Icon, Title } from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from "../config";
import {DrawerActions} from "react-navigation";

const launchscreenBg = require("../assets/launchscreen-bg.png");

const datas = [];

export default class ManageSkills extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            basic: true,
            listViewData: datas,
            spinnerVisible: true,
        };
    }
    componentDidMount = async() => {
        try {
            const value = await AsyncStorage.getItem('api/user');
            if (value !== null) {
                console.log("token", value);
                this.setState({ userToken: JSON.parse(value) });
            }
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

            let response = await fetch(Constants.urls.root+'api/job-user/view', {
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
    }

    _onApprove = async(id) => {
        this.setState({ spinnerVisible: true });
        try {
            let response = await fetch(Constants.urls.root+'/api/job-user/approve/'+id, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userToken.token
                },
            });
            let responseJson = await response.json();
            console.log("response:", responseJson);
            if(responseJson.status === "success"){
                 this.setState({ spinnerVisible: false });
                console.log("done", responseJson)
            }else{
                 this.setState({ spinnerVisible: false });
                this.props.navigation.navigate('ManageEmployees');
                Alert.alert(
                    "Error",
                    responseJson.message,
                    [
                        { text: "Try Again", onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                )
            }
        } catch (error) {
             this.setState({ spinnerVisible: false });
            this.props.navigation.navigate('ManageEmployees');
            Alert.alert(
                "Error",
                "An error occurred, please ensure you are connected to the internet and try again",
                [
                    { text: "Try Again", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }

    };
    _onReject = async(id) => {
        this.setState({ spinnerVisible: true });
        try {
            let response = await fetch(Constants.urls.root+'/api/job-user/reject/'+id, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userToken.token
                },
            });
            let responseJson = await response.json();
            console.log("response:", responseJson);
            if(responseJson.status === "success"){
                 this.setState({ spinnerVisible: false });
                console.log("done", responseJson)
            }else{
                 this.setState({ spinnerVisible: false });
                this.props.navigation.navigate('ManageEmployees');
                Alert.alert(
                    "Error",
                    responseJson.message,
                    [
                        { text: "Try Again", onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                )
            }
        } catch (error) {
             this.setState({ spinnerVisible: false });
            this.props.navigation.navigate('ManageEmployees');
            Alert.alert(
                "Error",
                "An error occurred, please ensure you are connected to the internet and try again",
                [
                    { text: "Try Again", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }

    }


    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };

    render() {
        return (
            <Container style={styles.container}>
                <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
                    <Header transparent
                            hasTabs androidStatusBarColor="#263238">
                    <Left>
                        <Button transparent
                                onPress={this.toggleDrawer}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                    <Title>المتقدمين للمهمة</Title>
                    </Body>
                        <Right>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-forward" />
                            </Button>
                        </Right>
                </Header>
                <Spinner visible={this.state.spinnerVisible}
                         textStyle={{ color: '#8bb4c2', fontSize: 16, marginTop: -30 }}
                         color={'#8bb4c2'}/>

                <Content padder style={{'backgroundColor': '#ffffff'}}>
                    { this.state.listViewData.length < 1 ?
                        <Text style={{textAlign: "center", marginTop: 50 }}>
                           لا يوجد أي متقدمين للمهمة حاليا
                        </Text>
                        :
                    <List
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={data =>
                            <ListItem thumbnail style={{ paddingLeft: 20 }}>
                            <Left>
                            <Thumbnail source={require('../assets/avatar.png' )} />
                            </Left>
                            <Body>
                            <Text>{data.user.name}</Text>

                                <Text note numberOfLines={3}>
                                {data.user.email }
                            </Text>
                            </Body>
                            <Right>
                                <Button
                                    full
                                    transparent
                                    onPress={() => this.props.navigation.navigate("ViewUser", {
                                        'id': data.id,
                                        'name': data.user.name,
                                        'email': data.user.email,
                                        'mobile': data.user.mobile,
                                        'company': data.user.company,
                                        'gender': data.user.gender
                                    })}
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <Icon active info name="information-circle" />
                                </Button>
                            </Right>
                            </ListItem>}
                        renderLeftHiddenRow={(data) =>
                            <Button
                                full
                                danger
                                onPress={() => this._onReject(data.id)}
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Icon active name="thumbs-down" />
                            </Button>}
                        renderRightHiddenRow={(data) =>
                            <Button
                                full
                                success
                                onPress={() => this._onApprove(data.id)}
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Icon active name="thumbs-up" />
                            </Button>}
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    /> }
                </Content>
                </ImageBackground>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: null,
        height: null
    },
    container: {
        backgroundColor: "#FFF"
    },
    text: {
        alignSelf: "center",
        marginBottom: 7
    },
    mb: {
        marginBottom: 15
    }
})
