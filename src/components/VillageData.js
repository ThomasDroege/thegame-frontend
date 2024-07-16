
import React, { useEffect, useState } from 'react';

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
    <h1>Village</h1>
    <h2>Resources</h2>
    <div>
    <ul>
        <li>Stone: {Math.floor(resources.stone*100)/100} </li>
        <li>Food: {Math.floor(resources.food*100)/100}  </li>
        <li>Wood: {Math.floor(resources.wood*100)/100}  </li>
        <li>Iron: {Math.floor(resources.iron*100)/100}  </li>
    </ul>

    </div>
    
    <h2>Buildings</h2>
    <ul>
        {
        data.buildings.map(building => (
            <li key={building.buildingId}>{building.buildingName}: Level {building.buildingLevel}</li>
        ))}
    </ul>
    <p>Current Timestamp: {data.timestampNow}</p>
</div>
  );
};

export default VillageData;