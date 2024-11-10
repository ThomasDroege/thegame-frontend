import './building.scss';

const Building = ({ building, index, initiateBuildingUpgrade, isBuildingTimerActive, 
    activeBuildingId, buildingTimer }) => {
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
                            <p className="building-level">Level: {building.buildingLevel}</p>
                            <p className="building-update-costs">ToDo: Update Costs</p>
                            <button type="button" className="primary-button" onClick={()  => initiateBuildingUpgrade(building.buildingTypeId,building.buildingLevel)}
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