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

// ✨ Feature: Auto-focus Map to show all markers
function ZoomToMarkers({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p[0], p[1]]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [points, map]);
  return null;
}

function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.4: "#3b82f6",
        0.6: "#10b981",
        0.8: "#f59e0b",
        1.0: "#ef4444",
      },
    }).addTo(map);

    return () => {
      if (map && map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
    };
  }, [map, points]);
  return null;
}

const GrievanceMap = ({ complaints, onMarkerClick }) => {
  const [mapFilter, setMapFilter] = useState("All");

  // Default fallback center (Amravati)
  const center = [20.9374, 77.7796];

  // 1. Data Cleaning: Marker points ke liye sirf valid coordinates filter karein
  const filteredData = (complaints || []).filter((c) => {
    const hasCoords = c.latitude && c.longitude;
    const matchesDept =
      mapFilter === "All" ||
      c.department?.toLowerCase().trim() === mapFilter.toLowerCase().trim();
    return hasCoords && matchesDept;
  });

  // 2. Heatmap points logic
  const heatPoints = filteredData.map((c) => [
    parseFloat(c.latitude),
    parseFloat(c.longitude),
    c.priority === "CRITICAL" ? 1.0 : 0.5,
  ]);

  return (
    <div className="space-y-4">
      {/* Interactive Tabs */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Road", "Light", "Water", "Sewage", "Garbage"].map((dept) => (
          <button
            key={dept}
            onClick={() => setMapFilter(dept)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${
              mapFilter === dept
                ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                : "bg-white border-slate-100 text-slate-400 hover:border-blue-200"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Map Main Container */}
      <div className="h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-10">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Professional High-Res Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; SmartGrievance Engine"
          />

          <HeatmapLayer points={heatPoints} />
          <ZoomToMarkers points={heatPoints} />

          {filteredData.map((c) => (
            <Marker
              key={c.id}
              position={[parseFloat(c.latitude), parseFloat(c.longitude)]}
            >
              <Popup>
                <div className="p-2 text-center min-w-[130px] font-sans">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">
                    Complaint #{c.id}
                  </p>
                  <p className="text-sm font-black text-slate-800 mb-2 leading-tight">
                    {c.department}
                  </p>
                  <button
                    onClick={() => onMarkerClick(c)}
                    className="w-full bg-slate-900 text-white text-[9px] py-2 rounded-lg font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md"
                  >
                    View Record
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex justify-center gap-6 py-2 border-t border-slate-50 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Normal Alert
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Critical Zone
          </span>
        </div>
      </div>
    </div>
  );
};

export default GrievanceMap;
