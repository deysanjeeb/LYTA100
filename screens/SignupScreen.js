// screens/SignupScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Add signup logic here
    console.log("Signup:", email, password);
  };

  return (
    <View>
      <Text>Signup Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Signup" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate("Login")}>
        Already have an account? Log in!
      </Text>
    </View>
  );
};

export default SignupScreen;
