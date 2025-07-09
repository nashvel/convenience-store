import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);

const OrderHistoryScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 items-center justify-center bg-gray-100">
      <StyledText className="text-2xl font-bold">Order History</StyledText>
    </StyledSafeAreaView>
  );
};

export default OrderHistoryScreen;
