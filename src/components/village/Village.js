
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './village.scss';
import ResourcePanel  from './ResourcePanel';
import Building from './buildings/Building';

const Village = () => {
    const { villageId } = useParams();
    const [villageData, setVillageData] = useState({ resources: [], buildings: [], timestampNow: '' });
    const [buildingsJsonData, setBuildingsJsonData] = useState(null);     

    // will be needed for showing the actual increasing building (increase button)
    const [activeBuildingId, setActiveBuildingId] = useState(null);
    const [buildingTimer, setBuildingTimer] = useState({ time: 0, buildingTypeId: null });
    const [isBuildingTimerActive, setIsBuildingTimerActive] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVillageData()
    }, []);

    //TODO: auslagern in Building.js
    useEffect(() => {
        if (isBuildingTimerActive && buildingTimer.time >= 0) {
            const interval = setInterval(() => {
                setBuildingTimer(prevState => {
                    if (prevState.time > 0) {
                        return { ...prevState, time: prevState.time - 1 };
                    } else {
                        clearInterval(interval);                         
                        setIsBuildingTimerActive(false);
                        setActiveBuildingId(null);
                        return { ...prevState, time: 0 };
                    }
                });
            }, 1000);
    
            return () => clearInterval(interval);
        } else {
            fetchVillageData() // for updating resIncome and buildingLevel after hitting the buildingLevel
        }
    }, [isBuildingTimerActive, buildingTimer]);

    //TODO: auslagern in Building.js
    useEffect(() => {
        fetch('/buildings.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setBuildingsJsonData(data);
            })
            .catch(error => console.error('Error loading the buildings.json file:', error));
    }, []);

    function fetchVillageData() {
        fetch(`http://localhost:8080/village/${villageId}/data`)
        .then(response => response.json())
        .then(data => {
            setVillageData(data);
            console.log("VILLAGE DATA:", data)
            const now = new Date();

            //TODO Funktion auslagern in Building.js
            // Set BuildingTimer for active Building Level Increasing
            data.buildings.forEach(building => {
                const givenTime = new Date(building.updateTime);
                const secondsTillNextUpdate = Math.floor((givenTime -now)/1000);

                if(secondsTillNextUpdate > 0) {
                    setBuildingTimer(prevState => ({ ...prevState, time: secondsTillNextUpdate, buildingTypeId: building.buildingTypeId }));
                    setActiveBuildingId(building.buildingTypeId)
                    setIsBuildingTimerActive(true)
                } 
            })

            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching village data:', error);
            setError(error);
            setLoading(false);
        });
    }
 
    //TODO: Funktion auslagern in Building.js
    function initiateBuildingUpgrade(buildingTypeId, buildingLevel) {
        
        const formData = new FormData();
        formData.append('buildingTypeId', buildingTypeId);
        formData.append('villageId', villageId);
        fetch('http://localhost:8080/village/initiateBuildingUpgrade', {
            method: 'POST',
            body: formData
        })

        .then(response => {
           // fetchVillageData()
            setActiveBuildingId(buildingTypeId)
            setBuildingTimer({time: buildingsJsonData[buildingTypeId]["levels"][buildingLevel + 1]["buildingtime"], buildingTypeId: buildingTypeId})
            setIsBuildingTimerActive(true)
        })
        .catch(error => {
            //ToDo: es sollte noch abgefangen werden, wenn das Max Level erreicht ist. Max Level ist damit definiert, dass in der Buildings.json kein weiteres Level definiert ist.
            // Disablen des Buttons und es sollte auch ein 500er abgefangen werden, wenn der RestEndpunkt aufgerufen wird und das Level nicht definiert ist (Conflict: Max Level reached)
            console.error('Error while initiating Building Upgrade:', error);
        });
    }

    if (loading && !buildingsJsonData) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (      
        <div>
            <div className="village">
               <ResourcePanel resourcesFromVillageData={villageData.resources} />
                <div className="container">
                    <div className="row align-items-start pb-3">
                        {villageData.buildings.map((building, index) => (
                            <Building key={index} building={building} initiateBuildingUpgrade={initiateBuildingUpgrade} 
                            isBuildingTimerActive={isBuildingTimerActive} activeBuildingId={activeBuildingId} buildingTimer={buildingTimer}/>))
                        }         
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Village;