"use client";
import Image from "next/image";
import { useState } from "react";
import Badminton_court_2 from "@/components/Badminton_court_2";

export default function Home() {
  const [leftCoords, setLeftCoords] = useState({});
  const [rightCoords, setRightCoords] = useState({});

  const [stats, setStats] = useState({
    joueurA: { nom: "Joueur A", stats: {} },
    joueurB: { nom: "Joueur B", stats: {} },
  });

  return (
    <div>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="../volant.svg"
                  width={50}
                  height={50}
                  alt="Badminton Icon"
                />
                <span className="text-xl font-bold text-slate-800">
                  Badminton Analytics
                </span>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
              <a
                href="#"
                className="text-slate-800 px-3 py-2 text-sm font-medium"
              >
                Accueil
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-slate-600 px-3 py-2 text-sm font-medium"
              >
                Analyses
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-slate-600 px-3 py-2 text-sm font-medium"
              >
                Élèves
              </a>
              <a
                href="#"
                className="text-slate-800 hover:text-slate-600 px-3 py-2 text-sm font-medium"
              >
                Rapports
              </a>
              <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-800 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600">
                Connexion
              </button>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-800 hover:text-slate-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl lg:text-6xl">
            Analysez le jeu de vos élèves avec précision
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-800">
            {`Découvrez des insights avancés sur les performances au badminton grâce à notre technologie d'analyse et de suivi des données.`}
          </p>
        </div>
      </div>
      <div className="pt-8 pb-16 bg-slate-800">
        <div className="px-8">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Coordonnées des clics
          </h2>
          <p className=" text-white">
            Cliquez sur le terrain pour ajouter des points.
          </p>
        </div>

        <div className="px-8 text-white mt-6">
          <strong>Données par joueur :</strong>
          <br />
          {JSON.stringify(stats, null, 2)}
        </div>

        {console.log("leftCoords:", leftCoords)}
        {console.log("rightCoords:", rightCoords)}

        <div className="p-8">
          <Badminton_court_2
            leftCoords={leftCoords}
            rightCoords={rightCoords}
            setLeftCoords={setLeftCoords}
            setRightCoords={setRightCoords}
            stats={stats}
            setStats={setStats}
          />
        </div>
      </div>
      <div className="pt-8 pb-16">
        <div className="px-8">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">
            Statistiques des joueurs
          </h2>
          </div>  
      </div>
    </div>
  );
}
