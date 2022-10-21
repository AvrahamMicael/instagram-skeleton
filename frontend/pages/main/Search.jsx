import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const Search = ({ navigation }) => {
    const [ users, setUsers ] = useState([]);
    const fetchUsers = search => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then(({ docs }) => {
                const users = docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(users);
                console.log(users)
            })
            .catch(error => console.log(error));
    };
    const onPress = ({ id }) => navigation.navigate('Profile', { uid: id });
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={ () => onPress(item) }>
            <Text>{ item.name }</Text>
        </TouchableOpacity>
    );
    return (
        <View style={{ flex: 1, marginTop: 40 }}>
            <TextInput
                placeholder="Type Here"
                onChangeText={ searchTerm => fetchUsers(searchTerm) }
            />
            <FlatList
                numColumns={ 1 }
                horizontal={ false }
                data={ users }
                renderItem={ renderItem }
            />
        </View>
    );
};

export default Search;
