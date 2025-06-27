"use client"
import Image from "next/image"
import { useState } from 'react'
import Badminton_court_2 from "@/components/Badminton_court_2"

export default function Home() {

    const [leftCoords,  setLeftCoords]  = useState([]);
    const [rightCoords, setRightCoords] = useState([]);

return (
    <div>
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
            <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
            <Image src="../volant.svg" width={50} height={50} alt="Badminton Icon" />
            <span className="text-xl font-bold text-gray-900">Badminton Analytics</span>
            </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <a href="#" className="text-indigo-600 px-3 py-2 text-sm font-medium">Accueil</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Analyses</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Élèves</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 px-3 py-2 text-sm font-medium">Rapports</a>
            <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Connexion
            </button>
            </div>
            <div className="-mr-2 flex items-center md:hidden">
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-controls="mobile-menu" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <i className="fas fa-bars"></i>
            </button>
            </div>
            </div>
            </div>
        </nav>
    <div>
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-indigo-600 sm:text-5xl lg:text-6xl">
                            Analysez le jeu de vos élèves avec précision
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-xl text-indigo-300">
                            {`Découvrez des insights avancés sur les performances au badminton grâce à notre technologie d'analyse et de suivi des données.`}
                    </p>
            </div>
    </div>
    <div className="pt-8 bg-indigo-600">
        <div className="px-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Coordonnées des clics</h2>
            <p className=" text-white">Cliquez sur le terrain pour ajouter des points.</p>
            <p className=" text-white">Les points jaunes représentent les clics sur le côté gauche, et les points rouges représentent les clics sur le côté droit.</p>
        </div>
        <div className="px-8 text-white mt-6">
            <strong>Coordonnées (format JSON):</strong><br />
            <strong>leftCoords:</strong> {JSON.stringify(leftCoords)}<br />
            <strong>rightCoords:</strong> {JSON.stringify(rightCoords)}<br />
        </div>
        <div className="flex justify-between px-8 text-white mt-6">
            <p><strong>Gauche :</strong> {Object.keys(leftCoords).length} points</p>
            <p><strong>Droite :</strong> {Object.keys(rightCoords).length} points</p>
        </div>

        <div className="p-8">
            <Badminton_court_2 
                leftCoords={leftCoords}
                setLeftCoords={setLeftCoords}
                rightCoords={rightCoords}
                setRightCoords={setRightCoords}
            />
        </div>
    </div>
</div>
);
}

