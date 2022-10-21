import { Component } from 'react';
import { Button, TextInput, View } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export class Login extends Component {
    constructor(props)
    {
        super(props);

        this.state = {
            email: '',
            password: '',
        };

        this.onSignIn = this.onSignIn.bind(this);
    }

    onSignIn()
    {
        const { email, password } = this.state;
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .then(result => {
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
                    onPress={ this.onSignIn }
                    title="Sign In"
                />
            </View>
        );
    }
}

export default Login;
