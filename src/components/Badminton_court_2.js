"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image';

export default function BadmintonCourt({ leftCoords, rightCoords, setLeftCoords, setRightCoords }) {
  // Dimensions d’un demi-terrain (en mètres)
  const COURT_WIDTH_M = 6.1;
  const HALF_LENGTH_M = 6.7;

  // Ref sur le terrain complet
  const courtRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [points, setPoints] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);


  // Pour avoir la taille en pixels du terrain à chaque affichage / resize
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      if (courtRef.current) {
        const rect = courtRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handler générique de clic
  const handleCourtClick = (e, side) => {
  if (!courtRef.current) return;
  const rect = courtRef.current.getBoundingClientRect();

  // Coordonnées du clic en pixels (relatives au terrain)
  const xPx = e.clientX - rect.left;
  const yPx = e.clientY - rect.top;

  // Conversion en mètres
  const x = parseFloat(((xPx / rect.width) * COURT_WIDTH_M).toFixed(2));
  const y = parseFloat(((yPx / rect.height) * HALF_LENGTH_M).toFixed(2));

  const coords = { x, y };

  // ✅ Position du menu contextuel relative au terrain
  setContextMenu({
    x: xPx,
    y: yPx, 
    side,
    coords
  });
};


const handleSelectSubmenu = (submenuValue) => {
  const { coords, side } = contextMenu;

  const newPointData = {
    coords,
    itemMenu: selectedMenu,
    itemSubmenu: submenuValue
  };

  const newId = Object.keys(points).length + 1;

  setPoints(prev => ({
    ...prev,
    [newId]: { ...newPointData, side }
  }));

  if (side === "left") {
    setLeftCoords(prev => ({
      ...prev,
      [newId]: newPointData
    }));
  } else {
    setRightCoords(prev => ({
      ...prev,
      [newId]: newPointData
    }));
  }

  setHistory(prev => [
    ...prev,
    {
      side,
      point: coords
    }
  ]);


  // Réinitialisation des menus
  setContextMenu(null);
  setSelectedMenu(null);
};

const submenuOptions = {
  Service: ["Court", "Long", "Lob"],
  Smash: ["Croisé", "Ligne", "Amorti"],
  Défense: ["Lift", "Drive", "Contre-amorti"]
};



  return (
    <>

    <div className="flex gap-4 mb-4">
     <button
  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
  onClick={() => {
    if (history.length === 0) return;

    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    const lastId = Object.keys(points).find(
      key =>
        points[key].coords.x === last.point.x &&
        points[key].coords.y === last.point.y &&
        points[key].side === last.side
    );

    if (!lastId) return;

    setPoints(prev => {
      const copy = { ...prev };
      delete copy[lastId];
      return copy;
    });

    if (last.side === 'left') {
      setLeftCoords(prev => {
        const copy = { ...prev };
        delete copy[lastId];
        return copy;
      });
    } else {
      setRightCoords(prev => {
        const copy = { ...prev };
        delete copy[lastId];
        return copy;
      });
    }
  }}
>
  Annuler le dernier point
</button>

    </div>

      <div
        className="court bg-emerald-700 relative"
        ref={courtRef}
      >

      {contextMenu && (
  <div
    className="absolute z-50 bg-white border shadow-xl min-w-[160px]"
    style={{ top: contextMenu.y, left: contextMenu.x }}
  >
    {!selectedMenu ? (
      <div>
        {/* Titre */}
        <div className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 border-b">
          Choisissez une action
        </div>

        {/* Items de menu */}
        <div className="space-y-1 p-2">
          {["Service", "Smash", "Défense"].map(item => (
            <div
              key={item}
              className="px-3 py-1.5 rounded hover:bg-blue-100 cursor-pointer text-gray-800"
              onClick={() => setSelectedMenu(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div>
        {/* Titre du sous-menu */}
        <div className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 border-b">
          {selectedMenu}
        </div>

        {/* Items du sous-menu */}
        <div className="space-y-1 p-2">
          {submenuOptions[selectedMenu]?.map(sub => (
            <div
              key={sub}
              className="px-3 py-1.5 rounded hover:bg-blue-100 cursor-pointer text-gray-800"
              onClick={() => handleSelectSubmenu(sub)}
            >
              {sub}
            </div>
          ))}
        </div>

        {/* Retour en bas à gauche */}
        <div className="border-t p-2">
          <button
            className="text-sm text-gray-600 hover:underline flex items-center gap-1 cursor-pointer"
            onClick={() => setSelectedMenu(null)}
          >
            <span className="text-lg leading-none">←</span> Retour
          </button>
        </div>
      </div>
    )}
  </div>
)}



      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3798.43 1729.13">
        <g>
          <path d="M0 0v1729.13h3798.43V0H0Zm3571.65 11.34V130.4H2471.81V11.34h1099.84ZM1893.54 1563.52v23.88h-555.59V141.73h555.59v23.88h11.34v-23.88h555.59V1587.4h-555.59v-23.88h-11.34ZM1326.61 858.9H226.77V141.73h1099.84V858.9Zm0 11.34v717.17H226.77V870.24h1099.84Zm1145.2 0h1099.84v717.17H2471.81V870.24Zm0-11.34V141.73h1099.84V858.9H2471.81ZM1893.54 11.34v23.98h11.34V11.34h555.59V130.4h-555.59v-.1h-11.34v.1h-555.59V11.34h555.59Zm-566.93 0V130.4H226.77V11.34h1099.84Zm-1315.27 0h204.09V130.4H11.34V11.34Zm0 130.39h204.09V858.9H11.34V141.73Zm0 728.51h204.09v717.17H11.34V870.24Zm0 847.56v-119.06h204.09v119.06H11.34Zm215.43 0v-119.06h1099.84v119.06H226.77Zm1678.11 0v-27.02h-11.34v27.02h-555.59v-119.06h555.59v.1h11.34v-.1h555.59v119.06h-555.59Zm566.93 0v-119.06h1099.84v119.06H2471.81Zm1315.28 0H3583v-119.06h204.09v119.06Zm0-130.4H3583V870.23h204.09v717.17Zm0-728.5H3583V141.73h204.09V858.9Zm0-728.51H3583V11.34h204.09V130.4Z" className="court-lines"/>
          <path d="M1893.54 1628.67h11.34v35.32h-11.34zM1893.54 1498.37h11.34v35.32h-11.34zM1893.54 1433.23h11.34v35.32h-11.34zM1893.54 1368.08h11.34v35.32h-11.34zM1893.54 1302.93h11.34v35.32h-11.34zM1893.54 1237.79h11.34v35.32h-11.34zM1893.54 1172.64h11.34v35.32h-11.34zM1893.54 1107.49h11.34v35.32h-11.34zM1893.54 1042.35h11.34v35.32h-11.34zM1893.54 977.2h11.34v35.32h-11.34zM1893.54 846.91h11.34v35.32h-11.34zM1893.54 912.05h11.34v35.32h-11.34zM1893.54 651.47h11.34v35.32h-11.34zM1893.54 781.76h11.34v35.32h-11.34zM1893.54 586.32h11.34v35.32h-11.34zM1893.54 456.03h11.34v35.32h-11.34zM1893.54 325.73h11.34v35.32h-11.34zM1893.54 390.88h11.34v35.32h-11.34zM1893.54 260.59h11.34v35.32h-11.34zM1893.54 65.15h11.34v35.32h-11.34zM1893.54 195.44h11.34v35.32h-11.34zM1893.54 521.17h11.34v35.32h-11.34zM1893.54 716.61h11.34v35.32h-11.34z" className="court-lines"/>
        </g>
      </svg>


        {/* Overlay gauche */}
        <div
          className="court-left"
          onClick={e => handleCourtClick(e, 'left')}
        />

        {/* Overlay droite */}
        <div
          className="court-right"
          onClick={e => handleCourtClick(e, "right")}
        />

        {/* Cercles jaune-orangé avec contour, calculés à partir des mètres */}
        {Object.entries(leftCoords).map(([id, data]) => {
          const pt = data.coords;
          const leftPx = (pt.x / COURT_WIDTH_M) * size.width;
          const topPx = (pt.y / HALF_LENGTH_M) * size.height;
          return (
            <div
              key={`L${id}`}
              style={{
                position:       'absolute',
                left:           `${leftPx}px`,
                top:            `${topPx}px`,
                transform:      'translate(-50%, -50%)',
                pointerEvents:  'none'
              }}
              onClick={(e) => e.stopPropagation()} // pour éviter de relancer un clic terrain
              
            >
              
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 638.44" fill="#ffba00" className="w-3 h-auto sm:w-3 md:w-4 lg:w-[20px]">
                  <g>
                    <path d="M188.76,358.29c-12.37-80.14-24.4-160.51-30.02-241.46-.45-7.08-.81-14.16-1.05-21.24-3.07-24.5-17.74-46.53-39.21-58.77-18.36-10.55-39.78-13.25-60.03-7.76C16.35,40.46-8.63,83.97,2.75,126.07c21.26,83.65,119.31,288.01,153.09,354.56h53.45c-3.07-17.15-11.45-64.71-20.53-122.33Z"/>
                    <path d="M493.38,126.07c24.67-106.96-132.61-140.8-154.84-33.21-1.3,48.42-10.95,127.48-18.61,181.45-7.36,54.86-26.87,172.99-33.09,206.31h53.45c14.64-29.15,124.88-250.29,153.09-354.55Z"/>
                    <path d="M275.06,480.62c12.94-72.14,46.42-272.67,51.2-371.92.54-9.68.89-20.21.9-29.68-8.79-117.78-176.88-99.84-157.42,26.86,4.54,100.17,38.01,300.54,51.35,374.74h53.98Z"/>
                    <path d="M184.43,611.96c62.29,61.36,163.73,8.03,153.64-77.64h-180c-1.88,28.45,5.29,57.43,26.36,77.64Z"/>
                    <rect x="158.07" y="492.22" width="180" height="30.5"/>
                  </g>
                </svg>

              </div>
          );
        })}

        {Object.entries(rightCoords).map(([id, data]) => {
          const pt = data.coords;
          const leftPx = (pt.x / COURT_WIDTH_M) * size.width;
          const topPx = (pt.y / HALF_LENGTH_M) * size.height;
          return (
            <div
              key={`R${id}`}
              style={{
                position:       'absolute',
                left:           `${leftPx}px`,
                top:            `${topPx}px`,
                transform:      'translate(-50%, -50%)',
                pointerEvents:  'none'
              }}
              onClick={(e) => e.stopPropagation()} // pour éviter de relancer un clic terrain

            >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 638.44" fill="#ffba00" className="w-3 h-auto sm:w-3 md:w-4 lg:w-[20px]">
                  <g>
                    <path d="M188.76,358.29c-12.37-80.14-24.4-160.51-30.02-241.46-.45-7.08-.81-14.16-1.05-21.24-3.07-24.5-17.74-46.53-39.21-58.77-18.36-10.55-39.78-13.25-60.03-7.76C16.35,40.46-8.63,83.97,2.75,126.07c21.26,83.65,119.31,288.01,153.09,354.56h53.45c-3.07-17.15-11.45-64.71-20.53-122.33Z"/>
                    <path d="M493.38,126.07c24.67-106.96-132.61-140.8-154.84-33.21-1.3,48.42-10.95,127.48-18.61,181.45-7.36,54.86-26.87,172.99-33.09,206.31h53.45c14.64-29.15,124.88-250.29,153.09-354.55Z"/>
                    <path d="M275.06,480.62c12.94-72.14,46.42-272.67,51.2-371.92.54-9.68.89-20.21.9-29.68-8.79-117.78-176.88-99.84-157.42,26.86,4.54,100.17,38.01,300.54,51.35,374.74h53.98Z"/>
                    <path d="M184.43,611.96c62.29,61.36,163.73,8.03,153.64-77.64h-180c-1.88,28.45,5.29,57.43,26.36,77.64Z"/>
                    <rect x="158.07" y="492.22" width="180" height="30.5"/>
                  </g>
                </svg>
                </div>
          );
        })}
      </div>
    </>
  );
}
