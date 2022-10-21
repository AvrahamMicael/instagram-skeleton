import { Button, View } from "react-native";

const LandingPage = ({ navigation }) => (
    <View style={{ flex: 1, justifyContent: 'center' }}>
        {['Register', 'Login'].map(nav => (
            <Button
                key={ nav }
                title={ nav }
                onPress={ () => navigation.navigate(nav) }
            />
        ))}
    </View>
);

export default LandingPage;
