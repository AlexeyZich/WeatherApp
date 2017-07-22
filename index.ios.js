import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  AppRegistry,
  ActivityIndicator,
} from 'react-native';

export default class WeaterApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: null,
      lng: null,
      isLoading: true,
      enterString: '',
      country: '',
      city: '',
      gradeC: null,
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  componentDidUpdate(prevState) {
    if(prevState.lat !== null && prevState.lng !== null) {
      this.fetchWeatherJSON();
    }
  }

  fetchWeatherJSON() {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&APPID=`    
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
          <Text>{this.state.country}</Text>
          <Text>{this.state.city}</Text>
          <Text>{this.state.gradeC}</Text>
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
