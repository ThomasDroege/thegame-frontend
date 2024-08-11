const ResourcePanel = ({currentResources, resourcesFromVillageData}) => {
    if(!resourcesFromVillageData?.length) {
        return(<div>"Loading"</div>)
    }

    const foodIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 1)?.resourceIncome ?? 'N/A';
    const woodIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 2)?.resourceIncome ?? 'N/A';
    const stoneIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 3)?.resourceIncome ?? 'N/A';
    const ironIncome = resourcesFromVillageData.find(res => res.resourceTypeId === 4)?.resourceIncome ?? 'N/A';

    return(
        <div className="container">
            <div className="resourcePanel row pb-3 pt-3">
                <div className="col-3">
                    <div className="card">
                        <div className="resourceContainer">
                            <div className="resourceVal">
                                <div id="foodValId" style={{marginLeft: '1rem'}}>
                                    {isNaN(currentResources.food) ? 'N/A' : (Math.floor(currentResources.food))}
                                    <span className="resourceIncome">
                                        +{foodIncome}/h
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
                                <div id="foodValId" style={{marginLeft: '1rem'}}>
                                    {isNaN(currentResources.wood) ? 'N/A' : (Math.floor(currentResources.wood))}
                                    <span className="resourceIncome">
                                        +{woodIncome}/h
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
                                    {isNaN(currentResources.food) ? 'N/A' : Math.floor(currentResources.stone)} 
                                    <span className="resourceIncome">
                                        +{stoneIncome}/h
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
                                <div id="foodValId" style={{marginLeft: '1rem'}}>
                                        {isNaN(currentResources.iron) ? 'N/A' : (Math.floor(currentResources.iron))}
                                        <span className="resourceIncome">
                                            +{ironIncome}/h
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
    )
}

export default ResourcePanel