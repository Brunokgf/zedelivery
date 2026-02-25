import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Clock, Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";

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
  { lat: -15.7975, lng: -47.8919, name: "Zé Delivery - Brasília" },
  { lat: -3.7172, lng: -38.5433, name: "Zé Delivery - Fortaleza" },
  { lat: -3.1190, lng: -60.0217, name: "Zé Delivery - Manaus" },
  { lat: -16.6869, lng: -49.2648, name: "Zé Delivery - Goiânia" },
  { lat: -2.5297, lng: -44.2825, name: "Zé Delivery - São Luís" },
  { lat: -1.4558, lng: -48.5024, name: "Zé Delivery - Belém" },
  { lat: -5.7945, lng: -35.2110, name: "Zé Delivery - Natal" },
  { lat: -20.3155, lng: -40.3128, name: "Zé Delivery - Vitória" },
  { lat: -27.5954, lng: -48.5480, name: "Zé Delivery - Florianópolis" },
  { lat: -10.9472, lng: -37.0731, name: "Zé Delivery - Aracaju" },
];

const storeIcon = new L.Icon({
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

const StoreMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearestName, setNearestName] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [-15.7801, -47.9292],
      zoom: 4,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    STORES.forEach((store) => {
      L.marker([store.lat, store.lng], { icon: storeIcon })
        .addTo(map)
        .bindPopup(`<strong>${store.name}</strong><br/><span style="font-size:11px">Aberto agora • Entrega rápida</span>`);
    });

    mapRef.current = map;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = findNearestStore(pos.coords.latitude, pos.coords.longitude);
          setNearestName(nearest.name);
          map.flyTo([nearest.lat, nearest.lng], 13, { duration: 2 });
        },
        () => {},
        { timeout: 5000 }
      );
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
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
          <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
            <MapPin className="h-5 w-5 text-ze-orange shrink-0" />
            <div>
              <p className="font-bold text-sm text-foreground">+20 lojas</p>
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
