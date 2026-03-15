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
    if (!map || !points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 15,
      maxZoom: 10,
      gradient: { 0.4: "blue", 0.6: "lime", 0.8: "orange", 1.0: "red" },
    }).addTo(map);

    return () => {
      if (map && map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
    };
  }, [map, points]);
  return null;
}

const GrievanceMap = ({ complaints, onMarkerClick }) => {
  const [mapFilter, setMapFilter] = useState("All");
  const center = [20.9374, 77.7796]; // Centered specifically on Amravati region

  // 1. Data Processing for Stats Overlay
  const getDistrictStats = () => {
    const districts = { Amravati: 0, Akola: 0, Buldhana: 0 };
    complaints.forEach((c) => {
      const text =
        `${c.formatted_address || ""} ${c.description || ""}`.toLowerCase();
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
      {/* Department Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-2">
        {["All", "Road", "Light", "Water", "Sewage", "Garbage"].map((dept) => (
          <button
            key={dept}
            onClick={() => setMapFilter(dept)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all duration-300 ${
              mapFilter === dept
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200 border-slate-900"
                : "bg-white text-slate-400 hover:border-slate-200"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="h-[550px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative z-10">
        {/* ✨ District Stats Overlay Box */}
        <div className="absolute top-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/50 shadow-2xl hidden md:block w-52 animate-in slide-in-from-right duration-700">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            Regional Summary
          </p>
          <div className="space-y-4">
            {Object.entries(distStats).map(([name, count]) => (
              <div
                key={name}
                className="flex justify-between items-center group"
              >
                <span className="text-xs font-black text-slate-700 group-hover:text-blue-600 transition-colors">
                  {name}
                </span>
                <span
                  className={`text-[10px] font-black px-3 py-1 rounded-full shadow-sm transition-all ${
                    count > 10
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase text-center tracking-tighter">
              Geo-Intelligence Active
            </p>
          </div>
        </div>

        <MapContainer
          center={center}
          zoom={9}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Modern Light Theme Tiles
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          />
          <HeatmapLayer points={heatPoints} />

          {filteredData.map((c) => (
            <Marker
              key={c.id}
              position={[parseFloat(c.latitude), parseFloat(c.longitude)]}
              eventHandlers={{ click: () => onMarkerClick(c) }}
            >
              <Popup className="custom-popup">
                <div className="p-2 text-center font-sans min-w-[120px]">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                    #{c.id}
                  </p>
                  <p className="text-sm font-black text-slate-800 mb-2 leading-tight">
                    {c.department}
                  </p>
                  <button
                    onClick={() => onMarkerClick(c)}
                    className="w-full bg-slate-900 text-white text-[9px] py-2 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md"
                  >
                    Analyze Details
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
