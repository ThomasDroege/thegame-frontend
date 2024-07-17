
import React, { useEffect, useState } from 'react';
import './village.scss';

const VillageData = () => {
 const [data, setData] = useState({ resources: [], buildings: [], timestampNow: '' });
 const [resources, setResources] = useState({});


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/village/data')
    .then(response => response.json())
    .then(data => {
        setData(data);
        // Initialisieren der Ressourcen mit ihren Anfangswerten
        const initialResources = {};
        const now = new Date();
        data.resources.forEach(resource => {
            const givenTime = new Date(resource.updateTime);
            const hoursSinceLastUpdate = (now-givenTime)/1000/3600;       
            initialResources[resource.resourceName.toLowerCase()] = resource.resourceAtUpdateTime + hoursSinceLastUpdate*resource.resourceIncome;
        });
        setResources(initialResources);
        
        setLoading(false);
    })
    .catch(error => {
        console.error('Error fetching village data:', error);
        setLoading(false);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prevResources => {
        const updatedResources = { ...prevResources };
        data.resources.forEach(resource => {
          const resourceName = resource.resourceName.toLowerCase();    
          updatedResources[resourceName] += resource.resourceIncome/3600;
        });
        return updatedResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data.resources]);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
        <div class="village">
            <div class="container">
                <div class="resourcePanel row pb-3 pt-3">
                    <div class="col-3">
                        <div class="card">
                            <div class="row">
                                <div class="col-6 resourceVal">
                                    <div id="foodValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.food*100)/100}</div>
                                </div>
                                <div class="col-6 resourceIcon">
                                    Food
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="col-3">
                        <div class="card">
                            <div class="row">
                                <div class="col-6 resourceVal">
                                    <div id="woodValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.wood*100)/100}</div>
                                </div>
                                <div class="col-6 resourceIcon">
                                    Wood
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="card">
                            <div class="row">
                                <div class="col-6 resourceVal">
                                    <div id="stoneValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.stone*100)/100}</div>
                                </div>
                                <div class="col-6 resourceIcon">
                                    Stone
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="card">
                            <div class="row">
                                <div class="col-6 resourceVal">
                                    <div id="ironValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.iron*100)/100}</div>
                                </div>
                                <div class="col-6 resourceIcon">
                                    Iron
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row align-items-start pb-3">
                    {data.buildings.map(building => (   
                        <div class="col-4 pb-4">
                            <div class="card text-center">
                                <div class="building">
                                    <h5 class="building-title">
                                        {building.buildingName}
                                    </h5>
                                    <div class="building-body">
                                        <div class="building">
                                            <p class="building-outcome">ToDo: Outcome</p>
                                            <p class="building-level">Level: {building.buildingLevel}</p>
                                            <p class="building-update-costs">ToDo: Update Costs</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}         
                </div>
                <p>Current Timestamp: {data.timestampNow}</p>
            </div>
        </div>
    </div>
  );
};

export default VillageData;