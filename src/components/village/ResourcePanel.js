import React, { useEffect, useState } from 'react';

const ResourcePanel = ({resourcesFromVillageData}) => {
    const [resources, setResources] = useState(null);
    const [income, setIncome] =  useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            fetchResourcesFromVillageData()
            fetchResIncome()                 
    }, [resourcesFromVillageData]);

    useEffect(() => {
        if (!resources) return; // No Intervall, if resources are not yet loaded
        const interval = setInterval(() => {
        setResources(prevResources => {
            const updatedResources = { ...prevResources };
            resourcesFromVillageData.forEach(resource => {
            const resourceName = resource.resourceName.toLowerCase();    
            updatedResources[resourceName] += resource.resourceIncome/3600;
            });
            return updatedResources;            
        });
        }, 1000);

        return () => clearInterval(interval);
    }, [resources, resourcesFromVillageData]); //Run the interval update only when `resources` is initialized
       
    function fetchResourcesFromVillageData() {
        const initialResources = {};
        const now = new Date();
        
        resourcesFromVillageData.forEach(resource => { 
            const givenTime = new Date(resource.updateTime);
            const hoursSinceLastUpdate = (now-givenTime)/1000/3600;
            if(initialResources[resource.resourceName.toLowerCase()]){
                initialResources[resource.resourceName.toLowerCase()] = initialResources[resource.resourceName.toLowerCase()] + resource.resourceAtUpdateTime + hoursSinceLastUpdate*resource.resourceIncome;    
            } else {
            initialResources[resource.resourceName.toLowerCase()] = resource.resourceAtUpdateTime + hoursSinceLastUpdate*resource.resourceIncome;
            }
        });
        setResources(initialResources);
        setLoading(false)
    }

    function fetchResIncome() {
        const foodIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 1)?.resourceIncome ?? 'N/A';
        const woodIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 2)?.resourceIncome ?? 'N/A';
        const stoneIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 3)?.resourceIncome ?? 'N/A';
        const ironIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 4)?.resourceIncome ?? 'N/A';
        setIncome({foodIncome, woodIncome, stoneIncome, ironIncome})
    }

    if(loading || resources === null) {
        return(<div>"Loading"</div>)
    }

    return (!loading && (
        <div className="container">
            <div className="resourcePanel row pb-3 pt-3">
                <div className="col-3">
                    <div className="card">
                        <div className="resourceContainer">
                            <div className="resourceVal">
                                <div id="foodValId" style={{marginLeft: '1rem'}}>
                                    {isNaN(resources.food) ? 'N/A' : (Math.floor(resources.food))}
                                    <span className="resourceIncome">
                                        +{income.foodIncome}/h
                                    </span> 
                                </div>
                            </div>
                            <div className="resourceIcon">
                                Food
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-3">
                    <div className="card">
                        <div className="resourceContainer">
                            <div className="resourceVal">
                                <div id="woodValId" style={{marginLeft: '1rem'}}>
                                    {isNaN(resources.wood) ? 'N/A' : (Math.floor(resources.wood))}
                                    <span className="resourceIncome">
                                        +{income.woodIncome}/h
                                    </span> 
                                </div>
                            </div>
                            <div className="resourceIcon">
                                Wood
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="card">
                        <div className="resourceContainer">
                            <div className="resourceVal">
                                <div id="stoneValId" style={{marginLeft: '1rem'}}>
                                    {isNaN(resources.stone) ? 'N/A' : Math.floor(resources.stone)} 
                                    <span className="resourceIncome">
                                        +{income.stoneIncome}/h
                                    </span>      
                                </div>
                            </div>
                            <div className="resourceIcon">
                                Stone
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="card">
                        <div className="resourceContainer">
                            <div className="resourceVal">
                                <div id="ironValId" style={{marginLeft: '1rem'}}>
                                        {isNaN(resources.iron) ? 'N/A' : (Math.floor(resources.iron))}
                                        <span className="resourceIncome">
                                            +{income.ironIncome}/h
                                        </span> 
                                    </div>
                                </div>
                            <div className="resourceIcon">
                                Iron
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ))
}

export default ResourcePanel