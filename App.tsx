import React from 'react';
import { Text, View, Button, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width: 300,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

/* 
  InviteScreen:
  This is the first screen where users get invited or provided a signup link.
*/

type InviteScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Invite'>;

const InviteScreen = ({ navigation }: { navigation: InviteScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to 3 Cords Coaching</Text>
      <Text>Sign up or log in to get started!</Text>
      <Button title="Get Started" onPress={() => navigation.navigate('Welcome')} />
    </View>
  );
};

/* 
  WelcomeScreen:
  Contains horizontally swiped slides for:
  1. A welcome message,
  2. A placeholder for a video/testimonials,
  3. A message from the Founder/CEO.
*/
const WelcomeScreen = ({ navigation }: { navigation: StackNavigationProp<RootStackParamList, 'Welcome'> }) => {
  return (
    <ScrollView horizontal pagingEnabled style={styles.container}>
      <View style={styles.slide}>
        <Text style={styles.title}>Welcome Message</Text>
        <Text>Welcome to the 3 Cords Coaching platform – where growth begins!</Text>
      </View>
      <View style={styles.slide}>
        <Text style={styles.title}>Platform Video & Testimonials</Text>
        <Text>Watch our video to learn more about the platform.</Text>
        {/* Replace the Text with a Video component when ready */}
      </View>
      <View style={styles.slide}>
        <Text style={styles.title}>Founder's Message</Text>
        <Text>A short message from our Founder, including our Company Pledge.</Text>
      </View>
      {/* After scrolling, offer a button to proceed */}
      <View style={styles.slide}>
        <Button title="Proceed to Registration" onPress={() => navigation.navigate('Register')} />
      </View>
    </ScrollView>
  );
};

/*
  RegisterScreen:
  Screen for the user to input basic registration details.
*/
const RegisterScreen = ({ navigation }: { navigation: StackNavigationProp<RootStackParamList, 'Register'> }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <Text>[Registration Form Inputs Here]</Text>
      <Button title="Continue to Subscription Options" onPress={() => navigation.navigate('Subscription')} />
    </View>
  );
};

/*
  SubscriptionScreen:
  Display subscription options along with descriptions.
*/
const SubscriptionScreen = ({ navigation }: { navigation: StackNavigationProp<RootStackParamList, 'Subscription'> }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription Info</Text>
      <Text>Select a subscription plan. (Easy opt-out, no contract. Students receive $5/month discount)</Text>
      <Button title="Free" onPress={() => navigation.navigate('SubscriptionCongrats', { plan: 'Free' })} />
      <Button title="Pay per Service" onPress={() => navigation.navigate('SubscriptionCongrats', { plan: 'Pay per Service' })} />
      <Button title="Basic - $39/month" onPress={() => navigation.navigate('SubscriptionCongrats', { plan: 'Basic' })} />
      <Button title="Standard - $59/month" onPress={() => navigation.navigate('SubscriptionCongrats', { plan: 'Standard' })} />
      <Button title="Premium - $79/month" onPress={() => navigation.navigate('SubscriptionCongrats', { plan: 'Premium' })} />
    </View>
  );
};

/*
  SubscriptionCongratsScreen:
  After the user selects a subscription, display a congratulatory message (or video) to affirm their choice.
*/
// import { StackScreenProps } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type SubscriptionCongratsScreenProps = {
  route: RouteProp<RootStackParamList, 'SubscriptionCongrats'>;
  navigation: StackNavigationProp<RootStackParamList, 'SubscriptionCongrats'>;
};

const SubscriptionCongratsScreen = ({ route, navigation }: SubscriptionCongratsScreenProps) => {
  const { plan } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Congratulations!</Text>
      <Text>
        You have selected the {plan} plan. Get ready for a transformational coaching experience!
      </Text>
      {/* Insert a congratulatory video or image here if desired */}
      <Button title="Proceed to Profile Setup" onPress={() => navigation.navigate('ProfileSetup')} />
    </View>
  );
};

/*
  ProfileSetupScreen:
  The user completes their profile by taking a short personality assessment,
  selecting coaching services, and adding social media handles.
*/
const ProfileSetupScreen = ({ navigation }: { navigation: StackNavigationProp<RootStackParamList, 'ProfileSetup'> }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text>[Personality Assessment Form]</Text>
      <Text>[Coaching Services Selection]</Text>
      <Text>[Social Media Handles Input]</Text>
      <Button title="Go to Home Page" onPress={() => navigation.navigate('AppHome')} />
    </View>
  );
};

/*
  AppHomeScreen:
  The home page with a highlighted video (or layout preview) and access to app functionalities.
*/

type RootStackParamList = {
  Invite: undefined;
  Welcome: undefined;
  Register: undefined;
  Subscription: undefined;
  SubscriptionCongrats: { plan: string };
  ProfileSetup: undefined;
  AppHome: undefined;
  Profile: undefined;
};

type AppHomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AppHome'>;

const AppHomeScreen = ({ navigation }: { navigation: AppHomeScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>3 Cords Coaching Home</Text>
      <Text>Highlighted video demonstrating the app layout and functionalities.</Text>
      {/* Consider this area a dashboard with buttons or a navigation drawer */}
      <Button title="View Your Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
};

/*
  ProfileScreen:
  Displays the user's profile including personal details and coaching program info.
*/
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: { navigation: ProfileScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text>[Profile Picture & Connect with me]</Text>
      <Text>Position / Occupation</Text>
      <Text>Personality Type (optional)</Text>
      <Text>Current Coaching Program</Text>
      <Text>Goals / Desires</Text>
      <Text>Looking to partner / network?</Text>
      <Text>Social Media Handles</Text>
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Invite">
        <Stack.Screen name="Invite" component={InviteScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        {/* <Stack.Screen name="SubscriptionCongrats" component={SubscriptionCongratsScreen} /> */}
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="AppHome" component={AppHomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
