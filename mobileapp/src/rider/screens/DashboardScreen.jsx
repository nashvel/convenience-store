import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const DashboardScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-gray-100">
      <StyledScrollView className="p-4">
        <StyledText className="text-3xl font-bold text-gray-800 mb-6">Dashboard</StyledText>
        
        {/* Stat Cards */}
        <StyledView className="flex-row justify-between mb-6">
          <StyledView className="bg-white p-4 rounded-lg shadow-md flex-1 mx-1 items-center">
            <StyledText className="text-gray-500">Today's Earnings</StyledText>
            <StyledText className="text-2xl font-bold text-gray-800">₱1,250.00</StyledText>
          </StyledView>
          <StyledView className="bg-white p-4 rounded-lg shadow-md flex-1 mx-1 items-center">
            <StyledText className="text-gray-500">Completed Trips</StyledText>
            <StyledText className="text-2xl font-bold text-gray-800">15</StyledText>
          </StyledView>
        </StyledView>

        <StyledText className="text-xl font-bold text-gray-800 mb-4">Weekly Performance</StyledText>
        {/* Chart will go here */}
        <StyledView className="bg-white p-4 rounded-lg shadow-md h-64 mb-6">
          <StyledText className="text-center text-gray-500">Chart Placeholder</StyledText>
        </StyledView>

        <StyledText className="text-xl font-bold text-gray-800 mb-4">Available for Pickup</StyledText>
        {/* Order list will go here */}
        <StyledView className="bg-white p-4 rounded-lg shadow-md">
          <StyledText className="text-center text-gray-500">Order List Placeholder</StyledText>
        </StyledView>

      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default DashboardScreen;
