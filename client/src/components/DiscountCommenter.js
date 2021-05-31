import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import {listDiscountCommentAction, saveDiscountCommentAction, deleteDiscountCommentAction} from '../actions/discountActions'
import Moment from 'react-moment'
import InfoModal from './InfoModal'
import Error from './Error'

const DiscountCommenter = props => {
    const {userInfo} = useSelector(state => state.listUser)
    const {loading, error} = useSelector(state => state.discountComment)

    const [commentMessage, setCommentMessage] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit, errors} = useForm()

    const dismissMessageHandler = () => {
        setCommentMessage('')
        setMessage('')

        setValue('commentMessage', '')
    }

    const countCommentsHandler = () => {
        if(props.comments.length===0) return 0
        else {
            let existing = 0
            for(let i=0; i<props.comments.length; i++) if(props.comments[i].deleted!==true) existing++
            return existing
        }
    }

    const deleteHandler = commentId => {
        if(userInfo) dispatch(deleteDiscountCommentAction(props.id, commentId))
        else setMessage('Zaloguj się lub zarejestruj aby usunąć komentarz okazji.')
    }

    const submitHandler = () => {
        if(userInfo && commentMessage) {
            dispatch(saveDiscountCommentAction(props.id, commentMessage))
            setCommentMessage('')

            setValue('commentMessage', '')
        }
        else if(!userInfo) setMessage('Zaloguj się lub zarejestruj aby skomentować okazję.')
    }

    return <div className="col-12 mt-4 mb-3">
        {message && <InfoModal status={'show'} message={message} onClose={dismissMessageHandler}/>}

        <div id="comments" className="card">
            <div className="card-header">
                <i className="bi bi-chat-left-text me-2"/>
                {countCommentsHandler()===0 ? <span>Brak komentarzy</span> : 
                <span>Komentarzy: {countCommentsHandler()}</span>}
            </div>
            <div className="card-body">

                {props.comments && props.comments.map(comment => <div key={comment._id} className={comment.commentedBy===null || comment.deleted ? 'comment-deleted' : undefined}>
                    <div id="comment-nick" className="mb-2">
                        <i className="bi bi-person-circle me-1"/>

                        {comment.commentedBy!==null ? <span>
                            {userInfo && (userInfo.id===comment.commentedBy._id) ? `Ty (${comment.commentedBy.nick})` : comment.commentedBy.nick}
                        </span> : 
                        <span>
                            Konto użytkownika nie istnieje.
                        </span>}
                    </div>
                    <div id="comment-text" className="mb-1">
                        {comment.message}
                    </div>
                    <div>
                        {comment.commentedBy!==null && !comment.deleted && <small className="me-2">
                            <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{comment.createdAt}</Moment>
                        </small>}

                        {userInfo && ((comment.commentedBy && userInfo.id===comment.commentedBy._id) || userInfo.isAdmin) && !comment.deleted && <span onClick={!loading ? () => deleteHandler(comment._id) : undefined} id="comment-delete" className="badge rounded-pill">
                            <i className="bi bi-trash me-1"/>
                            <span>Usuń komentarz</span>
                        </span>}
                    </div>
                    <hr/>
                </div>)}

                <div>
                    <button onClick={() => dispatch(listDiscountCommentAction(props.id))} id="button-refresh" className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-arrow-repeat"/>
                    </button>
                </div>
            </div>
            <div className="card-footer">
                <div className="row">
                    <div id="comment-label" className="col-12 col-xl-1 pe-0 d-flex align-items-center mb-2 mb-xl-0">Skomentuj</div>
                    <div className="col-12 col-xl-10">
                        {error && <Error message={error}/>}

                        <textarea name="commentMessage" className="form-control mb-2 mb-xl-0" id="commentMessage" onChange={e => setCommentMessage(e.target.value)} ref={register({
                            required: true,
                            maxLength: 256
                        })}/>
                        {errors.commentMessage && errors.commentMessage.type==='required' && <Error message="Pole wymagane."/>}
                        {errors.commentMessage && errors.commentMessage.type==='maxLength' && <Error message="Maksymalna długość wynosi 256."/>}
                    </div>
                    <div className="col-12 col-xl-1 d-flex align-items-center mb-2 mb-xl-0">
                        <button disabled={loading || !commentMessage} onClick={handleSubmit(submitHandler)} type="submit" id="button-comment" className="btn btn-secondary">Wyślij</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default DiscountCommenter
