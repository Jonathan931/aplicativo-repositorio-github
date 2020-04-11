import React, {useState, useEffect, useCallback} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';
import api from '../../services/api';

export default function Main({navigation}) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  const initFetch = useCallback(async () => {
    const data = await AsyncStorage.getItem('users');

    if (data) {
      setUsers(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  useEffect(() => {
    function setData() {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
    setData();
  }, [users]);

  async function handleAddUser() {
    setLoading(true);
    const response = await api.get(`/users/${newUser}`);

    if (response.data) {
      const {name, login, bio, avatar_url} = response.data;
      const data = {name, login, bio, avatar: avatar_url};
      setUsers([...users, data]);
      setNewUser('');
      Keyboard.dismiss();
    }
    setLoading(false);
  }

  function handleNavigate(user) {
    navigation.navigate('User', user);
  }

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={(text) => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />

        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#FFF" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={(user) => user.login}
        renderItem={({item}) => (
          <User>
            <Avatar source={{uri: item.avatar}} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Usuários',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
