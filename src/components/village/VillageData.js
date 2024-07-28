
import React, { useEffect, useState } from 'react';
import './village.scss';

const VillageData = () => {
    const [data, setData] = useState({ resources: [], buildings: [], timestampNow: '' });
    const [resources, setResources] = useState({});
    const [buildingsdata, setBuildingsData] = useState(null); 


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/village/data')
        .then(response => response.json())
        .then(data => {
            setData(data);
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
            setError(error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        console.log(data)
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
                setBuildingsData(data);
            })
            .catch(error => console.error('Error loading the buildings.json file:', error));
    }, []);

    if (loading && !buildingsdata) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="village">
                <div className="container">
                    <div className="resourcePanel row pb-3 pt-3">
                        <div className="col-3">
                            <div className="card">
                                <div className="row">
                                    <div className="col-6 resourceVal">
                                        <div id="foodValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.food*100)/100}</div>
                                    </div>
                                    <div className="col-6 resourceIcon">
                                        Food
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-3">
                            <div className="card">
                                <div className="row">
                                    <div className="col-6 resourceVal">
                                        <div id="woodValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.wood*100)/100}</div>
                                    </div>
                                    <div className="col-6 resourceIcon">
                                        Wood
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card">
                                <div className="row">
                                    <div className="col-6 resourceVal">
                                        <div id="stoneValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.stone*100)/100}</div>
                                    </div>
                                    <div className="col-6 resourceIcon">
                                        Stone
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="card">
                                <div className="row">
                                    <div className="col-6 resourceVal">
                                        <div id="ironValId" style={{marginLeft: '1rem'}}>{Math.floor(resources.iron*100)/100}</div>
                                    </div>
                                    <div className="col-6 resourceIcon">
                                        Iron
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row align-items-start pb-3">
                        {data.buildings.map((building, index) => (   
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