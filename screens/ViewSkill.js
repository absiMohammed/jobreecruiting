import React, { Component } from 'react';
import {Image, ImageBackground, StyleSheet} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left ,Right, Title, Body } from 'native-base';
import Constants from '../config';
import {DrawerActions} from "react-navigation";

const launchscreenBg = require("../assets/launchscreen-bg.png");

export default class ViewSkill extends Component {

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
                    <Title>تفاصيل العرض</Title>
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
                                <Text>{this.props.navigation.getParam('description', 'وصف مختصر')}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Text>
                                <Text note>{this.props.navigation.getParam('category', 'نوع المهارة')}</Text>
                            </Text>
                            </Body>
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