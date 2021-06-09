import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import queryString from 'query-string'
import {useForm} from 'react-hook-form'
import {useDropzone} from 'react-dropzone'
import {logoutUserAction} from '../actions/userActions'
import {detailsDiscountAction, detailsDiscountSuccessReset, detailsDiscountReset, saveManagedDiscountAction, saveManagedDiscountReset} from '../actions/discountActions'
import ReactTooltip from 'react-tooltip'
import Animated from 'react-css-animated'
import Loader from '../components/Loader'
import AddModal from '../components/AddModal'
import Error from '../components/Error'

const AddScreen = props => {
    const {loading: loading_detailsDiscount, success, discount: discount_detailsDiscount, error: error_detailsDiscount} = useSelector(state => state.detailsDiscount)
    const {loading: loading_saveManagedDiscount, progress, message, discount: discount_saveManagedDiscount, error: error_saveManagedDiscount} = useSelector(state => state.saveManagedDiscount)

    const [id, setId] = useState('')
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [prevprice, setPrevprice] = useState('')
    const [store, setStore] = useState('')
    const [freeShipping, setFreeShipping] = useState(false)
    const [description, setDescription] = useState('')
    const [discountCode, setDiscountCode] = useState('')
    const [link, setLink] = useState('')
    const [category, setCategory] = useState('inne')
    const [images, setImages] = useState([])
    const [files, setFiles] = useState([])

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit, errors} = useForm()
    const {getRootProps, getInputProps, open} = useDropzone({
        accept: 'image/jpg, image/jpeg, image/png',
        maxFiles: 1-images.length-files.length,
        maxSize: 5*1024*1024,
        noClick: true,
        noKeyboard: true,
        onDrop: acceptedFiles => {
            let preparedFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
            setFiles(files.concat(preparedFiles))
        }
    })
    const params = queryString.parse(props.location.search)

    const clearInputsHandler = () => {
        setId('')
        setTitle('')
        setPrice('')
        setPrevprice('')
        setStore('')
        setFreeShipping(false)
        setDescription('')
        setDiscountCode('')
        setLink('')
        setCategory('inne')
        setImages([])
        setFiles([])

        setValue('title', '')
        setValue('price', '')
        setValue('prevprice', '')
        setValue('store', '')
        setValue('freeShipping', false)
        setValue('description', '')
        setValue('discountCode', '')
        setValue('link', '')
        setValue('category', '')
    }

    useEffect(() => {
        if(error_detailsDiscount) dispatch(detailsDiscountReset())
        if(error_saveManagedDiscount) dispatch(saveManagedDiscountReset())
        
        if(success) {
            if(discount_detailsDiscount) {
                setId(discount_detailsDiscount._id ? discount_detailsDiscount._id : '')
                setTitle(discount_detailsDiscount.title ? discount_detailsDiscount.title : '')
                setPrice(discount_detailsDiscount.price ? Number.parseFloat(discount_detailsDiscount.price/100).toFixed(2) : '')
                setPrevprice(discount_detailsDiscount.prevprice ? Number.parseFloat(discount_detailsDiscount.prevprice/100).toFixed(2) : '')
                setStore(discount_detailsDiscount.store ? discount_detailsDiscount.store : '')
                setFreeShipping(discount_detailsDiscount.freeShipping ? discount_detailsDiscount.freeShipping : false)
                setDescription(discount_detailsDiscount.description ? discount_detailsDiscount.description : '')
                setDiscountCode(discount_detailsDiscount.discountCode ? discount_detailsDiscount.discountCode : '')
                setLink(discount_detailsDiscount.link ? discount_detailsDiscount.link : '')
                setCategory(discount_detailsDiscount.category ? discount_detailsDiscount.category : 'inne')
                setImages(discount_detailsDiscount.images ? discount_detailsDiscount.images : [])
                setFiles([])

                setValue('title', discount_detailsDiscount.title ? discount_detailsDiscount.title : '')
                setValue('price', discount_detailsDiscount.price ? Number.parseFloat(discount_detailsDiscount.price/100).toFixed(2) : '')
                setValue('prevprice', discount_detailsDiscount.prevprice ? Number.parseFloat(discount_detailsDiscount.prevprice/100).toFixed(2) : '')
                setValue('store', discount_detailsDiscount.store ? discount_detailsDiscount.store : '')
                setValue('freeShipping', discount_detailsDiscount.freeShipping ? discount_detailsDiscount.freeShipping : false)
                setValue('description', discount_detailsDiscount.description ? discount_detailsDiscount.description : '')
                setValue('discountCode', discount_detailsDiscount.discountCode ? discount_detailsDiscount.discountCode : '')
                setValue('link', discount_detailsDiscount.link ? discount_detailsDiscount.link : '')
                setValue('category', discount_detailsDiscount.category ? discount_detailsDiscount.category : '')
            }
            dispatch(detailsDiscountSuccessReset())
        }
        else if(params.id) dispatch(detailsDiscountAction(params.id))
        else clearInputsHandler()

        return () => {}
    }, [discount_detailsDiscount, dispatch, setValue, params.id]) // eslint-disable-line react-hooks/exhaustive-deps

    const submitHandler = () => {
        dispatch(saveManagedDiscountAction({
            id: id,
            title: title,
            price: parseInt(price*100),
            prevprice: parseInt(prevprice*100),
            store: store,
            freeShipping: freeShipping,
            description: description,
            discountCode: discountCode,
            link: link,
            category: category,
            images: images,
            files: files
        }))
    }

    const deleteImageHandler = number => {
        images.splice(number, 1)
        setImages(() => ([...images]))
    }

    const deleteFileHandler = number => {
        files.splice(number, 1)
        setFiles(() => ([...files]))
    }

    const renderImagesHandler = () => {
        let thumbs = []
        for(let i=0; i<1; i++) {
            if(images[i]) {
                thumbs.push(<div id="form-thumb" key={'image' + i} data-tip="Kliknij aby usunąć zdjęcie">
                    <div id="img-container" className="d-flex justify-content-center align-items-center">
                        <img src={`${process.env.REACT_APP_API_URL}/static/${id}/${images[i]}`} className="d-flex justify-content-center align-items-center" alt="..." onClick={() => deleteImageHandler(i)}/>
                    </div>
                    <ReactTooltip effect="solid"/>
                </div>)
            }
            else {
                for(let j=0; j<1-i; j++) {
                    if(files[j]) {
                        thumbs.push(<div id="form-thumb" key={'file' + j} data-tip="Kliknij aby usunąć zdjęcie">
                            <div id="img-container" className="d-flex justify-content-center align-items-center">
                                <img src={files[j].preview} className="d-flex justify-content-center align-items-center" alt="..." onClick={() => deleteFileHandler(j)}/>
                            </div>
                            <ReactTooltip effect="solid"/>
                        </div>)
                    }
                    else {
                        thumbs.push(<div id="form-thumb" key={'choose' + j}>
                            <div id="img-container" className="d-flex justify-content-center align-items-center thumb-dropzone" onClick={open}>
                                <i className="bi bi-plus"></i>
                            </div>
                        </div>)
                    }
                }
                return <>{thumbs}</>
            }
        }
        return <>{thumbs}</>
    }

    return <main id="AddScreen" className="pt-4">

        <Loader isVisible={
            loading_detailsDiscount || 
            loading_saveManagedDiscount ? true : false
        }/>

        <section>
            <div className="container-xxl">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-lg-10 mt-md-4">
                        <div id="form-card" className="card mb-4">
                            <div className="card-header mt-1">
                                <h3><i className="bi bi-plus-square me-3"/>{id ? 'Edytuj' : 'Dodaj'} okazję:</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(submitHandler)}>
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-12 col-md-9">

                                            {message && discount_saveManagedDiscount ? <AddModal status={'show'} message={message} id={discount_saveManagedDiscount._id} clearInputsHandler={() => clearInputsHandler()}/> : 
                                            error_saveManagedDiscount && error_saveManagedDiscount==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
                                            error_saveManagedDiscount && <Error message={error_saveManagedDiscount}/>}

                                            {error_detailsDiscount && <Error message={error_detailsDiscount}/>}

                                        </div>

                                        <div className="col-12 col-md-6 pe-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="title" className="form-label">Tytuł*</label>
                                                <input type="text" name="title" className="form-control" id="title" placeholder="np. Moja okazja" onChange={e => setTitle(e.target.value)} ref={register({
                                                    required: true,
                                                    maxLength: 64
                                                })}/>
                                            </div>
                                            {errors.title && errors.title.type === 'required' && <Error message="Pole wymagane."/>}
                                            {errors.title && errors.title.type === 'maxLength' && <Error message="Maksymalna długość wynosi 64."/>}

                                            <div className="mb-3">
                                                <label htmlFor="link" className="form-label">Link do oferty*</label>
                                                <input type="text" name="link" className="form-control" id="link" placeholder="https://..." onChange={e => setLink(e.target.value)} ref={register({
                                                    required: true,
                                                    maxLength: 256,
                                                    pattern: /^((https?:\/\/)?)[a-zA-Z0-9]{1}[a-zA-Z0-9-.]{0,}\.[a-z]{2,13}[a-zA-Z0-9:/?#[\]@!$&'()*+,;=\-.]{0,}$/g
                                                })}/>
                                            </div>
                                            {errors.link && errors.link.type === 'required' && <Error message="Pole wymagane."/>}
                                            {errors.link && errors.link.type === 'maxLength' && <Error message="Maksymalna długość wynosi 256."/>}
                                            {errors.link && errors.link.type === 'pattern' && <Error message="Niepoprawny format linku."/>}

                                            <div className="mb-3">
                                                <label htmlFor="price" className="form-label">Cena (zł)*</label>
                                                <input type="text" name="price" className="form-control" id="price" placeholder="np. 21.00" onChange={e => setPrice(e.target.value)} ref={register({
                                                    required: true,
                                                    maxLength: 10,
                                                    pattern: /^([0-9]+[.][0-9]{2})$/g
                                                })}/>
                                            </div>
                                            {errors.price && errors.price.type === 'required' && <Error message="Pole wymagane."/>}
                                            {errors.price && errors.price.type === 'maxLength' && <Error message="Maksymalna długość wynosi 10."/>}
                                            {errors.price && errors.price.type === 'pattern' && <Error message="Niepoprawny format ceny."/>}

                                            <div className="mb-3">
                                                <label htmlFor="prevprice" className="form-label">Cena przed obniżką (zł)</label>
                                                <input type="text" name="prevprice" className="form-control" id="prevprice" placeholder="np. 37.00" onChange={e => setPrevprice(e.target.value)} ref={register({
                                                    maxLength: 10,
                                                    pattern: /^([0-9]+[.][0-9]{2})$/g
                                                })}/>
                                            </div>
                                            {errors.prevPrice && errors.prevPrice.type === 'maxLength' && <Error message="Maksymalna długość wynosi 10."/>}
                                            {errors.prevPrice && errors.prevPrice.type === 'pattern' && <Error message="Niepoprawny format ceny."/>}

                                            <div className="mb-3">
                                                <label htmlFor="store" className="form-label">Nazwa sklepu</label>
                                                <input type="text" name="store" className="form-control" id="store" onChange={e => setStore(e.target.value)} ref={register({
                                                    maxLength: 24
                                                })}/>
                                            </div>
                                            {errors.store && errors.store.type === 'maxLength' && <Error message="Maksymalna długość wynosi 24."/>}

                                            <div className="mb-3 pt-2">
                                                <input type="checkbox" name="freeShipping" className="form-check-input me-1" id="freeShipping" checked={freeShipping} onChange={e => setFreeShipping(e.target.checked)}/>
                                                <label htmlFor="freeShipping" className="form-check-label">Darmowa dostawa</label>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 ps-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">Opis</label>
                                                <textarea name="description" className="form-control" id="description" rows="3" onChange={e => setDescription(e.target.value)} ref={register({
                                                    maxLength: 1024
                                                })}/>
                                            </div>
                                            {errors.description && errors.description.type === 'maxLength' && <Error message="Maksymalna długość wynosi 1024."/>}

                                            <div className="mb-3">
                                                <label htmlFor="discountCode" className="form-label">Kod zniżkowy</label>
                                                <input type="text" name="discountCode" className="form-control" id="discountCode" onChange={e => setDiscountCode(e.target.value)} ref={register({
                                                    maxLength: 24
                                                })}/>
                                            </div>
                                            {errors.discountCode && errors.discountCode.type === 'maxLength' && <Error message="Maksymalna długość wynosi 24."/>}

                                            <div className="mb-3">
                                                <label htmlFor="category" className="form-label">Kategoria</label>
                                                <select name="category" className="form-select" id="category" value={category} onChange={e => setCategory(e.target.value)}>
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

                                            <div className="mb-3">
                                                <label htmlFor="image" className="form-label">Zdjęcie</label>
                                                <div {...getRootProps()} className="d-flex flex-row flex-wrap">
                                                    <input name="images" id="images" {...getInputProps()}/>
                                                    {renderImagesHandler()}
                                                </div>
                                                <div id="image-help" className="form-text">Maksymalna wielkość zdjęcia (.jpg/.jpeg/.png) to 5 MB.</div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <Animated isVisible={progress ? true : false} animationIn="fadeIn" animationOut="fadeOut" duration={400}>
                                                <div id="form-progress" className="pt-2 pb-4">
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${progress ? progress : 0}%`}}>{progress ? progress + '%' : '0%'}</div>
                                                    </div>
                                                </div>
                                            </Animated>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button disabled={loading_saveManagedDiscount} type="submit" id="form-button" className="btn btn-secondary mb-1">{id ? 'Zapisz' : 'Dodaj'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
}

export default AddScreen
