import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Basic validation
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-100 justify-center items-center p-8">
      <StyledImage 
        source={{ uri: 'https://img.freepik.com/free-vector/delivery-service-illustrated_23-2148505081.jpg?t=st=1720175895~exp=1720179495~hmac=6da3395781a7042a549c5950a7c40a510959614f8493c12a44364233eb431a0e&w=740' }} 
        className="w-64 h-64 mb-8"
      />
      <StyledText className="text-3xl font-bold text-gray-800 mb-2">Rider Login</StyledText>
      <StyledText className="text-gray-500 mb-8">Welcome back, please login to continue</StyledText>

      <StyledTextInput
        className="w-full bg-white p-4 rounded-lg border border-gray-200 mb-4 text-base"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <StyledTextInput
        className="w-full bg-white p-4 rounded-lg border border-gray-200 mb-6 text-base"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <StyledTouchableOpacity
        className="w-full bg-blue-500 p-4 rounded-lg items-center shadow-md"
        onPress={handleLogin}
      >
        <StyledText className="text-white text-base font-bold">Login</StyledText>
      </StyledTouchableOpacity>
    </StyledSafeAreaView>
  );
};

export default LoginScreen;
