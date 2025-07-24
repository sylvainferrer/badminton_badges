"use client";

import { useState, useRef, useEffect } from "react";

const colorMap = {
  "Point direct": "#7f22fe",
  "Faute provoquée": "#c10007",
  "Maladresse adverse": "#f0b100",
  "Coup de chance": "#008236",
  Annulé: "#4a5565",
};

const players = ["Joueur A", "Joueur B", "Lucas", "Emma", "Maxime"];

export default function BadmintonCourt({
  leftCoords,
  rightCoords,
  setLeftCoords,
  setRightCoords,
  stats,
  setStats,
}) {
  const COURT_WIDTH_M = 13.4;
  const COURT_HEIGHT_M = 6.1;

  const courtRef = useRef(null);
  const [points, setPoints] = useState({});
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [stage, setStage] = useState(1);

  const [playerA, setPlayerA] = useState("Joueur A");
  const [playerB, setPlayerB] = useState("Joueur B");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  useEffect(() => {
    setStats((prev) => ({
      joueurA: { ...prev.joueurA, nom: playerA },
      joueurB: { ...prev.joueurB, nom: playerB },
    }));
  }, [playerA, playerB]);

  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      if (courtRef.current) {
        const rect = courtRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleCourtClick = (e, side) => {
    if (!courtRef.current) return;
    const rect = courtRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    const x = parseFloat(((xPx / rect.width) * COURT_WIDTH_M).toFixed(2));
    const y = parseFloat(((yPx / rect.height) * COURT_HEIGHT_M).toFixed(2));
    setSelectedPoint({ coords: { x, y }, side });
  };

  const [firstChoice, setFirstChoice] = useState(null);

  const handleFirstChoice = (choice) => {
    if (!selectedPoint) return;
    if (choice === "Annulé") {
      setSelectedPoint(null);
      setFirstChoice(null);
      return;
    }

    setFirstChoice(choice);
    setStage(2);

    const { coords, side } = selectedPoint;
    const zone = getZoneFromX(coords.x, side);
    const winnerSide = side === "left" ? "right" : "left";

    const newPointData = {
      coords,
      itemMenu: choice,
      itemSubmenu: null,
      zone,
      side: winnerSide,
    };

    const newId = Object.keys(points).length + 1;

    setPoints((prev) => ({ ...prev, [newId]: newPointData }));

    const updateState = (setter, sideKey) => {
      setter((prev) => ({ ...prev, [newId]: newPointData }));
      setStats((prev) => ({
        ...prev,
        [sideKey]: {
          ...prev[sideKey],
          stats: { ...prev[sideKey].stats, [newId]: newPointData },
        },
      }));
    };

    winnerSide === "left"
      ? updateState(setLeftCoords, "joueurA")
      : updateState(setRightCoords, "joueurB");
  };

  const handleSecondChoice = (submenuValue) => {
    const lastId = Object.keys(points).length;
    const winnerSide = points[lastId].side;

    const updateWithSubmenu = (setter, sideKey, scoreSetter) => {
      setter((prev) => ({
        ...prev,
        [lastId]: {
          ...prev[lastId],
          itemSubmenu: submenuValue,
        },
      }));
      scoreSetter((prev) => prev + 1);
      setStats((prev) => ({
        ...prev,
        [sideKey]: {
          ...prev[sideKey],
          stats: {
            ...prev[sideKey].stats,
            [lastId]: {
              ...prev[sideKey].stats[lastId],
              itemSubmenu: submenuValue,
            },
          },
        },
      }));
    };

    winnerSide === "left"
      ? updateWithSubmenu(setLeftCoords, "joueurA", setScoreA)
      : updateWithSubmenu(setRightCoords, "joueurB", setScoreB);

    setSelectedPoint(null);
    setFirstChoice(null);
    setStage(1);
  };

  const getZoneFromX = (x, side) => {
    const third = 6.7 / 3;
    if (side === "left") {
      if (x < third) return "Arrière";
      if (x < 2 * third) return "Médiane";
      return "Avant";
    } else {
      if (x < 6.7 + third) return "Avant";
      if (x < 6.7 + 2 * third) return "Médiane";
      return "Arrière";
    }
  };

  const getSecondOptions = (zone) => {
    if (zone === "Avant") return ["Amorti", "Contre-amorti", "Autre"];
    if (zone === "Médiane")
      return [
        "Amorti",
        "Smash",
        "Drive",
        "Dégager",
        "Service gagnant",
        "Autre",
      ];
    if (zone === "Arrière")
      return ["Dégager", "Lift", "Drive", "Smash", "Service gagnant", "Autre"];
    return [];
  };

  const handleServiceFault = (faultSide) => {
    const newId = Object.keys(points).length + 1;
    const newData = {
      itemMenu: "Faute au service",
      coords: null,
      side: faultSide,
    };

    setPoints((prev) => ({ ...prev, [newId]: newData }));

    const update = (setter, scoreSetter, sideKey) => {
      setter((prev) => ({ ...prev, [newId]: newData }));
      scoreSetter((prev) => prev + 1);
      setStats((prev) => ({
        ...prev,
        [sideKey]: {
          ...prev[sideKey],
          stats: { ...prev[sideKey].stats, [newId]: newData },
        },
      }));
    };

    faultSide === "left"
      ? update(setLeftCoords, setScoreB, "joueurA")
      : update(setRightCoords, setScoreA, "joueurB");
  };

  // rendering UI is untouched for brevity
  return (
    <>
      <div className="flex justify-center gap-4 px-4 mb-4">
        {/* Joueur A */}
        <div className="text-white rounded-lg p-3 flex items-center">
          <div className="flex flex-col bg-emerald-600 rounded-lg p-3 m-2">
            <label className="text-sm font-semibold mb-1">Joueur A</label>
            <select
              value={playerA}
              onChange={(e) => setPlayerA(e.target.value)}
              className="text-black bg-white px-2 py-1 rounded text-sm"
            >
              {players.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col bg-emerald-600 rounded-lg p-3 items-center m-2">
            <label className="text-sm font-semibold mb-1">Score</label>
            <span className="text-xl font-bold">{scoreA}</span>
          </div>
        </div>

        {/* Joueur B */}
        <div className=" text-white rounded-lg p-3 flex items-center">
          <div className="flex flex-col bg-cyan-600 rounded-lg p-3 items-center m-2">
            <label className="text-sm font-semibold mb-1">Score</label>
            <span className="text-xl font-bold">{scoreB}</span>
          </div>
          <div className="flex flex-col items- bg-cyan-600 rounded-lg p-3 m-2">
            <label className="text-sm font-semibold mb-1">Joueur B</label>
            <select
              value={playerB}
              onChange={(e) => setPlayerB(e.target.value)}
              className="text-black bg-white rounded px-2 py-1 text-sm"
            >
              {players.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div
        className="court bg-[linear-gradient(to_right,_#009966_50%,_#0092b8_50%)] relative"
        ref={courtRef}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3798.43 1729.13">
          <g>
            <path
              d="M0 0v1729.13h3798.43V0H0Zm3571.65 11.34V130.4H2471.81V11.34h1099.84ZM1893.54 1563.52v23.88h-555.59V141.73h555.59v23.88h11.34v-23.88h555.59V1587.4h-555.59v-23.88h-11.34ZM1326.61 858.9H226.77V141.73h1099.84V858.9Zm0 11.34v717.17H226.77V870.24h1099.84Zm1145.2 0h1099.84v717.17H2471.81V870.24Zm0-11.34V141.73h1099.84V858.9H2471.81ZM1893.54 11.34v23.98h11.34V11.34h555.59V130.4h-555.59v-.1h-11.34v.1h-555.59V11.34h555.59Zm-566.93 0V130.4H226.77V11.34h1099.84Zm-1315.27 0h204.09V130.4H11.34V11.34Zm0 130.39h204.09V858.9H11.34V141.73Zm0 728.51h204.09v717.17H11.34V870.24Zm0 847.56v-119.06h204.09v119.06H11.34Zm215.43 0v-119.06h1099.84v119.06H226.77Zm1678.11 0v-27.02h-11.34v27.02h-555.59v-119.06h555.59v.1h11.34v-.1h555.59v119.06h-555.59Zm566.93 0v-119.06h1099.84v119.06H2471.81Zm1315.28 0H3583v-119.06h204.09v119.06Zm0-130.4H3583V870.23h204.09v717.17Zm0-728.5H3583V141.73h204.09V858.9Zm0-728.51H3583V11.34h204.09V130.4Z"
              className="court-lines"
            />
            <path
              d="M1893.54 1628.67h11.34v35.32h-11.34zM1893.54 1498.37h11.34v35.32h-11.34zM1893.54 1433.23h11.34v35.32h-11.34zM1893.54 1368.08h11.34v35.32h-11.34zM1893.54 1302.93h11.34v35.32h-11.34zM1893.54 1237.79h11.34v35.32h-11.34zM1893.54 1172.64h11.34v35.32h-11.34zM1893.54 1107.49h11.34v35.32h-11.34zM1893.54 1042.35h11.34v35.32h-11.34zM1893.54 977.2h11.34v35.32h-11.34zM1893.54 846.91h11.34v35.32h-11.34zM1893.54 912.05h11.34v35.32h-11.34zM1893.54 651.47h11.34v35.32h-11.34zM1893.54 781.76h11.34v35.32h-11.34zM1893.54 586.32h11.34v35.32h-11.34zM1893.54 456.03h11.34v35.32h-11.34zM1893.54 325.73h11.34v35.32h-11.34zM1893.54 390.88h11.34v35.32h-11.34zM1893.54 260.59h11.34v35.32h-11.34zM1893.54 65.15h11.34v35.32h-11.34zM1893.54 195.44h11.34v35.32h-11.34zM1893.54 521.17h11.34v35.32h-11.34zM1893.54 716.61h11.34v35.32h-11.34z"
              className="court-lines"
            />
          </g>
        </svg>

        {/* Overlay gauche */}
        <div
          className="court-left"
          onClick={(e) => handleCourtClick(e, "left")}
        />

        {/* Overlay droite */}
        <div
          className="court-right"
          onClick={(e) => handleCourtClick(e, "right")}
        />

        {/* Cercles jaune-orangé avec contour, calculés à partir des mètres */}
        {Object.entries(leftCoords).map(([id, data]) => {
          if (!data.coords) return null;
          const pt = data.coords;
          const leftPx = (pt.x / COURT_WIDTH_M) * size.width;
          const topPx = (pt.y / COURT_HEIGHT_M) * size.height;
          const fillColor = colorMap[data.itemMenu] || "#ffba00";
          return (
            <div
              key={`L${id}`}
              style={{
                position: "absolute",
                left: `${leftPx}px`,
                top: `${topPx}px`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
              onClick={(e) => e.stopPropagation()} // pour éviter de relancer un clic terrain
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 638.44"
                fill={colorMap[data.itemMenu] || "#ffba00"}
                className="w-3 h-auto sm:w-3 md:w-4 lg:w-[20px]"
              >
                <g>
                  <path d="M188.76,358.29c-12.37-80.14-24.4-160.51-30.02-241.46-.45-7.08-.81-14.16-1.05-21.24-3.07-24.5-17.74-46.53-39.21-58.77-18.36-10.55-39.78-13.25-60.03-7.76C16.35,40.46-8.63,83.97,2.75,126.07c21.26,83.65,119.31,288.01,153.09,354.56h53.45c-3.07-17.15-11.45-64.71-20.53-122.33Z" />
                  <path d="M493.38,126.07c24.67-106.96-132.61-140.8-154.84-33.21-1.3,48.42-10.95,127.48-18.61,181.45-7.36,54.86-26.87,172.99-33.09,206.31h53.45c14.64-29.15,124.88-250.29,153.09-354.55Z" />
                  <path d="M275.06,480.62c12.94-72.14,46.42-272.67,51.2-371.92.54-9.68.89-20.21.9-29.68-8.79-117.78-176.88-99.84-157.42,26.86,4.54,100.17,38.01,300.54,51.35,374.74h53.98Z" />
                  <path d="M184.43,611.96c62.29,61.36,163.73,8.03,153.64-77.64h-180c-1.88,28.45,5.29,57.43,26.36,77.64Z" />
                  <rect x="158.07" y="492.22" width="180" height="30.5" />
                </g>
              </svg>
            </div>
          );
        })}

        {Object.entries(rightCoords).map(([id, data]) => {
          if (!data.coords) return null;
          const pt = data.coords;
          const leftPx = (pt.x / COURT_WIDTH_M) * size.width;
          const topPx = (pt.y / COURT_HEIGHT_M) * size.height;
          const fillColor = colorMap[data.itemMenu] || "#ffba00";
          return (
            <div
              key={`R${id}`}
              style={{
                position: "absolute",
                left: `${leftPx}px`,
                top: `${topPx}px`,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
              onClick={(e) => e.stopPropagation()} // pour éviter de relancer un clic terrain
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 496 638.44"
                fill={colorMap[data.itemMenu] || "#ffba00"}
                stroke="black"
                strokeWidth="10"
                className="w-3 h-auto sm:w-3 md:w-4 lg:w-[20px]"
              >
                <g>
                  <path d="M188.76,358.29c-12.37-80.14-24.4-160.51-30.02-241.46-.45-7.08-.81-14.16-1.05-21.24-3.07-24.5-17.74-46.53-39.21-58.77-18.36-10.55-39.78-13.25-60.03-7.76C16.35,40.46-8.63,83.97,2.75,126.07c21.26,83.65,119.31,288.01,153.09,354.56h53.45c-3.07-17.15-11.45-64.71-20.53-122.33Z" />
                  <path d="M493.38,126.07c24.67-106.96-132.61-140.8-154.84-33.21-1.3,48.42-10.95,127.48-18.61,181.45-7.36,54.86-26.87,172.99-33.09,206.31h53.45c14.64-29.15,124.88-250.29,153.09-354.55Z" />
                  <path d="M275.06,480.62c12.94-72.14,46.42-272.67,51.2-371.92.54-9.68.89-20.21.9-29.68-8.79-117.78-176.88-99.84-157.42,26.86,4.54,100.17,38.01,300.54,51.35,374.74h53.98Z" />
                  <path d="M184.43,611.96c62.29,61.36,163.73,8.03,153.64-77.64h-180c-1.88,28.45,5.29,57.43,26.36,77.64Z" />
                  <rect x="158.07" y="492.22" width="180" height="30.5" />
                </g>
              </svg>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-2 px-4">
        <button
          onClick={() => handleServiceFault("left")}
          className="bg-emerald-600 text-white px-3 py-2 rounded cursor-pointer"
        >
          Faute au service
        </button>

        <button
          onClick={() => handleServiceFault("right")}
          className="bg-cyan-600 text-white px-3 py-2 rounded cursor-pointer"
        >
          Faute au service
        </button>
      </div>

      {selectedPoint && stage === 1 && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {[
            "Point direct",
            "Faute provoquée",
            "Maladresse adverse",
            "Coup de chance",
            "Annulé",
          ].map((label, index) => {
            const colors = [
              "bg-violet-600",
              "bg-red-700",
              "bg-yellow-500",
              "bg-green-700",
              "bg-gray-500",
            ];
            return (
              <button
                key={label}
                className={`${colors[index]} text-white px-4 py-2 rounded hover:brightness-110`}
                onClick={() => handleFirstChoice(label)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {selectedPoint && stage === 2 && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {getSecondOptions(
            getZoneFromX(selectedPoint.coords.x, selectedPoint.side)
          ).map((option) => (
            <button
              key={option}
              className="bg-yellow-300 text-yellow-800 px-4 py-2 rounded hover:bg-yellow-400"
              onClick={() => handleSecondChoice(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
