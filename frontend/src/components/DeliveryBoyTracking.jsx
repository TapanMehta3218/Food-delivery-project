import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

const deliveryBoyIcon = L.divIcon({
  html: `<div style="background-color: #ff4d2d; color: white; padding: 6px; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;"><span style="font-size: 14px;">🚴</span></div>`,
  className: "custom-div-icon-db",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const customerIcon = L.divIcon({
  html: `<div style="background-color: #3b82f6; color: white; padding: 6px; border-radius: 50%; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 2px solid white; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;"><span style="font-size: 14px;">📍</span></div>`,
  className: "custom-div-icon-cust",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function FitBounds({ deliveryBoyLocation, customerLocation }) {
  const map = useMap();
  useEffect(() => {
    if (
      deliveryBoyLocation?.lat &&
      deliveryBoyLocation?.lon &&
      customerLocation?.lat &&
      customerLocation?.lon
    ) {
      const bounds = [
        [deliveryBoyLocation.lat, deliveryBoyLocation.lon],
        [customerLocation.lat, customerLocation.lon],
      ];
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [
    deliveryBoyLocation?.lat,
    deliveryBoyLocation?.lon,
    customerLocation?.lat,
    customerLocation?.lon,
    map,
  ]);
  return null;
}

function DeliveryBoyTracking({ data }) {
  const { deliveryBoyLocation, customerLocation } = data;

  const dbLat = deliveryBoyLocation?.lat;
  const dbLon = deliveryBoyLocation?.lon;
  const custLat = customerLocation?.lat;
  const custLon = customerLocation?.lon;

  const validLocations = dbLat && dbLon && custLat && custLon;

  return (
    <div className="w-full h-full relative" style={{ minHeight: "300px" }}>
      {validLocations ? (
        <MapContainer
          center={[dbLat, dbLon]}
          zoom={14}
          className="w-full h-full"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds
            deliveryBoyLocation={deliveryBoyLocation}
            customerLocation={customerLocation}
          />
          <Marker position={[dbLat, dbLon]} icon={deliveryBoyIcon} />
          <Marker position={[custLat, custLon]} icon={customerIcon} />
        </MapContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          Loading map coordinates...
        </div>
      )}
    </div>
  );
}

export default DeliveryBoyTracking;
