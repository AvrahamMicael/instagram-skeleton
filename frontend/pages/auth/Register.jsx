import { Component } from 'react';
import { Button, TextInput, View } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export class Register extends Component {
    constructor(props)
    {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
        };

        this.onSignUp = this.onSignUp.bind(this);
    }

    onSignUp()
    {
        const { email, password, name } = this.state;
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(result => {
                firebase.firestore()
                    .collection('users')
                    .doc(firebase.auth().currentUser.uid)
                    .set({ name, email });
                console.log(result);
            })
            .catch(error => {
                console.log(error);
            });
    }

    render()
    {
        return (
            <View>
                {Object.keys(this.state).map(key => (
                    <TextInput
                        key={ key }
                        placeholder={ key }
                        secureTextEntry={ key == 'password' }
                        onChangeText={ text => this.setState({ [key]: text }) }
                    />
                ))}
                <Button
                    onPress={ this.onSignUp }
                    title="Sign Up"
                />
            </View>
        );
    }
}

export default Register;
