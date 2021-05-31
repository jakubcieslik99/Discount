import React from 'react'

const RulesScreen = () => {
    return <main id="RulesScreen" className="pt-4">
        <section>
            <div className="container-xxl">
                <div className="row d-flex justify-content-center">
                    <div className="col-12 col-md-9">
                        <div id="form-card" className="card mb-4">
                            <div className="card-header mt-1">
                                <h3><i className="bi bi-file-earmark-text me-3"/>Regulamin serwisu Discount:</h3>
                            </div>
                            <div className="card-body">
                                <h5 className="fw-bold">I. Postanowienia wstępne:</h5>
                                <p>
                                    Poprzez rejestrację użytkownik zobowiązuje się do przestrzegania regulaminu Discount. Dotyczy to całego serwisu, włączając w to dodawane okazje, kupony, komentarze itd.
                                </p>
                                <h5 className="fw-bold">II. Konto użytkownika i nick:</h5>
                                <p>
                                    Każdy użytkownik to realna osoba, dlatego prosimy o respektowanie opinii i poglądów innych osób korzystających z serwisu.
                                    <ul>
                                        <li>
                                            Nowy użytkownik wybiera nick, który nie jest obraźliwy. Jeśli ten zostanie za taki uznany, konto może zostać usunięte bez ostrzeżenia i możliwości jego odzyskania.
                                        </li>
                                        <li>
                                            Konto użytkownika wybierającego nick mający na celu podszycie się pod inną osobę lub instytucję zostanie usunięte bez ostrzeżenia i możliwości jego odzyskania.
                                        </li>
                                        <li>
                                            Multikonta tworzone bez porozumienia z administracją strony zostaną usunięte bez ostrzeżenia i możliwości ich odzyskania.
                                        </li>
                                        <li>
                                            Konta zawierające personalne lub prywatne dane osób trzecich mogą zostać usunięte bez ostrzeżenia i możliwości ich odzyskania.
                                        </li>
                                        <li>
                                            Konta utworzone w serwisie Discount nie mogą być sprzedawane ani użyczane osobom trzecim.
                                        </li>
                                    </ul>
                                </p>
                                <h5 className="fw-bold">III. Spam:</h5>
                                <p>
                                    Serwis Discount nie toleruje jakiejkolwiek aktywności spamerskiej. Wszystko co zostanie za taką uznane zostaje usunięte.
                                    Za spam uznajemy:
                                    <ul>
                                        <li>Powtarzające się nowe oferty i kupony oraz dane w nich zawarte.</li>
                                        <li>Nieuzasadnione lub nie mające logicznego sensu oferty i kupony oraz dane w nich zawarte.</li>
                                        <li>Autopromocja oraz rekomendacja przy czerpaniu z tego tytułu korzyści w jakimkolwiek wydaniu.</li>
                                        <li>Powtarzające się pytania w komentarzach.</li>
                                        <li>Puste lub nie mające logicznego sensu komentarze.</li>
                                        <li>Oferty niezawierające bezpośredniego linku do strony z okazją.</li>
                                        <li>Pornografia, zdjęcia pornograficzne i seksualnie obraźliwy materiał.</li>
                                        <li>Aktywność o charakterze politycznym lub religijnym.</li>
                                        <li>Nieuzasadnione dodawanie i usuwanie ofert oraz komentarzy.</li>
                                        <li>Obraźliwe treści i przekleństwa.</li>
                                        <li>Materiały naruszające obowiązujące prawo.</li>
                                        <li>Materiały niebędące okazjami oraz oferty od prywatnych sprzedawców.</li>
                                        <li>Produkty spożywcze mające krótki termin przydatności do spożycia.</li>
                                    </ul>
                                </p>
                                <h5 className="fw-bold">IV. Trolling:</h5>
                                <p>
                                    Administracja serwisu Discount nie toleruje trolli:
                                    <ul>
                                        <li>
                                            Troll to użytkownik, który bez przyczyny zakłóca prawidłowe funkcjonowanie obszarów serwisu poprzez publikowanie treści niezwiązanych tematycznie, rzucając obelgami, atakując innych użytkowników i celowo stwarzając kłótnie oraz negatywną atmosferę.
                                        </li>
                                        <li>
                                            Okazje, komentarze i konta użytkowników nieustannie atakujących innych użytkowników z powodu ich poglądów i opinii oraz mających na celu poniżanie będą usuwane.
                                        </li>
                                    </ul>
                                </p>
                                <h5 className="fw-bold">V. Nietolerancja i wulgaryzmy:</h5>
                                <p>
                                    Ataki na użytkowników z powodu ich poglądów, wiary, rasy czy preferencji seksualnych, a także wszelkiego rodzaju przejawy wulgarności nie są tolerowane.
                                    <ul>
                                        <li>
                                            Każdy przejaw nietolerancji ww. skutkuje usunięciem wszystkiego co z nim związane z serwisu oraz usunięciem konta użytkownika za nią odpowiedzialnego. 
                                        </li>
                                        <li>
                                            Nieuprzejme i prowokacyjne zachowania w komentarzach lub okazjach będą usuwane wraz z kontami użytkowników za nie odpowiedzialnych.
                                        </li>
                                        <li>
                                            Pisanie obraźliwych słów nie jest dozwolone i poskutkuje usunięciem źródła, a także może przyczynić się do usunięcia konta.
                                        </li>
                                    </ul>
                                </p>
                                <h5 className="fw-bold">VI. Ocenianie okazji:</h5>
                                <p>
                                    Oddając głosy na wybrane okazje, powinne one być rzetelne, a najlepiej poparte opinią w komentarzu. Pozwala to na poprawę jakości publikowanych okazji w serwisie Discount.
                                </p>
                                <h5 className="fw-bold">VII. Administracja:</h5>
                                <p>
                                    Administratorzy serwisu Discount czuwają nad przestrzeganiem powyższego regulaminu i podejmą odpowiednie kroki w przypadku złamania któregoś z ww. postanowień.
                                </p>
                                <h5 className="fw-bold">VIII. Postanowienia końcowe:</h5>
                                <p className="d-block">
                                    <div>
                                        Zasady regulaminu serwisu Discount mogą być zmienione lub aktualizowane w dowolnym momencie. W razie wątpliwości prosimy o ich regularne sprawdzanie.
                                    </div>
                                    <div className="mt-3 d-flex justify-content-end fst-italic">Życzymy udanych łowów okazji! ~ Grupa Discount</div>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
}

export default RulesScreen
