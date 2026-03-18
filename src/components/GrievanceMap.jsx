import React, { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

// ✨ Professional Glow Markers Logic
const createPulseIcon = (color) =>
  L.divIcon({
    html: `<div class="pulse-container">
           <div class="pulse-dot" style="background: ${color}"></div>
           <div class="pulse-ring" style="border-color: ${color}"></div>
         </div>`,
    className: "custom-pulse-icon",
    iconSize: [20, 20],
  });

const icons = {
  CRITICAL: createPulseIcon("#ff4d4d"),
  HIGH: createPulseIcon("#ffa500"),
  MEDIUM: createPulseIcon("#3b82f6"),
  LOW: createPulseIcon("#10b981"),
};

function MapController({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p[0], p[1]]));
      map.flyToBounds(bounds, { padding: [100, 100], duration: 1.5 });
    }
  }, [points, map]);
  return null;
}

function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !points.length) return;
    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 20,
      maxZoom: 18,
      gradient: {
        0.2: "#3b82f6",
        0.5: "#10b981",
        0.8: "#f59e0b",
        1.0: "#ef4444",
      },
    }).addTo(map);
    return () => {
      if (map) map.removeLayer(heatLayer);
    };
  }, [map, points]);
  return null;
}

const GrievanceMap = ({ complaints, onMarkerClick }) => {
  const [mapFilter, setMapFilter] = useState("All");

  // 1. ✨ Robust Department Fetching Logic (Handles Strings & Arrays)
  const filteredData = useMemo(() => {
    return (complaints || []).filter((c) => {
      const hasCoords = c.latitude && c.longitude;
      if (!hasCoords) return false;

      if (mapFilter === "All") return true;

      // Check if backend sent department as an array or single string
      const depts = Array.isArray(c.department) ? c.department : [c.department];
      return depts.some(
        (d) => d?.toLowerCase().trim() === mapFilter.toLowerCase().trim(),
      );
    });
  }, [complaints, mapFilter]);

  // 2. Heatmap Points with Dynamic Intensity
  const heatPoints = useMemo(
    () =>
      filteredData.map((c) => [
        parseFloat(c.latitude),
        parseFloat(c.longitude),
        c.priority === "CRITICAL" ? 1.0 : 0.6,
      ]),
    [filteredData],
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Sleek Department Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {["All", "Road", "Light", "Water", "Sewage", "Garbage"].map((dept) => (
          <button
            key={dept}
            onClick={() => setMapFilter(dept)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2 ${
              mapFilter === dept
                ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-105"
                : "bg-white border-slate-100 text-slate-400 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="h-[600px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white relative bg-slate-100">
        <MapContainer
          center={[20.9374, 77.7796]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Satellite View">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Clean Street View">
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            </LayersControl.BaseLayer>
          </LayersControl>

          <HeatmapLayer points={heatPoints} />
          <MapController points={heatPoints} />

          {filteredData.map((c) => (
            <Marker
              key={`${c.id}-${mapFilter}`}
              position={[parseFloat(c.latitude), parseFloat(c.longitude)]}
              icon={icons[c.priority] || icons.MEDIUM}
            >
              <Popup>
                <div className="p-3 text-center min-w-[160px]">
                  <div className="w-full h-24 mb-3 overflow-hidden rounded-2xl bg-slate-100 border">
                    <img
                      src={c.image || "https://via.placeholder.com/150"}
                      className="w-full h-full object-cover"
                      alt="preview"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=No+Preview")
                      }
                    />
                  </div>
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">
                    Ticket #{c.id}
                  </p>
                  <h4 className="text-xs font-black text-slate-800 mb-3 uppercase tracking-tighter">
                    {Array.isArray(c.department)
                      ? c.department.join(" + ")
                      : c.department}
                  </h4>
                  <button
                    onClick={() => onMarkerClick(c)}
                    className="w-full bg-slate-900 text-white text-[9px] py-2.5 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                  >
                    Inspect Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Intelligence Overlay */}
        <div className="absolute bottom-8 left-8 z-[1000] bg-slate-900/90 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/20 shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Live Analysis: {mapFilter}
            </span>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-2xl font-black">{filteredData.length}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase">
                Incidents
              </p>
            </div>
            <div className="w-[1px] bg-white/10"></div>
            <div>
              <p className="text-2xl font-black text-red-500">
                {filteredData.filter((x) => x.priority === "CRITICAL").length}
              </p>
              <p className="text-[8px] font-bold text-slate-500 uppercase">
                High Risk
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pulse-container { position: relative; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; position: relative; z-index: 2; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
        .pulse-ring { border: 2px solid; width: 16px; height: 16px; border-radius: 50%; position: absolute; animation: realistic-pulse 2s infinite; opacity: 0; }
        @keyframes realistic-pulse { 0% { transform: scale(0.6); opacity: 0; } 50% { opacity: 0.4; } 100% { transform: scale(2.2); opacity: 0; } }
        .leaflet-popup-content-wrapper { border-radius: 2.5rem !important; padding: 4px !important; box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default GrievanceMap;
