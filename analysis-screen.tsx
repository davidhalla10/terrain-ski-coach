import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';


const AnalysisScreen: React.FC = () => {




    return(
        <ImageBackground
        source={require('./KL-background.png')}
        style={styles.background}>
            <ScrollView>
                <Text style={styles.logo}>KL Financial</Text>
                <TouchableOpacity style={styles.login}>
                    <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUp}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wallet}>
                    <Text style={styles.walletText}>$100.00</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menu}>
                    <Text style={styles.menuText}>Toggle Stocks</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    )
}

export default AnalysisScreen;


const styles = StyleSheet.create({
    background: {
        width: "100%",
        height: "100%"
    },
    login: {
        backgroundColor: '#ffffffff',
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 30,
        padding: 20
    },
    signUp: {
        backgroundColor: '#ffffffff',
        marginTop: 10,
        borderRadius: 30,
        marginRight: -900,
        alignSelf: 'center',
        padding: 20
    },
    signUpText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 27,
        color: '#000000ff'
    },
    logo: {
        color: '#ffffffff',
        fontSize: 60,
        fontWeight: 'bold',
        marginLeft: 20,
        marginTop: 80,

  },
    loginText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 27,
        color: '#000000ff'
    },
    wallet: {
        backgroundColor: '#ffffffff',
        borderRadius: 30,
        marginRight: -1280,
        marginTop: -250,
        alignSelf: "center",
        padding: 20
    },
    walletText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 27,
        color: '#000000ff'
    },
    menu: {
        backgroundColor: '#ffffffff',
        alignSelf: 'center',
        padding: 20,
        marginTop: 100,
        borderRadius: 30,
    },
    menuText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 27,
        color: '#000000ff'
    }
})
















/*import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const AnalysisScreen: React.FC = () => {

    return(
        <ImageBackground 
        source={require('./blue-background.png')}
        style={styles.background}>
        </ImageBackground>
    )

    
}


const styles = StyleSheet.create ({
    background: {
        width: "100%",
        height: "100%"
    }
})

export default AnalysisScreen;*/