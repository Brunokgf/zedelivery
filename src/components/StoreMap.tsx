import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Clock, Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { STORES, findNearestStore } from "@/data/stores";

const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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
          const { store: nearest } = findNearestStore(pos.coords.latitude, pos.coords.longitude);
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
              <p className="font-bold text-sm text-foreground">+{STORES.length} lojas</p>
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
