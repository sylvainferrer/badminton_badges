import Image from "next/image";
import * as d3 from "d3";
import Badminton_court from "@/components/Badminton_court";

export default function Home() {
    
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
                Découvrez des insights avancés sur les performances au badminton grâce à notre technologie d'analyse vidéo et de suivi des données.
            </p>
        </div>
    </div>
    <div className="py-20 px-10 bg-[#2196f3]">
       <Badminton_court/>
    </div>
    </div>
  );
}
