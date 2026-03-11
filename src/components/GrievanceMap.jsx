import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet Default Icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !points.length) return;
    const heatLayer = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 10,
      gradient: { 0.4: "blue", 0.6: "lime", 0.8: "orange", 1.0: "red" },
    }).addTo(map);
    return () => {
      if (map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
    };
  }, [map, points]);
  return null;
}

const GrievanceMap = ({ complaints, onMarkerClick }) => {
  const [mapFilter, setMapFilter] = useState("All");
  const center = [20.7, 77.0];

  // 1. Data Processing for Stats Overlay
  const getDistrictStats = () => {
    const districts = { Amravati: 0, Akola: 0, Buldhana: 0 };
    complaints.forEach((c) => {
      // Logic: Address ya description mein district ka naam dhoondo
      const text = (c.formatted_address + c.description).toLowerCase();
      if (text.includes("amravati")) districts.Amravati++;
      else if (text.includes("akola")) districts.Akola++;
      else if (text.includes("buldhana")) districts.Buldhana++;
    });
    return districts;
  };

  const distStats = getDistrictStats();

  const filteredData = complaints.filter((c) => {
    const hasCoords = c.latitude && c.longitude;
    const matchesDept = mapFilter === "All" || c.department === mapFilter;
    return hasCoords && matchesDept;
  });

  const heatPoints = filteredData.map((c) => [
    parseFloat(c.latitude),
    parseFloat(c.longitude),
    c.priority === "CRITICAL" ? 1.0 : 0.6,
  ]);

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {["All", "Road", "Light", "Water", "Sewage", "Garbage"].map((dept) => (
          <button
            key={dept}
            onClick={() => setMapFilter(dept)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-all ${
              mapFilter === dept
                ? "bg-slate-800 text-white shadow-md"
                : "bg-white text-slate-400"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="h-[550px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative z-10">
        {/* ✨ District Stats Overlay Box */}
        <div className="absolute top-6 right-6 z-[1000] bg-white/80 backdrop-blur-md p-5 rounded-[2rem] border border-white/50 shadow-xl hidden md:block w-48 animate-in slide-in-from-right duration-500">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Regional Summary
          </p>
          <div className="space-y-3">
            {Object.entries(distStats).map(([name, count]) => (
              <div key={name} className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">{name}</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${count > 10 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
                >
                  {count} Cases
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <p className="text-[9px] font-bold text-slate-500 italic text-center">
              Active Monitoring Live
            </p>
          </div>
        </div>

        <MapContainer
          center={center}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <HeatmapLayer points={heatPoints} />
          {filteredData.map((c) => (
            <Marker
              key={c.id}
              position={[parseFloat(c.latitude), parseFloat(c.longitude)]}
              eventHandlers={{ click: () => onMarkerClick(c) }}
            >
              <Popup>
                <div className="p-1 text-center font-sans">
                  <p className="text-[10px] font-bold text-blue-600">
                    ID: #{c.id}
                  </p>
                  <p className="text-xs font-black uppercase text-slate-800">
                    {c.department}
                  </p>
                  <button
                    onClick={() => onMarkerClick(c)}
                    className="mt-2 bg-slate-800 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase"
                  >
                    Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default GrievanceMap;
