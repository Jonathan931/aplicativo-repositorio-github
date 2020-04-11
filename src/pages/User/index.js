import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default function User({navigation}) {
  const [stars, setStars] = useState([]);
  const {avatar, name, bio} = navigation.state.params;
  const initFetch = useCallback(async () => {
    const {login} = navigation.state.params;
    const response = await api.get(`/users/${login}/starred`);
    setStars(response.data);
  }, []);

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  return (
    <Container>
      <Header>
        <Avatar source={{uri: avatar}} />
        <Name>{name}</Name>
        <Bio>{bio}</Bio>
      </Header>

      <Stars
        data={stars}
        keyExtractor={(star) => String(star.id)}
        renderItem={({item}) => (
          <Starred>
            <OwnerAvatar source={{uri: item.owner.avatar_url}} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        )}
      />
    </Container>
  );
}

User.navigationOptions = ({navigation}) => ({
  title: navigation.state.params.name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string,
        login: PropTypes.string,
        avatar: PropTypes.string,
        bio: PropTypes.string,
      }),
    }),
  }).isRequired,
};
