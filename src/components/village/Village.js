
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './village.scss';
import ResourcePanel  from './ResourcePanel';

const Village = () => {
    const { villageId } = useParams();
    const [villageData, setVillageData] = useState({ resources: [], buildings: [], timestampNow: '' });
    const [resources, setResources] = useState({});
    const [buildingsJsonData, setBuildingsJsonData] = useState(null); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVillageData()
    }, []);

    useEffect(() => {
        console.log(villageData)
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
        fetch('/buildings.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log("respose", data)
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
   
    function increaseBuildingLvl(buildingTypeId) {
        console.log("villageData", villageData)
        const formData = new FormData();
        formData.append('buildingTypeId', buildingTypeId);
        formData.append('villageId', villageId);
        fetch('http://localhost:8080/village/increaseBuildingLevel', {
            method: 'POST',
            body: formData
        })

        .then(response => {
            console.log("Success: ", response)
            fetchVillageData()
        })
        .catch(error => {
            //ToDo: es sollte noch abgefangen werden, wenn das Max Level erreicht ist. Max Level ist damit definiert, dass in der Buildings.json kein weiteres Level definiert ist.
            // Disablen des Buttons und es sollte auch ein 500er abgefangen werden, wenn der RestEndpunkt aufgerufen wird und das Level nicht definiert ist (Conflict: Max Level reached)
            console.error('Error:', error);
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
                <ResourcePanel resources={resources}/>
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
                                                <button onClick={()  => increaseBuildingLvl(building.buildingTypeId)}>Increase Level</button>
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