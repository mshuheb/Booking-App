import { Text, View, SafeAreaView, KeyboardAvoidingView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigation = useNavigation();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; 
  const phoneRegex = /^[0-9]{10}$/; 

  const register = async () => {
    if (email === '' || password === '' || phone === '') {
      Alert.alert(
        'Invalid Details',
        'Please enter all the credentials',
        [{ text: 'OK' }],
        { cancelable: false }
      );
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.', [
        { text: 'OK' },
      ]);
      return;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.', [
        { text: 'OK' },
      ]);
      return;
    }

    setIsLoading(true); 

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user.email;
      const uid = auth.currentUser.uid;

      
      await setDoc(doc(db, 'users', uid), {
        email: user,
        phone: phone,
      });

      
      await AsyncStorage.setItem('userEmail', user);
      await AsyncStorage.setItem('userPhoneNumber', phone);

      
      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',

          onPress: () => {
            setEmail('');
            setPassword('');
            setPhone('');
            navigation.navigate('Login');
          },
        },
      ]);
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', 'Something went wrong. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 10, alignItems: 'center' }}>
      <KeyboardAvoidingView>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
          <Text style={{ color: '#003580', fontSize: 17, fontWeight: '700' }}>Register</Text>
          <Text style={{ marginTop: 15, fontSize: 18, fontWeight: '500' }}>Create an Account</Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email id"
              placeholderTextColor={'black'}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor={'black'}
              style={{
                fontSize: password ? 18 : 18,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: 'gray' }}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={(text) => setPhone(text)}
              placeholder="Enter your Phone No"
              placeholderTextColor={'black'}
              style={{
                fontSize: phone ? 18 : 18,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
            />
          </View>
        </View>

        {isLoading ? ( 
          <ActivityIndicator size="large" color="#003580" style={{ marginTop: 50 }} />
        ) : (
          <Pressable
            onPress={register}
            style={{
              width: 200,
              backgroundColor: '#003580',
              padding: 15,
              borderRadius: 7,
              marginTop: 50,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            testID="registerButton"
          >
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 17, fontWeight: 'bold' }}>Register</Text>
          </Pressable>
        )}

        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', color: 'gray', fontSize: 17 }}>
            Already have an account? Sign In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
