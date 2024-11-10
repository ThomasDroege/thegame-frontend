import './building.scss';

const Building = ({ building, index, initiateBuildingUpgrade, isBuildingTimerActive, 
    activeBuildingId, buildingTimer }) => {
        
    function getCurrentBuildingLvl() {
        if(new Date() > new Date(building.updateTime)) {
            return building.buildingLevel
        } else {
            return building.buildingLevel - 1;
        }
    }

    return(
        <div className="col-4 pb-4" key={index}>
            <div className="card text-center">
                <div className="building">
                    <h5 className="building-title">
                        {building.buildingName}
                    </h5>
                    <div className="building-body">
                        <div className="building">
                            <p className="building-outcome">ToDo: Outcome</p>
                            <p className="building-level">Level: {getCurrentBuildingLvl()}</p>
                            <p className="building-update-costs">ToDo: Update Costs</p>
                            <button type="button" className="primary-button building-inncrease-button" onClick={()  => initiateBuildingUpgrade(building.buildingTypeId,building.buildingLevel)}
                                    disabled={isBuildingTimerActive && buildingTimer.time >= 0}>
                                {activeBuildingId === building.buildingTypeId  && isBuildingTimerActive && buildingTimer.time >= 0 ? `${buildingTimer.time}s` : "Increase Level"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Building