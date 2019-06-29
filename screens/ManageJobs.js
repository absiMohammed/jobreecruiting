import React from "react";
import {
    StyleSheet,
    ListView,
    AsyncStorage,
    Alert,
    ImageBackground,
    TouchableHighlight,
    Linking,
    Image,
    Dimensions
} from "react-native";
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
            ads: [],
            user: [],
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

            let response = await fetch(Constants.urls.root+'api/job/view?user_id='+this.state.user.id, {
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
        try {

            let response = await fetch(Constants.urls.root+'api/ads/view?user_id='+this.state.user.id, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.state.userToken.token
                }
            });
            let responseJson = await response.json()

            this.setState({ spinnerVisible: false });
            this.setState({ads: responseJson})
            console.log("ads:", responseJson);
        } catch (e) {
            this.setState({spinnerVisible: false});
            Alert.alert(
                "Error",
                "1111An error occurred, please ensure you are connected to the internet and try again",
                [
                    {text: "Try Again", onPress: () => console.log('OK Pressed')}
                ],
                {cancelable: false}
            )
            console.log("caught", e)
        }
    }

    _onDelete = async(id) => {
        // this.setState({ spinnerVisible: true });
        try {
            let response = await fetch(Constants.urls.root+'/api/job/delete/'+id, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userToken.token
                },
            });
            let responseJson = await response.json();
            console.log("response:", responseJson);
            if(responseJson.status === "success"){
                // this.setState({ spinnerVisible: false });
                console.log("done", responseJson)
            }else{
                // this.setState({ spinnerVisible: false });
                this.props.navigation.navigate('ManageJobs');
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
            // this.setState({ spinnerVisible: false });
            this.props.navigation.navigate('ManageEmployees');
            Alert.alert(
                "Error",
                "An error occurred, please ensure you are connected to the internet and try again",
                [
                    { text: "Try Again", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
            console.log("caught", error)
        }

    }

    deleteRow(secId, rowId, rowMap, serveId) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.listViewData];
        newData.splice(rowId, 1);
        this.setState({ listViewData: newData });
        this._onDelete(serveId);
    }

    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };

    render() {

        var deviceWidth = Dimensions.get("window").width;
        var deviceHeight = Dimensions.get("window").height;

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
                    <Title>ادارة المهام</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.props.navigation.navigate("AddJob")}>
                            <Icon name="add" />
                        </Button>
                    </Right>
                </Header>
                <Spinner visible={this.state.spinnerVisible}
                         textStyle={{ color: '#8bb4c2', fontSize: 16, marginTop: -30 }}
                         color={'#8bb4c2'}/>

                <Content padder style={{'backgroundColor': '#ffffff'}}>
                    <TouchableHighlight
                        onPress={()=>  Linking.openURL(this.state.ads.url)}
                        underlayColor="transparent"
                        style={{ flex: 1, justifyContent:'center'}}>
                        <Image
                            style={styles.image}
                            source={{uri: this.state.ads.path}}
                        />
                    </TouchableHighlight>
                    { this.state.listViewData.length < 1 ?
                        <Text style={{textAlign: "center", marginTop: 50 }}>
                           لا يوجد أي مهام تم اضافاتها
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
                            <Text>{data.description}</Text>

                                <Text note numberOfLines={3}>
                                {data.category.name }
                            </Text>
                            </Body>
                            <Right>
                                <Button transparent
                                        onPress={() => this.props.navigation.navigate("EditJob", {
                                            'id': data.id,
                                            'name': data.name,
                                            'description': data.description,
                                            'category_id': data.category.id === null ? null : data.category.id
                                        })}
                                        style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                >
                                    <Icon active info name="ios-hammer" />
                                </Button>
                            </Right>
                            </ListItem>}
                        renderLeftHiddenRow={data =>
                            <Button
                                full info
                                onPress={() => this.props.navigation.navigate("ViewJobUsers", {
                                    'id': data.id,
                                    'description': data.description,
                                    'category_id': data.category.id === null ? null : data.category.id
                                })}
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Icon active name="information-circle" />
                            </Button>}
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button
                                full
                                danger
                                onPress={() => this.deleteRow(secId, rowId, rowMap, data.id)}
                                style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Icon active name="trash" />
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
        height: null,
        resizeMode: 'contain'
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        aspectRatio: 2.5,
        resizeMode: 'contain',

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
