import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from './../../redux/actions/index';
import { connect } from 'react-redux';
import Profile from './Profile';
import Feed from './Feed';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Search from './Search';
import firebase from 'firebase/compat/app';

const Tab = createMaterialBottomTabNavigator();

const preventDefaultAndNavigate = (destination, navigation, params = null) => ({
    tabPress: ev => {
        ev.preventDefault();
        navigation.navigate(destination, params);
    },
});

const addContainerListener = ({ navigation }) => preventDefaultAndNavigate('Add', navigation);
const profileListener = ({ navigation }) => preventDefaultAndNavigate('Profile', navigation, { uid: firebase.auth().currentUser.uid });

const EmptyScreen = () => null;

const tabs = [
    { name: 'Feed', component: Feed, iconName: 'home', listeners: null },
    { name: 'Search', component: Search, iconName: 'magnify', listeners: null },
    { name: 'AddContainer', component: EmptyScreen, iconName: 'plus-box', listeners: addContainerListener },
    { name: 'Profile', component: Profile, iconName: 'account-circle', listeners: profileListener },
];

export class Main extends Component
{
    componentDidMount()
    {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }

    render()
    {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={ false }>
                {tabs.map(({ name, component, iconName, listeners }) => (
                    <Tab.Screen
                        key={ name }
                        name={ name }
                        listeners={ listeners }
                        component={ component }
                        options={{
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons
                                    name={ iconName }
                                    color={ color }
                                    size={ 26 }
                                />
                            )
                        }}
                    />
                ))}
            </Tab.Navigator>
        );
    }
}

const mapStateToProps = ({ userState }) => ({ currentUser: userState.currentUser });
const mapDispatchProps = dispatch => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);
