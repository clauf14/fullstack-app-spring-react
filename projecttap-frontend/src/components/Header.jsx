"use client"
import { VscAccount } from "react-icons/vsc";
import { VscAdd } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa"


import { useState, useEffect } from "react";

export default function Header(){
    const [loginInfo, setLoginInfo] = useState([])

    useEffect(() => {
        fetchData(); // Fetch data when component mounts
    }, []);

    const fetchData = async () => {
        try {
            const storedLoginInfo = localStorage.getItem("loginInfo");
            if (storedLoginInfo) {
                setLoginInfo(JSON.parse(storedLoginInfo));
            } else {
                setLoginInfo({ id: null }); // Set loginInfo with null id if not found in localStorage
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    <svg className="h-14" fill="#4f46e5" width="64px" height="64px" viewBox="-3.2 -3.2 38.40 38.40" xmlns="http://www.w3.org/2000/svg" stroke="#4f46e5" strokeWidth="0.00032" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"><path transform="translate(-3.2, -3.2), scale(1.2)" d="M16,27.80202783478631C17.868866213491255,28.707677750957764,20.014053486817822,30.11305788403704,21.956866740444504,29.3793417562853C23.858854943292442,28.661043475882877,24.554613947488157,26.230741041525278,25.234325818604656,24.314624313435594C25.821239093986,22.660108050465464,24.95001551658828,20.750228330278414,25.596842162704455,19.11820304030108C26.30227762564664,17.33830030611203,28.801928333914386,16.52095772838945,29.07432024811733,14.625833568703081C29.332523783577823,12.829422836029718,27.637351015140087,11.35700415961071,26.954044577203224,9.675679414636562C26.177227696672222,7.764265485193857,26.54741590646206,4.9665833074466335,24.742474839538502,3.9670156906850824C22.839081814939984,2.912925856826212,20.489778402525154,5.341433556641271,18.356336121774294,4.914310133448993C16.258686627189203,4.494352564937034,15.03210852880549,1.1570899217889776,12.940062730435722,1.6041269884925864C10.846821288352722,2.0514195453287747,10.917257426867778,5.387631690852652,9.34481867397923,6.8399287454076365C7.996702864963546,8.085042181486413,5.747611156716684,8.006069315290782,4.525888628650737,9.37541871103975C3.269175082561297,10.783987265219857,2.4028084021627136,12.687899005975584,2.44351139830518,14.575155632630995C2.484052908338907,16.45492470903912,4.253903038512519,17.84189331140454,4.747615443562717,19.656121371973445C5.27028713603988,21.576765133923683,3.770330553247759,24.414158893169898,5.422954810442322,25.523614265398734C7.323827825412898,26.79972634544528,9.919276943859952,24.14842595113322,12.15743179974972,24.63054948399705C13.798902753413469,24.984140645569788,14.488953349154546,27.069776771125166,16,27.80202783478631" fill="#ffffff" strokeWidth="0"></path></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M28.908,12.571a.952.952,0,0,0-.1-.166,3.146,3.146,0,0,0-.118-.423c-.006-.016-.012-.032-.02-.048L25.917,5.6A1,1,0,0,0,25,5H7a1,1,0,0,0-.917.6l-2.77,6.381a2.841,2.841,0,0,0,0,2.083A4.75,4.75,0,0,0,6,16.609V27a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V16.609a4.749,4.749,0,0,0,2.687-2.543,2.614,2.614,0,0,0,.163-.655A1.057,1.057,0,0,0,28.908,12.571ZM13,26V20h2v6Zm4,0V20h2v6Zm7,0H21V19a1,1,0,0,0-1-1H12a1,1,0,0,0-1,1v7H8V17a5.2,5.2,0,0,0,4-1.8,5.339,5.339,0,0,0,8,0A5.2,5.2,0,0,0,24,17Zm2.837-12.7A3.015,3.015,0,0,1,24,15a2.788,2.788,0,0,1-3-2.5,1,1,0,0,0-2,0A2.788,2.788,0,0,1,16,15a2.788,2.788,0,0,1-3-2.5,1,1,0,0,0-2,0A2.788,2.788,0,0,1,8,15a3.016,3.016,0,0,1-2.838-1.7.836.836,0,0,1,0-.571L7.656,7H24.344l2.477,5.7A.858.858,0,0,1,26.837,13.3Z"></path></g></svg>


    return (
        <>
          <nav className="flex items-center justify-between bg-indigo-600 p-6 sticky top-0 z-10">
            <div className="w-full flex items-center justify-between text-white">
              <a href="/shop" className="flex items-center flex-shrink-0">
                <span className="font-semibold text-xl tracking-tight">ReTrove Market</span>
              </a>
      
              {/* Icons Section */}
              <div className="flex items-center space-x-6">
                {loginInfo && loginInfo.id !== null && loginInfo.length !== 0 && (
                  <>
                    <a href={`/favourites/${loginInfo.id}`}>
                      <button className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:bg-white hover:border-indigo-600 hover:text-indigo-600">
                        <span className="flex items-center justify-center">
                          <FaRegHeart style={{ fontSize: '1.5em' }} />
                        </span>
                      </button>
                    </a>
      
                    <a href={`/users/${loginInfo.id}`}>
                      <button className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:bg-white hover:border-indigo-600 hover:text-indigo-600">
                        <span className="flex items-center justify-center">
                          <VscAccount style={{ fontSize: '1.5em' }} />
                          <span className="hidden sm:block ml-2">My profile</span>
                        </span>
                      </button>
                    </a>
      
                    <a href="/shop/add">
                      <button className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:bg-white hover:border-indigo-600 hover:text-indigo-600">
                        <span className="flex items-center justify-center">
                          <VscAdd style={{ fontSize: '1.5em' }} />
                          <span className="hidden sm:block ml-2">Add product</span>
                        </span>
                      </button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </nav>
        </>
      );
      
          
}