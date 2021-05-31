import React from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {
    return <footer className="pt-4 pb-4">
        <div className="container-xxl text-center text-md-left">
            <div className="row text-center text-md-left">

                <div className="col-12 col-md-2 mx-auto mt-3">
                    <h5 className="mb-4 text-uppercase fw-bold">Regulamin:</h5>
                    <p>
                        Zapoznaj się z <Link to="/rules" style={{color: 'inherit', fontWeight: '600'}}>regulaminem</Link> przed korzystaniem z aplikacji Discount.
                    </p>
                </div>


                <div className="col-12 col-md-7 mx-auto mt-3">
                    <h5 className="mb-4 text-uppercase fw-bold">O nas:</h5>
                    <p>
                        Discount to aplikacja internetowa pozwalająca na gromadzenie ofert, promocji oraz kuponów, które można wykorzystywać podczas zakupów w przeróżnych sklepach. Każdy może dodać nową promocję lub kupon, a także skorzystać z tych już dodanych przez innych użytkowników i ocenić je! Nie masz konta? Załóż je i zostań łowcą okazji z Discount - z myślą o Twoim portfelu!
                    </p>
                </div>

                <div className="col-12 col-md-3 mx-auto mt-3">
                    <h5 className="mb-4 text-uppercase fw-bold">Kontakt:</h5>
                    <p>
                        <i className="bi bi-house-door me-1"/> ul. Przykładowa 1/1, Przykładowice
                    </p>
                    <p>
                        <i className="bi bi-envelope me-1"/> contactdiscountapp@gmail.com
                    </p>
                    <p>
                        <i className="bi bi-telephone me-1"/> +48789461361
                    </p>
                </div>

                <hr className="mb-4"/>

                <div className="row align-items-center">
                    <p>Copyright © 2021 &nbsp;|&nbsp; Discount &nbsp;|&nbsp; Wszelkie prawa zastrzeżone.</p>
                </div>
            </div>
        </div>
    </footer>
}

export default Footer
