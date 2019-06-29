import React, { Component } from 'react';
import {
    Container,
    Header,
    Content,
    Text,
    Form,
    Item,
    Input,
    Label,
    Button,
    Right,
    Left,
    Icon,
    Body,
    Title,
    Picker
} from 'native-base';
import {Alert, AsyncStorage, ImageBackground, ListView, StyleSheet} from "react-native";
import Constants from "../config";
import Spinner from "react-native-loading-spinner-overlay";
import {DrawerActions} from "react-navigation";


const launchscreenBg = require("../assets/launchscreen-bg.png");

export default class EditSkill extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            spinnerVisible: false,
            name: props.navigation.getParam('name'),
            description: props.navigation.getParam('description'),
            skill: props.navigation.getParam('category_id'),
            skills: [],
            user: []
        };
        this.setRole = this.setSkill.bind(this);
    }

setSkill(skillID: string) {
    this.setState({ skill: skillID });
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
            let response = await fetch(Constants.urls.root + 'api/skill/view', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userToken.token
                }
            });
            let responseJson = await response.json();
            this.setState({skills: responseJson});
            console.log("response:", responseJson);
        }catch(e){
            console.log("opt", e);
            Alert.alert(
                "Error",
                "حدث خطأ",
                [
                    { text: "Try Again", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }
    }

    _focusInput(inputField) {
        this[inputField]._root.focus();
    }

    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }

    _onSave = async() => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(this.state.description < 2) {
            Alert.alert(
                "Alert",
                "الرجاء اضافة وصف",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else if(this.state.skill === '') {
            Alert.alert(
                "Alert",
                "الرجاء اضافة مهارة",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else{
            this.setState({ spinnerVisible: true });
            try {
                let response = await fetch(Constants.urls.root+'api/user-skill/edit/'+this.props.navigation.getParam('id'), {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+this.state.userToken.token
                    },
                    body: JSON.stringify({
                        description: this.state.description,
                        user_id: this.state.user.id,
                        category_id: this.state.skill,
                    }),
                });
                let responseJson = await response.json();
                console.log("response:", responseJson);
                if(responseJson.status === "success"){
                    this.setState({ spinnerVisible: false });
                    this.props.navigation.navigate('ManageSkills', {
                        onGoBack: () => this.refresh(),
                    });
                    this.props.navigation.navigate('ManageSkills');
                    Alert.alert(
                        "Success",
                        responseJson.message,
                        [
                            { text: "Ok", onPress: () => console.log('OK Pressed') }
                        ],
                        { cancelable: false }
                    )
                }else{
                    this.setState({ spinnerVisible: false });
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

    }

    _onDelete = async() => {
            this.setState({ spinnerVisible: true });
            try {
                let response = await fetch(Constants.urls.root+'/api/user-skill/delete/'+this.props.navigation.getParam('id'), {
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
                    this.setState({ spinnerVisible: false });
                    this.props.navigation.navigate('ManageSkills');
                    Alert.alert(
                        "Success",
                        responseJson.message,
                        [
                            { text: "Ok", onPress: () => console.log('OK Pressed') }
                        ],
                        { cancelable: false }
                    )
                }else{
                    this.setState({ spinnerVisible: false });
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

    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };

    render() {

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
                        <Title >تعديل عرض</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-forward" />
                            </Button>
                        </Right>
                    </Header>
                <Spinner visible={this.state.spinnerVisible}
                         textStyle={{ color: '#8bb4c2', fontSize: 16, marginTop: -30 }}
                         color={'#8bb4c2'}
                         textContent={'Please wait...'} />
                <Content padder style={{'backgroundColor': '#ffffff'}}>
                    <Form>
                        <Item floatingLabel style={{ margin: 15 }} >
                            <Label>وصف مختصر</Label>
                            <Input
                                getRef={(input) => this.description = input}
                                value={this.state.description}
                                autoCapitalize='none'
                                onChangeText={(text) => this.setState({ description: text })}
                                onSubmitEditing={(event) => {
                                    this._focusInput('description')
                                }} />
                        </Item>
                        <Item>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeholder="Select Company"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                style={{ width: undefined, margin: 15}}
                                selectedValue={this.state.skill}
                                onValueChange={this.setSkill.bind(this)}
                            >

                                <Picker.Item label="اختر مهارة" value='' />
                                {this.state.skills.map((item, i) => (
                                    <Picker.Item key={i} label={item.name} value={item.id} />
                                ))}
                            </Picker>
                        </Item>
                        <Button
                            onPress={() => this._onSave()}
                            block style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }}>
                            <Text>حفظ</Text>
                        </Button>
                    </Form>
                </Content>
                </ImageBackground>
            </Container>
        );
    }


    // uploadLogo() {
    //     FilePickerManager.showFilePicker(null, (response) => {
    //         console.log('Response = ', response);
    //
    //         if (response.didCancel) {
    //             console.log('User cancelled file picker');
    //         }
    //         else if (response.error) {
    //             console.log('FilePickerManager Error: ', response.error);
    //         }
    //         else {
    //             this.setState({
    //                 file: response
    //             });
    //         }
    //     });
    // }
}
const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: null,
        height: null
    },
});