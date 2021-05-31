import React from 'react'
import {useHistory} from 'react-router-dom'

const NotFound = () => {

    const history = useHistory()

    return <main id="DiscountScreen" className="pt-4">
        <section>
            <div className="container-xxl">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-md-9">
                        <div id="form-card" className="card mb-4">
                            <div className="card-header mt-1">
                                <h3><i className="bi bi-file-earmark-text me-3"/>Błąd 404:</h3>
                            </div>

                            <div className="card-body">
                                <h4>Podana strona nie istnieje.</h4>
                            </div>

                            <div className="card-footer">
                                <button onClick={() => history.goBack()} id="button-ok" className="btn btn-secondary my-2">Zawróć jeśli możesz!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
}

export default NotFound
