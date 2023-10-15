// screens/LoginScreen.js
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
const image = {
  uri: "https://st2.depositphotos.com/26272052/44757/v/450/depositphotos_447576972-stock-illustration-glowing-neon-life-insurance-icon.jpg",
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add authentication logic here
    console.log("Login:", email, password);

    // Assuming successful login, navigate to the landing page
    navigation.navigate("Landing");
  };

  return (
    <ImageBackground source={image} style={styles.image}>
      <View style={styles.container}>
        <Text style={styles.title}>LEADING U TO A 100</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>Don't have an account? Sign up!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loginButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    color: "white", // or any other color that contrasts well with skyblue
    fontSize: 28,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "white",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  signupText: {
    marginTop: 16,
    color: "white",
  },
});

export default LoginScreen;
