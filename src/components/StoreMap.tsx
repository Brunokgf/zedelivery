import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Clock, Phone } from "lucide-react";
import { useState, useEffect } from "react";

const STORES = [
  { lat: -23.5505, lng: -46.6333, name: "Zé Delivery - Centro SP" },
  { lat: -23.5630, lng: -46.6543, name: "Zé Delivery - Paulista" },
  { lat: -23.5475, lng: -46.6361, name: "Zé Delivery - República" },
  { lat: -22.9068, lng: -43.1729, name: "Zé Delivery - Centro RJ" },
  { lat: -22.9707, lng: -43.1824, name: "Zé Delivery - Copacabana" },
  { lat: -19.9167, lng: -43.9345, name: "Zé Delivery - BH" },
  { lat: -25.4284, lng: -49.2733, name: "Zé Delivery - Curitiba" },
  { lat: -30.0346, lng: -51.2177, name: "Zé Delivery - Porto Alegre" },
  { lat: -12.9714, lng: -38.5124, name: "Zé Delivery - Salvador" },
  { lat: -8.0476, lng: -34.8770, name: "Zé Delivery - Recife" },
];

const storeIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestStore(lat: number, lng: number) {
  let nearest = STORES[0];
  let minDist = Infinity;
  for (const store of STORES) {
    const d = haversineDistance(lat, lng, store.lat, store.lng);
    if (d < minDist) {
      minDist = d;
      nearest = store;
    }
  }
  return nearest;
}

const FlyToNearest = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 2 });
  }, [center, map]);
  return null;
};

const StoreMap = () => {
  const [nearestCenter, setNearestCenter] = useState<LatLngTuple | null>(null);
  const [nearestName, setNearestName] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = findNearestStore(pos.coords.latitude, pos.coords.longitude);
          setNearestCenter([nearest.lat, nearest.lng]);
          setNearestName(nearest.name);
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, []);

  return (
    <section className="bg-card border-t border-border">
      <div className="container py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-foreground flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6 text-ze-orange" />
            Nossas Lojas
          </h2>
          <p className="text-muted-foreground mt-1">
            {nearestName
              ? <>Loja mais próxima: <strong className="text-foreground">{nearestName}</strong></>
              : "Encontre a loja mais perto de você"}
          </p>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg border border-border" style={{ height: 350 }}>
          <MapContainer
            center={[-15.7801, -47.9292]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {nearestCenter && <FlyToNearest center={nearestCenter} />}
            {STORES.map((store, i) => (
              <Marker key={i} position={[store.lat, store.lng]} icon={storeIcon}>
                <Popup>
                  <strong>{store.name}</strong>
                  <br />
                  <span className="text-xs">Aberto agora • Entrega rápida</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
            <MapPin className="h-5 w-5 text-ze-orange shrink-0" />
            <div>
              <p className="font-bold text-sm text-foreground">+10 lojas</p>
              <p className="text-xs text-muted-foreground">Em todo o Brasil</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
            <Clock className="h-5 w-5 text-ze-orange shrink-0" />
            <div>
              <p className="font-bold text-sm text-foreground">Entrega em ~20min</p>
              <p className="text-xs text-muted-foreground">Para lojas próximas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
            <Phone className="h-5 w-5 text-ze-orange shrink-0" />
            <div>
              <p className="font-bold text-sm text-foreground">Suporte 24h</p>
              <p className="text-xs text-muted-foreground">Via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreMap;
