import React from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'

const Paginator = () => {
    const {parameters} = useSelector(state => state.listDiscounts)

    const history = useHistory()

    const listPagesHandler = () => {
        const pages = Math.ceil(parameters.count / 15)

        let link = '/?'
        if(parameters.category!=='' || parameters.searchKeyword!=='' || parameters.sortOrder!=='')
            link += `category=${parameters.category}&searchKeyword=${parameters.searchKeyword}&sortOrder=${parameters.sortOrder}&`

        let elements = []
        if(pages>5) {
            parameters.page>3 && elements.push(<button key={-2} onClick={() => history.push(link + 'page=1')} type="button" className="btn btn-outline-secondary">
                <i className="bi bi-chevron-double-left"/>
            </button>)
            parameters.page>1 && elements.push(<button key={-1} onClick={() => history.push(`${link}page=${parameters.page - 1}`)} type="button" className="btn btn-outline-secondary">
                <i className="bi bi-chevron-left"/>
            </button>)
            if(parameters.page<3) {
                for(let i=1; i<=5; i++) {
                    elements.push(<button key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
                }
            }
            else if(parameters.page>=3 && parameters.page<=pages - 2) {
                for(let i=parameters.page - 2; i<=parameters.page+2; i++) {
                    elements.push(<button key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
                }
            }
            else {
                for(let i=pages - 4; i<=pages; i++) {
                    elements.push(<button key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
                }
            }
            parameters.page<pages && elements.push(<button key={-3} onClick={() => history.push(`${link}page=${parameters.page + 1}`)} type="button" className="btn btn-outline-secondary">
                <i className="bi bi-chevron-right"/>
            </button>)
            parameters.page<(pages - 2) && elements.push(<button key={-4} onClick={() => history.push(`${link}page=${pages}`)} type="button" className="btn btn-outline-secondary">
                <i className="bi bi-chevron-double-right"/>
            </button>)
        }
        else {
            for(let i=1; i<=pages; i++) {
                elements.push(<button key={i} onClick={() => history.push(`${link}page=${i}`)} type="button" className={i===parameters.page ? 'btn btn-secondary' : 'btn btn-outline-secondary'}>{i}</button>)
            }
        }

        return elements
    }

    return <section>
        <div className="container-xxl">
            <hr className="mb-0"/>
        </div>
        <div className="container-xxl d-flex justify-content-center align-items-center">
            <div id="paginator" className="btn-group my-3" role="group">
                {listPagesHandler()}
            </div>
        </div>
    </section>
}

export default Paginator
