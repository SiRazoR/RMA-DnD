import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Alert,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';
import {Facebook} from 'expo';
import {SocialIcon} from "react-native-elements";

const fbAppId = 'PUT YOUR OWN FB APP ID';

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            fontLoaded: false
        };
    }

    async componentDidMount() {
        await Expo.Font.loadAsync({
            'Toms Handwritten': require('../../../assets/fonts/TomsHandwritten.ttf')
        });
        this.setState({fontLoaded: true});
    }


    loginUser = async (title, message) => {
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
            }, (error) => {
                Alert.alert(error.message, message);
            });
    };

    loginWithFacebook = async () => {
        const {type, token} = await Facebook.logInWithReadPermissionsAsync(
            fbAppId,
            {permissions: ['public_profile']})
        if (type === 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            firebase.auth().signInWithCredential(credential).catch((error) => {
                console.log(error)
            });
        }
    };

    render() {
        if (this.state.fontLoaded) {
            return (
                <View style={{paddingTop: 20, alignItems: "center"}}>
                    <Image source={require('../../../assets/dnd-logo.png')} style={{width: 200, height: 200}}
                    />
                    <TextInput style={styles.textInput}
                               value={this.state.email}
                               onChangeText={(text) => {
                                   this.setState({email: text})
                               }}
                               placeholder="Wprowadź swój email"
                               keyboardType="email-address"
                               autoCapitalize="none"
                               autoCorrect={false}
                    />

                    <View style={{paddingTop: 10}}/>

                    <TextInput style={styles.textInput}
                               value={this.state.password}
                               onChangeText={(text) => {
                                   this.setState({password: text})
                               }}
                               placeholder="Wprowadź swoje hasło"
                               secureTextEntry={true}
                               autoCapitalize="none"
                               autoCorrect={false}
                    />
                    <View style={{paddingTop: 0}}/>
                    <TouchableOpacity onPress={this.loginUser}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Zaloguj się</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.hyperlink} onPress={() => this.props.navigation.navigate('ForgotPassword')}>Zresetuj
                        hasło</Text>
                    <View style={{paddingTop: 20}}/>
                    <Text style = {styles.text}> Nie masz konta?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Zarejestruj się</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.container}>
                        <SocialIcon
                            title='Kontynuuj z Facebook'
                            button
                            type='facebook'
                            style={styles.buttonFb}
                            onPress={this.loginWithFacebook}
                        />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    text: {color: "black",  fontFamily: 'Toms Handwritten', fontWeight: "normal", textAlign: "center", fontSize: 24},
    button: {
        marginBottom: 10,
        width: 140,
        height: 35,
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1
    },
    buttonFb: {
        marginBottom: 20,
        width: 180,
        height: 35,
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1
    },
    buttonText: {
        fontFamily: 'Toms Handwritten',
        fontSize: 24,
        padding: 5,
        color: 'black',
    },
    hyperlink: {
        fontFamily: 'Toms Handwritten',
        color: '#141fe9',
        textDecorationLine: 'underline',
        fontSize: 24
    },
    textInput: {
        fontFamily: 'Toms Handwritten',
        fontWeight: '400',
        color: 'black',
        borderBottomWidth: 2,
        borderColor: "black",
        marginVertical: 20,
        padding: 10,
        height: 40,
        width: '55%',
        fontSize: 20,
        textAlign: 'center'
    },
});