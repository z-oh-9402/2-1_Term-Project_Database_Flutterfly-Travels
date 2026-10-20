import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react';
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

// a flight comes once per seat class, so its id alone isn't unique
const itemKey = (item) => item.flight_id!==undefined ? `${item.flight_id}-${item.seat_class}` : item.name;

// Shows a list 5 items at a time, from either
// - items: the whole list, already loaded, which is cut into pages here, or
// - query: search and filter parameters for GET /<itemType>/fetch, which sends one page per request.
// When the list or the query changes it starts again at page 1.
const PaginatedItemBars = ({itemType, query, items, showBooking, emptyMessage}) => {
    const isLoaded = items!==undefined;
    const signature = isLoaded ? items.map(itemKey).join('|') : new URLSearchParams(query).toString();
    const [pageState, setPageState] = useState({signature, page: 1});
    if(pageState.signature!==signature)
    {
        setPageState({signature, page: 1});
    }
    const page = pageState.signature===signature ? pageState.page : 1;
    const [fetched, setFetched] = useState(null); // {items, total, offset} of the fetched page on screen

    useEffect(() => {
        if(isLoaded)
        {
            return;
        }
        let ignore = false;
        const offset = (page-1)*PAGE_SIZE;
        // a short wait, so dragging a filter slider sends one request instead of one per step
        const timer = setTimeout(async () => {
            const params = new URLSearchParams(signature);
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
                setPageState({signature, page: 1});
                return;
            }
            setFetched({...data, offset});
        }, 150);

        return () => {
            ignore = true;
            clearTimeout(timer);
        };
    }, [isLoaded, itemType, signature, page]);

    // a new page starts from the top of the results column (or of the window, where the page scrolls as a whole)
    const paginationRef = useRef(null);
    const goTo = (p) => {
        setPageState({signature, page: p});
        const column = paginationRef.current?.closest('.browse-results');
        (column && column.scrollHeight > column.clientHeight ? column : window).scrollTo({top: 0, behavior: 'smooth'});
    }

    const offset = (page-1)*PAGE_SIZE;
    const result = isLoaded ? {items: items.slice(offset, offset+PAGE_SIZE), total: items.length, offset} : fetched;

    if(result===null || result.items.length===0)
    {
        return <p className='empty-results'>{result===null ? 'Loading…' : emptyMessage}</p>;
    }

    const pageCount = Math.ceil(result.total/PAGE_SIZE);

    return (
        <>
            <div className='bar-container'>
                {result.items.map((item, i) =>
                    <ItemBar key={itemKey(item)} itemType={itemType} item={item} index={`${itemType}-${result.offset+i}`} showBooking={showBooking}/>
                )}
            </div>
            <div className='pagination' ref={paginationRef}>
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
    items: PropTypes.array,
    showBooking: PropTypes.func,
    emptyMessage: PropTypes.string
}

export default PaginatedItemBars;
