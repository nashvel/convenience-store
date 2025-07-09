import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import ActiveOrdersScreen from '../screens/ActiveOrdersScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const RiderTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'tachometer-alt';
          } else if (route.name === 'Active') {
            iconName = 'box-open';
          } else if (route.name === 'History') {
            iconName = 'history';
          } else if (route.name === 'Profile') {
            iconName = 'user-alt';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Active" component={ActiveOrdersScreen} options={{ title: 'Active Orders' }}/>
      <Tab.Screen name="History" component={OrderHistoryScreen} options={{ title: 'Order History' }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default RiderTabNavigator;
