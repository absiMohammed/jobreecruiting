import React from "react";
import {
    NavigationActions,
    StatusBar,
    Dimensions,
    ImageBackground, StyleSheet, View, TouchableOpacity, AsyncStorage, Alert
} from "react-native";
import {
    Container,
    Body,
    Content,
    Left,
    Right,
    List,
    ListItem,
    Thumbnail,
    Button,
    Text,
    Icon,
    Title,
    Form, Item, Input, Label, Picker
} from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from "../config";

const launchscreenBg = require("../assets/splash.jpg");

export default class SkillsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            user: []
        }

    }

    static navigationOptions = {
        //To hide the ActionBar/NavigationBar
        header: null,
    };
    componentDidMount = async() => {
        try {
            const value = await AsyncStorage.getItem('api/user');
            const user = await AsyncStorage.getItem('api/userInfo');
            this.setState({userToken: JSON.parse(value),user: JSON.parse(user) });

            if(value && user){
                this.timeoutHandle = setTimeout(()=>{

                    this.props.navigation.navigate("Main");
                }, 5000);

            }else{
                this.timeoutHandle = setTimeout(()=>{

                    this.props.navigation.navigate("Login");
                }, 5000);
            }
        } catch (error) {
            this.timeoutHandle = setTimeout(()=>{

                this.props.navigation.navigate("Login");
            }, 5000);
        }


    };

    render() {


        var deviceWidth = Dimensions.get("window").width;
        var deviceHeight = Dimensions.get("window").height;

        return (
            <Container>
                <StatusBar hidden />
                    <ImageBackground source={launchscreenBg} style={styles.imageContainer}>

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
    }
});
