import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import ItemBar from './ItemBar';
import { apiFetch } from '../api';
import "../Styles/item-bar.css"
import "../Styles/pagination.css"

const PAGE_SIZE = 5;

// first, last and the pages next to the current one; skipped runs become '…'
const pageNumbers = (current, count) => {
    const pages = [];
    for(let p=1; p<=count; p++)
    {
        if(p===1 || p===count || Math.abs(p-current)<=1)
        {
            pages.push(p);
        }
        else if(pages[pages.length-1]!=='…')
        {
            pages.push('…');
        }
    }
    return pages;
}

// Fetches and shows one page at a time of GET /<itemType>/fetch.
// query holds the search and filter parameters; when they change the list starts again at page 1.
const PaginatedItemBars = ({itemType, query, emptyMessage}) => {
    const queryString = new URLSearchParams(query).toString();
    const [pageState, setPageState] = useState({queryString, page: 1});
    if(pageState.queryString!==queryString)
    {
        setPageState({queryString, page: 1});
    }
    const page = pageState.queryString===queryString ? pageState.page : 1;
    const [result, setResult] = useState(null); // {items, total, offset} of the page on screen

    useEffect(() => {
        let ignore = false;
        const offset = (page-1)*PAGE_SIZE;
        // a short wait, so dragging a filter slider sends one request instead of one per step
        const timer = setTimeout(async () => {
            const params = new URLSearchParams(queryString);
            params.set('limit', PAGE_SIZE);
            params.set('offset', offset);
            const response = await apiFetch(`http://localhost:3000/${itemType}/fetch?${params}`,{
                method: "GET",
            });

            const data = response.ok ? await response.json() : {items: [], total: 0};
            if(ignore)
            {
                return;
            }
            if(data.items.length===0 && page>1)
            {
                // items were removed since the page buttons were drawn
                setPageState({queryString, page: 1});
                return;
            }
            setResult({...data, offset});
        }, 150);

        return () => {
            ignore = true;
            clearTimeout(timer);
        };
    }, [itemType, queryString, page]);

    const goTo = (p) => {
        setPageState({queryString, page: p});
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    if(result===null || result.items.length===0)
    {
        return <p className='empty-results'>{result===null ? 'Loading…' : emptyMessage}</p>;
    }

    const pageCount = Math.ceil(result.total/PAGE_SIZE);

    return (
        <>
            <div className='bar-container'>
                {result.items.map((item, i) =>
                    <ItemBar key={item.name} itemType={itemType} item={item} index={`${itemType}-${result.offset+i}`}/>
                )}
            </div>
            <div className='pagination'>
                <span className='page-summary'>Showing {result.offset+1}–{result.offset+result.items.length} of {result.total}</span>
                {pageCount>1 &&
                    <nav className='page-buttons' aria-label='Pages'>
                        <button className='btn-primary' disabled={page===1} onClick={() => goTo(page-1)}>‹ Prev</button>
                        {pageNumbers(page, pageCount).map((p, i) =>
                            p==='…' ?
                                <span key={`gap${i}`} className='page-gap'>…</span> :
                                <button key={p} className={`btn-primary${p===page ? ' active' : ''}`}
                                        aria-current={p===page ? 'page' : undefined}
                                        onClick={() => goTo(p)}>{p}</button>
                        )}
                        <button className='btn-primary' disabled={page===pageCount} onClick={() => goTo(page+1)}>Next ›</button>
                    </nav>}
            </div>
        </>
    );
};

PaginatedItemBars.propTypes = {
    itemType: PropTypes.string,
    query: PropTypes.object,
    emptyMessage: PropTypes.string
}

export default PaginatedItemBars;
