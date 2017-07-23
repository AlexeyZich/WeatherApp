import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  AppRegistry,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import Config from 'react-native-config'


export default class WeaterApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: null,
      lng: null,
      refresh: false,
      isLoading: true,
      enterString: '',
      country: '',
      city: '',
      gradeC: null,
    }
  }

  newGeolocation(a , b) {
    console.log(`newGeolocation`)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => alert(JSON.stringify(error)), {
        enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
      }
    );
  }

  componentDidMount() {
    console.log(`componentDidMount ${this.state.city}, ${this.state.country}, ${this.state.temp}`)
    this.newGeolocation();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate: ', prevProps, prevState)
    console.log(this.props, this.state)
    if ((prevState.lat !== this.state.lat) || (prevState.lng !== this.state.lng)) {
      this.parseWeather()
    }
  }


  parseWeather() {
    console.log('parseWeather')
    const key = Config.OPENWEATHERMAP_API_KEY
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&APPID=${key}`    
    console.log(url);
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);

        this.setState({
          isLoading: false,
          city: responseJson.name,
          country: responseJson.sys.country,
          gradeC: Math.round(responseJson.main.temp - 273),
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <View>
        <View style={styles.topHeader}>
          <Text style={styles.textStyle}>Погода</Text>
          <Text>Latitude{this.state.lat}</Text>
          <Text>Longitude{this.state.lng}</Text>
          <Text>{this.state.city}</Text>
          <Text>{this.state.country}</Text>
          <Text>{this.state.gradeC}</Text>
          <TouchableOpacity onPress={ this.newGeolocation.bind(this, 'asdas') }>
            <Text style={styles.textStyle}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}




const styles = {
  topHeader: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 44,    
  },
  textButton: {
    fontSize: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
};

AppRegistry.registerComponent('WeaterApp', () => WeaterApp);
