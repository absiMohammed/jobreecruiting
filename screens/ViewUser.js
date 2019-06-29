import React, { Component } from 'react';
import {Image, ImageBackground, StyleSheet} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Right, Title, Body } from 'native-base';
import Constants from '../config';


const launchscreenBg = require("../assets/launchscreen-bg.png");

export default class ViewUser extends Component {
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
                        <Body style={{ flex: 3 }}>
                        <Title>تفاصيل المتقدم للمهمة</Title>
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
                                <Thumbnail source={require('../assets/avatar.png')} />
                                <Body>
                                <Text note>{this.props.navigation.getParam('name', 'لا يوجد')}</Text>
                                <Text note>{this.props.navigation.getParam('email', 'لا يوجد')}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Body>
                                <Text>معلومات اضافية</Text>
                                <Text note>رقم الجوال: {this.props.navigation.getParam('mobile', 'لا يوجد')}</Text>
                                <Text note>الشركة: {this.props.navigation.getParam('company', 'لا يوجد')}</Text>
                                <Text note>الجنس: {this.props.navigation.getParam('gender', 'لا يوجد') ? "انثى" : "ذكر"}</Text>
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