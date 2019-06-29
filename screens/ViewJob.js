import React, { Component } from 'react';
import {Image, ImageBackground, StyleSheet} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left ,Right, Title, Body } from 'native-base';
import Constants from '../config';
import {DrawerActions} from "react-navigation";

const launchscreenBg = require("../assets/launchscreen-bg.png");

export default class ViewCompany extends Component {

    constructor(props) {
        super(props);
        this.state = {
            basic: true,
            spinnerVisible: true,
        };
    }
    toggleDrawer = () => {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    };


    render() {
        return (
            <Container>
                <ImageBackground source={launchscreenBg} style={styles.imageContainer}>
                <Header  transparent
                         hasTabs androidStatusBarColor="#263238">
                    <Left>
                        <Button transparent
                                onPress={this.toggleDrawer}>
                            <Icon name="menu" />
                        </Button>
                    </Left>
                    <Body style={{ flex: 3 }}>
                    <Title>تفاصيل المهمة</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-forward" />
                        </Button>
                    </Right>

                </Header>
                <Content padder style={{'backgroundColor': '#ffffff'}}>
                    <Card style={{flex: 0}}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{uri: Constants.urls.storageRoot+this.props.navigation.getParam('logo', null)}} />
                                <Body>
                                <Text>معلومات المهمة</Text>
                                <Text note>الاسم: {this.props.navigation.getParam('name', 'لا يوجد')}</Text>
                                <Text note>الوصف: {this.props.navigation.getParam('description', 'لا يوجد')}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Body>
                            <Text>معلومات صاحب المهمة</Text>
                            <Text note>الاسم: {this.props.navigation.getParam('job_poster_name', 'لا يوجد')}</Text>
                            <Text note>البريد الالكتروني: {this.props.navigation.getParam('job_poster_email', 'لا يوجد')}</Text>
                            <Text note>الشركة: {this.props.navigation.getParam('job_poster_company', 'لا يوجد')}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                    </Card>
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
});