import React from "react";
import {
    ListView,
    AsyncStorage,
    Alert,
    ImageBackground,
    StyleSheet,
    TouchableHighlight,
    Linking,
    Image, Dimensions
} from "react-native";
import { Container, Body, Content, Header, Left, Right, List, ListItem, Thumbnail, Button, Text, Icon, Title } from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from "../config";
import {DrawerActions} from "react-navigation";


const launchscreenBg = require("../assets/launchscreen-bg.png");

const datas = [
];

export default class MyJobList extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            basic: true,
            listViewData: datas,
            spinnerVisible: true,
            user: [],
            ads: [],
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
            let response = await fetch(Constants.urls.root+'api/job-user/view/jobs', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+this.state.userToken.token
                },
                body: JSON.stringify({
                    user_id: this.state.user.id
                }),
            });
            let responseJson = await response.json()

            this.setState({ spinnerVisible: false });
            this.setState({listViewData: responseJson})
            console.log("response:", responseJson);

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


    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };

    render() {

        var deviceWidth = Dimensions.get("window").width;
        var deviceHeight = Dimensions.get("window").height;

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
                        <Body style={{textAlign: 'center', // <-- the magic
                            fontWeight: 'bold',
                            fontSize: 18}}>
                        <Title >مهماتي</Title>
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
                                        <Body>
                                        <Text>{data.job.name}</Text>
                                        <Text note numberOfLines={3}>{data.job.description}</Text>
                                        <Text note numberOfLines={3}>{data.status === "approved" ?
                                            "تمت الموافقة على تعيينك" : (data.status === "rejected" ?
                                                "الطلب مرفوض" :  "قيد الانتظار")
                                        }</Text>
                                        </Body>
                                        <Right>
                                            <Thumbnail square source={require('../assets/avatar_company.png')} />
                                        </Right>
                                    </ListItem>}
                                renderLeftHiddenRow={data =>
                                    <Button
                                        full
                                        info
                                        onPress={() => this.props.navigation.navigate('ViewJob', {
                                            'id': data.id,
                                            'name': data.name,
                                            'description': data.description,
                                            'job_poster_name': data.user.name,
                                            'job_poster_company': data.user.company,
                                            'job_poster_email': data.user.email,
                                        })}
                                        style={{
                                            flex: 1,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >

                                        <Icon active name="information-circle" />
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
});
