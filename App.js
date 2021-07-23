import * as React from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {Accuracy} from "expo-location";
import {useState, useEffect} from "react";

 function App() {
  const mapViewRef = React.createRef();
  const [hasLocationPermission, setlocationPermission] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([])
  const [selectedCoordinate, setSelectedCoordinate] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)

     const getLocationPermission = async () => {
         await Location.requestForegroundPermissionsAsync().then((item)=>{
             setlocationPermission(item.granted)
    } );

  };

     useEffect (() => {
         const response = getLocationPermission()
     });


   const updateLocation = async () => {
       await Location.getCurrentPositionAsync({accuracy: Accuracy.Balanced}).then((item)=>{
           setCurrentLocation(item.coords)
       } );
  };

  const handleLongPress = event => {
      const coordinate = event.nativeEvent.coordinate
      setUserMarkerCoordinates((oldArray) => [...oldArray, coordinate])
  };

     const findAddress = async coordinate => {
         await Location.reverseGeocodeAsync(coordinate).then((data) => {
             console.log(data)
             setSelectedAddress(data)
         });
     };


     const handleSelectMarker = coordinate => {
         setSelectedCoordinate(coordinate)
        const response = findAddress(coordinate)
  };


  const closeInfoBox = () =>
     setSelectedCoordinate(null) && setSelectedAddress(null)


  const RenderCurrentLocation = (props) => {
    if (props.hasLocationPermission === null) {
      return null;
    }
    if (props.hasLocationPermission === false) {
      return <Text>No location access. Go to settings to change</Text>;
    }
    return (
        <View>
          <Button style title="update location" onPress={updateLocation} />
          {currentLocation && (
              <Text>
                {`lat: ${currentLocation.latitude},\nLong:${
                    currentLocation.longitude
                }\nacc: ${currentLocation.accuracy}`}
              </Text>
          )}
        </View>
    );
  };

   {

    return (
        <SafeAreaView style={styles.container}>
          <RenderCurrentLocation props={{hasLocationPermission: hasLocationPermission, currentLocation: currentLocation}} />
          <MapView
              provider="google"
              style={styles.map}
              ref={mapViewRef}
              showsUserLocation
              onLongPress={handleLongPress}>
            <Marker
                coordinate={{ latitude: 55.676195, longitude: 12.569419 }}
                title="Rådhuspladsen"
                description="blablabal"
            />
            <Marker
                coordinate={{ latitude: 55.673035, longitude: 12.568756 }}
                title="Tivoli"
                description="blablabal"
            />
            <Marker
                coordinate={{ latitude: 55.674082, longitude: 12.598108 }}
                title="Christiania"
                description="blablabal"
            />
            {userMarkerCoordinates.map((coordinate, index) => (
                <Marker
                    coordinate={coordinate}
                    key={index.toString()}
                    onPress={() => handleSelectMarker(coordinate)}
                />
            ))}
          </MapView>
          {selectedCoordinate && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {selectedCoordinate.latitude}, {selectedCoordinate.longitude}
                </Text>
                {selectedAddress && (
                    <Text style={styles.infoText}>
                      {selectedAddress.name} {selectedAddress.postalCode}
                    </Text>
                )}
                <Button title="close" onPress={closeInfoBox} />
              </View>
          )}
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  map: { flex: 1 },
  infoBox: {
    height: 200,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 15,
  },
});
export default App