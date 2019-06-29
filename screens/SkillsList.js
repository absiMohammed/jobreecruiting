import React from "react";
import {ListView, Alert, AsyncStorage, TouchableHighlight, Linking, Image, Dimensions} from "react-native";
import { Container, Body, Content, Left, Right, List, ListItem, Thumbnail, Button, Text, Icon, Title } from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from "../config";

const datas = [];

export default class SkillsList extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            basic: true,
            listViewData: datas,
            spinnerVisible: true,
            ads: [],
        };
    }
    deleteRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        const newData = [...this.state.listViewData];
        newData.splice(rowId, 1);
        this.setState({ listViewData: newData });
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

            let response = await fetch(Constants.urls.root+'api/user-skill/view', {
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

    render() {


        var deviceWidth = Dimensions.get("window").width;
        var deviceHeight = Dimensions.get("window").height;

        return (
            <Container>
                <Spinner visible={this.state.spinnerVisible}
                         textStyle={{ color: '#8bb4c2', fontSize: 16, marginTop: -30 }}
                         color={'#8bb4c2'}/>
                <Content padder style={{'backgroundColor': '#ffffff'}}>
                    <TouchableHighlight
                        onPress={()=>  Linking.openURL(this.state.ads.url)}
                        underlayColor="transparent"
                        style={{ flex: 1, justifyContent:'center'}}>
                        <Image
                            style={{ flex: 1,width:deviceWidth-20, height: deviceHeight/100*20}}
                            source={{uri: this.state.ads.path}}
                        />
                    </TouchableHighlight>
                    { this.state.listViewData.length < 1 ?
                        <Text style={{textAlign: "center", marginTop: 50 }}>
                            لا يوجد أي مهارات تم اضافاتها
                        </Text>
                    : <List

                            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                            renderRow={data =>
                                <ListItem thumbnail style={{ paddingLeft: 20 }}>
                                    <Left>
                                        <Thumbnail square source={require('../assets/avatar.png')} />
                                    </Left>
                                    <Body>
                                    <Text>{data.description}</Text>

                                    <Text note numberOfLines={3}>
                                        {data.category.name }
                                    </Text>

                                    </Body>
                                    {/*<Right>*/}
                                    {/*<Button transparent*/}
                                    {/*onPress={() => this.props.navigation.navigate("EditCompany")}>*/}
                                    {/*<Text>Edit</Text>*/}
                                    {/*</Button>*/}
                                    {/*</Right>*/}
                                </ListItem>}
                            renderLeftHiddenRow={data =>
                                <Button
                                    full
                                    info
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
                                    onPress={_ => this.deleteRow(secId, rowId, rowMap)}
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
                        />}

                </Content>
            </Container>
        );
    }
}
