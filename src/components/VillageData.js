
import React, { useEffect, useState } from 'react';

const VillageData = () => {
 const [data, setData] = useState({ resources: [], buildings: [], timestampNow: '' });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/village/data')
    .then(response => response.json())
    .then(data => {
        setData(data);
        console.log(data)
        setLoading(false);
    })
    .catch(error => {
        console.error('Error fetching village data:', error);
        setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // MVP: Die Resourcen müssen noch mit Script berechnet werden
  return (
    <div>
    <h1>Village</h1>
    <h2>Resources</h2>
    <ul>
        {data.resources.map(resource => (
            <li key={resource.resourceId}>{resource.resourceName}: {resource.resourceAtUpdateTime}</li>
        ))}
    </ul>
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