import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import queryString from 'query-string'
import {listDiscountsAction, listDiscountsErrorReset} from '../actions/discountActions'
import Error from '../components/Error'
import Info from '../components/Info'
import DiscountElement from '../components/DiscountElement'
import Paginator from '../components/Paginator'

const HomeScreen = props => {
    const {loading, discounts, parameters, error: error_listDiscounts} = useSelector(state => state.listDiscounts)
    const {message, error: error_discountRate} = useSelector(state => state.discountRate)

    const [searchKeyword, setSearchKeyword] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    const params = queryString.parse(props.location.search)

    useEffect(() => {
        if(error_listDiscounts) dispatch(listDiscountsErrorReset())

        let data = {
            category: '',
            searchKeyword: '',
            sortOrder: '',
            page: 1
        }
        if(params.category && params.category!=='undefined') data.category = params.category
        if(params.searchKeyword && params.searchKeyword!=='undefined') data.searchKeyword = params.searchKeyword
        else setSearchKeyword('')
        if(params.sortOrder && params.sortOrder!=='undefined') data.sortOrder = params.sortOrder
        if(params.page && params.page!=='undefined') data.page = parseInt(params.page)

        if(!message || message!=='refresh') dispatch(listDiscountsAction(data.category, data.searchKeyword, data.sortOrder, data.page))

        return () => {}
    }, [message, dispatch, props.location.search, props.history]) // eslint-disable-line react-hooks/exhaustive-deps

    const categoryHandler = event => {
        history.push('/?category=' + event.target.value + '&searchKeyword=' + (params.searchKeyword ? params.searchKeyword : '') + '&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }
    
    const searchHandler = event => {
        event.preventDefault()
        history.push('/?category=' + (params.category ? params.category : '') + '&searchKeyword=' + searchKeyword + '&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }
    const searchHandlerEnter = event => {
        event.key==='Enter' && history.push('/?category=' + (params.category ? params.category : '') + '&searchKeyword=' + searchKeyword + '&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }

    const clearSearchHandler = event => {
        event.preventDefault()
        setSearchKeyword('')
        history.push('/?category=' + (params.category ? params.category : '') + '&searchKeyword=&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }

    const sortHandler = event => {
        history.push('/?category=' + (params.category ? params.category : '') + '&searchKeyword=' + (params.searchKeyword ? params.searchKeyword : '') + '&sortOrder=' + event.target.value)
    }

    return <>
        <header>
            <nav id="navbar-2" className="navbar">
                <div className="container-xxl my-1 my-md-0">
                    <div className="row">
                        <div className="col-12 col-md-3 offset-md-1">
                            <select onChange={categoryHandler} value={params.category} className="form-select">
                                <option value="">{params.category ? 'Wyczyść kategorię' : 'Wybierz kategorię'}</option>
                                <option value="artykuly_spozywcze">Artykuły spożywcze</option>
                                <option value="dom_i_ogrod">Dom i ogród</option>
                                <option value="elektronika">Elektronika</option>
                                <option value="moda">Moda</option>
                                <option value="podroze">Podróże</option>
                                <option value="rozrywka">Rozrywka</option>
                                <option value="sport">Sport</option>
                                <option value="subskrypcje_i_uslugi">Subskrypcje i usługi</option>
                                <option value="zdrowie_i_uroda">Zdrowie i uroda</option>
                                <option value="inne">Inne</option>
                            </select>
                        </div>
                        
                        <div className="col-12 my-1 col-md-4 my-md-0">
                            <div className="input-group">
                                {searchKeyword && <div onClick={clearSearchHandler} id="button-search" className="input-group-text">
                                    <i className="bi bi-x"/>
                                </div>}
                                <input onKeyDown={!loading && searchKeyword ? searchHandlerEnter : undefined} value={searchKeyword} name="searchKeyword" type="text" className="form-control" placeholder="Wyszukaj okazję" onChange={e => setSearchKeyword(e.target.value)}/>
                                <div onClick={!loading && searchKeyword ? searchHandler : undefined} id="button-search" className="input-group-text">Szukaj</div>
                            </div>
                        </div>

                        <div className="col-12 col-md-3">
                            <select onChange={sortHandler} value={params.sortOrder} name="sortOrder" className="form-select">
                                <option value="">Sortuj od najnowszych</option>
                                <option value="date_oldest">Sortuj od najstarszych</option>
                                <option value="price_lowest">Sortuj po cenie rosnąco</option>
                                <option value="price_highest">Sortuj po cenie malejąco</option>
                            </select>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    
        <main id="HomeScreen" className="pt-4">
            <section>
                <div className="container-xxl">

                    {error_discountRate && <Error message={error_discountRate}/>}

                    {error_listDiscounts ? <Error message={error_listDiscounts}/> : 
                    !loading && (!discounts || discounts.length===0) ? <Info message={'Brak okazji.'}/> : 
                    discounts && discounts.map(discount => <DiscountElement key={discount._id} discount={discount}/>)}

                </div>
            </section>

            {discounts && discounts.length>0 && parameters && <Paginator/>}
        </main>
    </>
}

export default HomeScreen
