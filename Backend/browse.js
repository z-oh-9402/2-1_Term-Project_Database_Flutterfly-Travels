// Shared by GET /destination/fetch, /accommodation/fetch and /restaurant/fetch, which send the Destinations,
// Accommodations and Restaurants sections one page of items at a time.
const database = require('./database');

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

// The joins that give an item its location, district and division names
const placeJoins = (alias) => `LEFT JOIN LOCATION L ON ${alias}.LOCATION_ID=L.LOCATION_ID
                        LEFT JOIN DISTRICT DIS ON DIS.DISTRICT_ID=L.DISTRICT_ID
                        LEFT JOIN DIVISION DIV ON DIV.DIVISION_ID=DIS.DIVISION_ID`;

// "a,b,c" -> ['a','b','c']; missing or empty -> []
const listParam = (value) => typeof value === 'string' && value.length!==0 ? value.split(',') : [];

// A finite number, or undefined so the filter is skipped
const numberParam = (value) => {
    const number = Number(value);
    return value!==undefined && value!=='' && Number.isFinite(number) ? number : undefined;
};

// Collects WHERE conditions and their $n parameters, starting with the ones every section supports:
// ?keyword= (in the name or any part of the place), ?location= / ?district= / ?division= (exact place) and ?minRating=
const browseConditions = (query, alias) => {
    const conditions = [];
    const params = [];

    // add('X.RATING >= ?', 3): every ? in sql becomes the placeholder of value
    const add = (sql, value) => {
        if(value===undefined)
        {
            return;
        }
        params.push(value);
        conditions.push(sql.replaceAll('?', `$${params.length}`));
    };

    // the given facility columns (allowed is the section's whitelist) must be 'Y'
    const addFacilities = (requested, allowed) => {
        for(const column of listParam(requested))
        {
            if(allowed.includes(column))
            {
                conditions.push(`${alias}.${column.toUpperCase()}='Y'`);
            }
        }
    };

    if(query.keyword)
    {
        add(`(LOWER(${alias}.NAME) LIKE ? OR LOWER(L.LOCATION_NAME) LIKE ? OR LOWER(DIS.DISTRICT_NAME) LIKE ? OR LOWER(DIV.DIVISION_NAME) LIKE ?)`,
            `%${String(query.keyword).toLowerCase()}%`);
    }
    if(query.location) add('L.LOCATION_NAME=?', String(query.location));
    if(query.district) add('DIS.DISTRICT_NAME=?', String(query.district));
    if(query.division) add('DIV.DIVISION_NAME=?', String(query.division));
    add(`${alias}.RATING>=?`, numberParam(query.minRating));

    return {
        add,
        addFacilities,
        params,
        sql: () => conditions.length!==0 ? `WHERE ${conditions.join(' AND ')}` : '',
    };
};

// Sends {items, total}: the page picked by ?limit= and ?offset=, and how many items match in all
const sendPage = async (req, res, {select, from, where, groupBy = '', orderBy}) => {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);
    const params = [...where.params, limit, offset];

    // COUNT(*) OVER() is worked out before LIMIT/OFFSET, so every row carries the total number of matches
    const query = `SELECT ${select}, COUNT(*) OVER() AS TOTAL_COUNT
                   ${from}
                   ${where.sql()}
                   ${groupBy}
                   ORDER BY ${orderBy}
                   LIMIT $${params.length-1} OFFSET $${params.length}`;
    const rows = await database.query(query,params);

    res.status(200).json({
        items: rows.map(({total_count, ...item}) => item),
        total: rows.length!==0 ? Number(rows[0].total_count) : 0,
    });
};

module.exports = { placeJoins, listParam, numberParam, browseConditions, sendPage };
