"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  const mapStyles = {
    height: "300px",
    width: "100%",
    borderRadius: "0.5rem",
  };

  const defaultCenter = {
    lat: 48.8566, // Paris, France
    lng: 2.3522,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={15}
        center={defaultCenter}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent; 