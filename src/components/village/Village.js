
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './village.scss';
import ResourcePanel  from './ResourcePanel';

const Village = () => {
    const { villageId } = useParams();
    const [villageData, setVillageData] = useState({ resources: [], buildings: [], timestampNow: '' });
    const [resources, setResources] = useState({});
    const [buildingsJsonData, setBuildingsJsonData] = useState(null); 

    const [activeBuildingId, setActiveBuildingId] = useState(null);
    const [buildingTimer, setBuildingTimer] = useState({ time: 0, buildingTypeId: null });
    const [isBuildingTimerActive, setIsBuildingTimerActive] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVillageData()
        fetchBuildingTimer()
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
        setResources(prevResources => {
            const updatedResources = { ...prevResources };
            villageData.resources.forEach(resource => {
            const resourceName = resource.resourceName.toLowerCase();    
            updatedResources[resourceName] += resource.resourceIncome/3600;
            });
            return updatedResources;
        });
        }, 1000);

        return () => clearInterval(interval);
    }, [villageData.resources]);

    useEffect(() => {
        if (isBuildingTimerActive && buildingTimer.time >= 0) {
            const interval = setInterval(() => {
                setBuildingTimer(prevState => {
                    console.log("PRV.time", prevState.time)
                    if (prevState.time > 0) {
                        return { ...prevState, time: prevState.time - 1 };
                    } else {
                        console.log("TEST")
                        clearInterval(interval); 
                        increaseBuildingLvl(buildingTimer.buildingTypeId); 
                        setIsBuildingTimerActive(false);
                        setActiveBuildingId(null);
                        return { ...prevState, time: 0 };
                    }
                });
            }, 1000);
    
            return () => clearInterval(interval);
        }
    }, [isBuildingTimerActive, buildingTimer]);

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
            const initialResources = {};
            const now = new Date();
            data.resources.forEach(resource => {
                const givenTime = new Date(resource.updateTime);
                const hoursSinceLastUpdate = (now-givenTime)/1000/3600;       
                initialResources[resource.resourceName.toLowerCase()] = resource.resourceAtUpdateTime + hoursSinceLastUpdate*resource.resourceIncome;
            }, [villageId]);
            setResources(initialResources);
            
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching village data:', error);
            setError(error);
            setLoading(false);
        });
    }

    function fetchBuildingTimer() {
        fetch(`http://localhost:8080/timer/${villageId}/buildings`)
        .then(response => response.json())
        .then(data => {
            const buildingTypeId = data['timer'][0]['objectTypeId']
            const updateTimeFromResponse =  data['timer'][0]['updateTime']
            const diffTimes = Math.floor((new Date(updateTimeFromResponse) - new Date())/ 1000)
            if(diffTimes > 0) {
                setActiveBuildingId(buildingTypeId)
                setBuildingTimer({time: diffTimes, buildingTypeId: buildingTypeId})
                setIsBuildingTimerActive(true)
            }
        })
        .catch(error => {
            console.error('Error fetching building timer:', error);
            setError(error);
            setLoading(false);
        });
    }
   
    function initiateBuildingUpgrade(buildingTypeId, buildingLevel) {
        
        const formData = new FormData();
        formData.append('buildingTypeId', buildingTypeId);
        formData.append('villageId', villageId);
        fetch('http://localhost:8080/village/initiateBuildingUpgrade', {
            method: 'POST',
            body: formData
        })

        .then(response => {
            fetchVillageData()
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

    function increaseBuildingLvl(buildingTypeId) {
        const formData = new FormData();
        formData.append('buildingTypeId', buildingTypeId);
        formData.append('villageId', villageId);
        fetch('http://localhost:8080/village/increaseBuildingLvl', {
            method: 'POST',
            body: formData
        })

        .then(() => {
            console.log("Building Updated")
            fetchVillageData()
        })
        .catch(error => {
            console.error('Building Update Error:', error);
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
                <ResourcePanel currentResources={resources} resourcesFromVillageData={villageData.resources}/>
                <div className="container">
                    <div className="row align-items-start pb-3">
                        {villageData.buildings.map((building, index) => (   
                            <div className="col-4 pb-4" key={index}>
                                <div className="card text-center">
                                    <div className="building">
                                        <h5 className="building-title">
                                            {building.buildingName}
                                        </h5>
                                        <div className="building-body">
                                            <div className="building">
                                                <p className="building-outcome">ToDo: Outcome</p>
                                                <p className="building-level">Level: {building.buildingLevel}</p>
                                                <p className="building-update-costs">ToDo: Update Costs</p>
                                                <button onClick={()  => initiateBuildingUpgrade(building.buildingTypeId,building.buildingLevel)}
                                                     disabled={isBuildingTimerActive && buildingTimer.time >= 0}>
                                                    {activeBuildingId === building.buildingTypeId  && isBuildingTimerActive && buildingTimer.time >= 0 ? `${buildingTimer.time}s` : "Increase Level"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}         
                    </div>
                    <p>Current Timestamp: {villageData.timestampNow}</p>
                </div>
            </div>
        </div>
    );
    };

export default Village;