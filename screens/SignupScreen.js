// SignupScreen.js

import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Implement your signup logic here
    // For simplicity, just navigate to the login screen after signup
    navigation.navigate("Login");
  };

  return (
    <View>
      <Text>Signup</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Sign up" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate("Login")}>
        Already have an account? Login here
      </Text>
    </View>
  );
};

export default SignupScreen;
