const ResourcePanel = ({resources}) => {
    return(
        <div className="container">
            <div className="resourcePanel row pb-3 pt-3">
                <div className="col-3">
                    <div className="card">
                        <div className="row">
                            <div className="col-6 resourceVal">
                                <div id="foodValId" style={{marginLeft: '1rem'}}>{isNaN(resources.food) ? 'N/A' : (Math.floor(resources.food*100) / 100)}</div>
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
                                <div id="woodValId" style={{marginLeft: '1rem'}}>{isNaN(resources.food) ? 'N/A' : (Math.floor(resources.wood*100) / 100)}</div>
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
                                <div id="stoneValId" style={{marginLeft: '1rem'}}>{isNaN(resources.food) ? 'N/A' : (Math.floor(resources.stone*100) / 100)}</div>
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
                                <div id="ironValId" style={{marginLeft: '1rem'}}>{isNaN(resources.food) ? 'N/A' : (Math.floor(resources.iron*100) / 100)}</div>
                            </div>
                            <div className="col-6 resourceIcon">
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