import React, { Component } from "react";
import { ImageBackground,TextInput, View, StatusBar, StyleSheet, Dimensions, Platform, TouchableOpacity, Alert, AsyncStorage } from "react-native";
import {
    Container,
    Content,
    Button,
    Item,
    Input,
    Picker,
    Icon,
    Form,
    Text,
    Label
} from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from '../config';

const launchscreenBg = require("../assets/launchscreen-bg.png");
const launchscreenLogo = require("../assets/logo-kitchen-sink.png");


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authType: 1,
            spinnerVisible: false,
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            birth_month: '',
            birth_day: '',
            birth_year: '',
            gender: '',
            role_id:2,
            mobile:'',
            company:'',
            user: []
        }

        this.setDate = this.setDate.bind(this);
        this.setRole = this.setRole.bind(this);
        this.setGender = this.setGender.bind(this);
    }
    setDate(newDate) {
        this.setState({ birth_date: newDate });
    }
    setRole(roleId: string) {
        this.setState({ role_id: roleId });
    }
    setGender(genderId: string) {
        this.setState({ gender: genderId });
    }

    componentDidMount = async() => {

        try {
            const value = await AsyncStorage.getItem('api/user');
            const user = await AsyncStorage.getItem('api/userInfo');
            this.setState({userToken: JSON.parse(value),user: JSON.parse(user) });
        debugger
            if(value && user){
                this.props.navigation.navigate("Main");

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

    };

    _onLogin = async() => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(this.state.email < 2) {
            Alert.alert(
                "Alert",
                "Please provide a valid email address",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else if(!reg.test(this.state.email)) {
            Alert.alert(
                "Alert",
                "Please provide a valid email address",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else if(this.state.password < 2){
            Alert.alert(
                "Alert",
                "Please provide a valid password",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else{

            this.setState({ spinnerVisible: true });
            try {
                let response = await fetch(Constants.urls.root+'api/login', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                    }),
                });
                let responseJson = await response.json();
                if(responseJson.status === "success"){
                    await AsyncStorage.setItem('api/user', JSON.stringify({token: responseJson.data.token}));
                    await AsyncStorage.setItem('api/userInfo', JSON.stringify(responseJson.data.user));
                    this.setState({ spinnerVisible: false });
                    this.props.navigation.navigate("app");
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


    _onRegister = async() => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(this.state.name < 2) {
            Alert.alert(
                "Alert",
                "Please provide a valid name",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else if(this.state.email < 2) {
            Alert.alert(
                "Alert",
                "Please provide a valid email address",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else if(!reg.test(this.state.email)) {
            Alert.alert(
                "Alert",
                "Please enter a valid email address",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else if(this.state.password < 2){
            Alert.alert(
                "Alert",
                "Please enter a valid password",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else if(this.state.password != this.state.password_confirmation){
            Alert.alert(
                "Alert",
                "كلمة السر غير متطابقة",
                [
                    { text: "Ok", onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
            )
        }else{

            this.setState({ spinnerVisible: true });
            try {
                let response = await fetch(Constants.urls.root+'api/register', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        name: this.state.name,
                        password_confirmation: this.state.password_confirmation,
                        birth_date: this.state.birth_year + "-" + this.state.birth_month + "-"+ this.state.birth_day,
                        password: this.state.password,
                        gender: this.state.gender,
                        role_id: this.state.role_id,
                        mobile: this.state.mobile,
                        company: this.state.company,
                    }),
                });
                let responseJson = await response.json();
                console.log("response:", responseJson);
                if(responseJson.status === "success"){
                        await AsyncStorage.clear()
                    AsyncStorage.removeItem('token')

                    await AsyncStorage.removeItem('api/user')
                    await AsyncStorage.removeItem('api/role')
                    await AsyncStorage.setItem('api/user', JSON.stringify({token: responseJson.data.token}));
                    await AsyncStorage.setItem('api/userInfo', JSON.stringify(responseJson.data.user));

                    this.setState({ spinnerVisible: false });
                    this.props.navigation.navigate("Main");
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
                    "An error occurred, please try later",
                    [
                        { text: "Try Again", onPress: () => console.log('OK Pressed') }
                    ],
                    { cancelable: false }
                )
                console.log("caught", error)
            }

        }

    }


    changeForm = (data) => {
        this.setState({ authType: data });
    }




    render() {
        return (
            <Container style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={"#37474F"} />
                <Spinner visible={this.state.spinnerVisible}
                         textStyle={{ color: '#8bb4c2', fontSize: 16, marginTop: -30 }}
                         color={'#8bb4c2'}
                         textContent={'Logging In'} />
                <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
                    {this.state.authType == 1 ?
                        <View style={styles.logoContainer}>
                            <ImageBackground source={launchscreenLogo} style={styles.logo}/>
                        </View> :
                        <View>

                        </View>
                    }
                    <Content style= {styles.contentContainer}>
                        {this.state.authType == 1 ? <Form>

                            <Item  style={{color: "#000000",
                                fontFamily: "GE SS Two Light",
                                backgroundColor: '#ffffff',
                                marginLeft:30, marginRight:30, marginTop:deviceHeight / 6}}>
                                <Icon style={styles.searchIcon} name="ios-person"/>
                                <Input
                                    style={{
                                    fontFamily: "GE SS Two Light",
                                       backgroundColor: '#ffffff' }}
                                       placeholderTextColor="#000000"
                                       keyboard-type={'email-address'}
                                       autoCapitalize='none'
                                       onChangeText={(text) => this.setState({ email: String.prototype.trim.call(text) })}
                                       onSubmitEditing={(event) => {
                                           this.refs.password._root.focus();
                                       }}/>
                                <Label style={{ fontFamily: "GE SS Two Light" }}>البريد الالكتروني: </Label>
                            </Item>
                            <Item  style={{color: "#000000",
                                fontFamily: "GE SS Two Light",
                                marginTop:10,
                                backgroundColor: '#ffffff',
                                marginLeft:30, marginRight:30}}>
                                <Icon style={styles.searchIcon} name="ios-lock"/>
                                <Input ref={'password'}
                                       style={{
                                           fontFamily: "GE SS Two Light",
                                           backgroundColor: '#ffffff' }}
                                       placeholderTextColor="#000000"
                                       autoCapitalize='none'
                                       secureTextEntry={true}
                                       onChangeText={(text) => this.setState({ password: text })}
                                       onSubmitEditing={(event) => {
                                           this._onLogin();
                                       }}/>
                                <Label style={{ fontFamily: "GE SS Two Light" }}>الكلمة السرية: </Label>
                            </Item>
                        </Form> : <Form>

                            <Item style={{color: "#000000",
                                fontFamily: "GE SS Two Light",
                                backgroundColor: '#ffffff',
                                marginLeft:30, marginRight:30, marginTop:deviceHeight / 30}}>
                                <Input
                                    style={{color: "#000000",
                                        fontFamily: "GE SS Two Light",
                                        backgroundColor: '#ffffff' }}
                                    onChangeText={(text) => this.setState({ name: text })}
                                    autoCapitalize='none'
                                    onSubmitEditing={(event) => {
                                        this.refs.email._root.focus();
                                    }}
                                    />
                                <Label style={{ fontFamily: "GE SS Two Light" }}>الاسم الثلاثي: </Label>
                            </Item>

                            <Item style={{marginLeft:30, marginRight:30,marginTop:10,
                                backgroundColor: '#ffffff',}}>
                                <Input ref="email"
                                       style={{color: "#000000",
                                           backgroundColor: '#ffffff'}}
                                       placeholderTextColor="#000000"
                                       keyboard-type={'email-address'}
                                       autoCapitalize='none'
                                       onChangeText={(text) => this.setState({ email: String.prototype.trim.call(text) })}
                                       onSubmitEditing={(event) => {
                                       }} />

                                <Label style={{ fontFamily: "GE SS Two Light" }}>البريد الالكتروني: </Label>
                            </Item>
                            <Item style={{color: "#000000",
                                fontFamily: "GE SS Two Light",
                                backgroundColor: '#ffffff',
                                marginLeft:30, marginRight:30, marginTop:10}}>
                                <Input
                                    style={{color: "#000000",
                                        backgroundColor: '#ffffff' }}
                                    onChangeText={(text) => this.setState({ birth_year: text })}
                                    autoCapitalize='none'
                                    keyboardType="numeric"
                                    onSubmitEditing={(event) => {
                                        this.refs.email._root.focus();
                                    }}
                                />
                                <Label style={{ fontFamily: "GE SS Two Light" }}>سنة الميلاد: </Label>
                            </Item>
                            <Item style={{color: "#000000",
                                fontFamily: "GE SS Two Light",
                                backgroundColor: '#ffffff',
                                marginLeft:30, marginRight:30,marginTop:10}}>
                                <Input
                                    style={{color: "#000000",
                                        backgroundColor: '#ffffff' }}
                                    autoCapitalize='none'
                                    keyboardType="numeric"
                                    onChangeText={(text) => this.setState({ birth_month: text })}
                                    onSubmitEditing={(event) => {
                                        this.refs.email._root.focus();
                                    }}
                                />
                                <Label style={{ fontFamily: "GE SS Two Light" }}>شهر الميلاد: </Label>
                            </Item>
                            <Item style={{color: "#000000",
                                fontFamily: "GE SS Two Light",
                                backgroundColor: '#ffffff',
                                marginLeft:30, marginRight:30, marginTop:10}}>
                                <Input

                                    style={{color: "#000000",
                                        backgroundColor: '#ffffff' }}
                                    onChangeText={(text) => this.setState({ birth_day: text })}
                                    autoCapitalize='none'
                                    keyboardType="numeric"
                                    onSubmitEditing={(event) => {
                                        this.refs.email._root.focus();
                                    }}
                                />
                                <Label style={{ fontFamily: "GE SS Two Light" }}>يوم الميلاد: </Label>
                            </Item>
                            <Item style={{ marginLeft:30, marginRight:30,color: "#000000",marginTop:10,
                                backgroundColor: '#ffffff'}}>
                                <Input
                                    ref="company"
                                    style={{color: "#000000",
                                        fontFamily: "GE SS Two Light",
                                        backgroundColor: '#ffffff' }}
                                    placeholderTextColor="#000000"
                                    autoCapitalize='none'
                                    onChangeText={(text) => this.setState({ company: text })}

                                />

                                <Label style={{ fontFamily: "GE SS Two Light" }}>اسم الشركة: </Label>
                            </Item>
                            <Item style={{ marginLeft:30, marginRight:30,color: "#000000",marginTop:10,
                                backgroundColor: '#ffffff'}}>
                                <Input
                                    ref="mobile"
                                    style={{color: "#000000",
                                        backgroundColor: '#ffffff' }}
                                    autoCapitalize='none'
                                    placeholderTextColor="#000000"
                                    keyboardType="numeric"
                                    onChangeText={(text) => this.setState({ mobile: text })}

                                />

                                <Label style={{ fontFamily: "GE SS Two Light" }}>رقم الجوال: </Label>
                            </Item>
                            <Item style={{color: "#000000",
                                paddingRight:5,marginLeft:30, marginRight:30,padding:-5,
                                backgroundColor: '#ffffff',marginTop:10,}}>
                                <Picker
                                    ref="gender"
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    placeholder="اختر الجنس"
                                    placeholderTextColor="#000000"
                                    selectedValue={this.state.gender}
                                    onValueChange={this.setGender.bind(this)}
                                >
                                    <Picker.Item label="اختر الجنس" value={undefined} />
                                    <Picker.Item label="ذكر" value="0" />
                                    <Picker.Item label="أنثى" value="1" />
                                </Picker>
                            </Item>
                            <Item style={{ marginLeft:30, marginRight:30,color: "#000000",marginTop:10,
                                backgroundColor: '#ffffff'}}>
                                <Input ref="passwordReg"
                                       style={{color: "#000000",
                                           fontFamily: "GE SS Two Light",
                                           backgroundColor: '#ffffff' }}
                                       placeholderTextColor="#000000"
                                       autoCapitalize='none'
                                       secureTextEntry
                                       onChangeText={(text) => this.setState({ password: text })}
                                     />

                                <Label style={{ fontFamily: "GE SS Two Light" }}>الكلمة السرية: </Label>
                            </Item>


                            <Item style={{ marginLeft:30, marginRight:30,color: "#000000",marginTop:10,
                                backgroundColor: '#ffffff'}}>
                                <Input ref="passwordRegConfo"
                                       style={{color: "#000000",
                                           fontFamily: "GE SS Two Light",
                                           backgroundColor: '#ffffff' }}
                                       placeholderTextColor="#000000"
                                       autoCapitalize='none'
                                       secureTextEntry
                                       onChangeText={(text) => this.setState({ password_confirmation: text })}
                                      />

                                <Label style={{ fontFamily: "GE SS Two Light" }}>تأكيد الكلمة السرية: </Label>
                            </Item>

                        </Form> }
                        {this.state.authType == 1 ?
                        <Button block style={{ marginLeft: 120, marginRight: 120,height: 50, marginBottom: 10, marginTop: 20, backgroundColor: "#6688aa" }}
                                onPress={() => this._onLogin()}
                        >
                            <Text style={{color: "#ffffff",
                                fontFamily: "GE SS Two Light"}} >تسجيل الدخول</Text>
                        </Button> :
                            <Button block style={{ marginLeft: 120, marginRight: 120, height: 50, marginBottom: 10, marginTop: 20, backgroundColor: "#6688aa" }}
                                    onPress={() => this._onRegister()}
                            >
                                <Text style={{color: "#ffffff",
                                    fontFamily: "GE SS Two Light"}} >أنشئ حساب</Text>
                            </Button>

                        }
                        <View style={{paddingRight: 20, paddingLeft: 20, flexDirection: 'row', justifyContent: 'center', marginTop:10}}>
                            <TouchableOpacity onPress={this.state.authType == 1 ? () =>this.changeForm('2') : () =>this.changeForm('1')}>
                                <Text style={{color: "#ffffff",
                                    fontFamily: "GE SS Two Light",textAlign:"center"}} >{this.state.authType == 1 ? 'تسجيل مستخدم جديد' : 'تسجيل الدخول'} </Text>
                            </TouchableOpacity>
                        </View>

                        <Text>
                            {"\n"}
                        </Text>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    searchIcon: {
        color:'white',
        height:50,
        width:40,
        backgroundColor: '#274f71',
        padding:10
    },
    imageContainer: {
        flex: 1,
        width: null,
        height: null
    },
    logoContainer: {
        width: deviceWidth,
        height: deviceHeight / 3,
    },
    contentContainer: {
        width: deviceWidth,
        height: deviceHeight / 3,
    },
    logo: {
        width: deviceWidth,
        height: deviceHeight / 3,
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
    }
})