--
-- PostgreSQL database dump
--

\restrict tNEAy2MRhpcFcUGoep6jaFzGNXWbQiFobqVgaziQs9vRbm964wyT9RClOjNQ26E

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: accommodation_delete_trigger_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.accommodation_delete_trigger_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM rating
    WHERE item_type = 'accommodation' AND item_id = OLD.accommodation_id;

    DELETE FROM review
    WHERE item_type = 'accommodation' AND item_id = OLD.accommodation_id;

    RETURN NULL;
END;
$$;


--
-- Name: add_trip_count_and_discount(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.add_trip_count_and_discount() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prev_count INTEGER;
    new_count INTEGER;
    dsc INTEGER;
BEGIN
    IF NEW.trip_status = 'COMPLETED' THEN
        SELECT trip_booked INTO prev_count
        FROM customer
        WHERE customer_id = NEW.customer_id;

        new_count := prev_count + 1;

        UPDATE customer
        SET trip_booked = new_count
        WHERE customer_id = NEW.customer_id;

        IF new_count <= 45 THEN
            dsc := FLOOR(new_count / 3) * 2;
            INSERT INTO gifts_and_coupons (customer_id, discount)
            VALUES (NEW.customer_id, dsc);
        END IF;
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: check_trip_name(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_trip_name(tname character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    does_exist INTEGER;
    trip_name VARCHAR(100);
BEGIN
    BEGIN
        SELECT name INTO trip_name FROM trip WHERE name = tname;
				
        IF trip_name IS NOT NULL THEN RETURN 1;
				ELSE RETURN -1;
				END IF;
    END;
END;
$$;


--
-- Name: check_username(character varying); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_username(user_name character varying) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
	DOES_EXIST INTEGER;
	NAME VARCHAR(100);
BEGIN
	BEGIN
		SELECT USERNAME INTO NAME FROM Users WHERE USERNAME = USER_NAME;
		
		IF NAME IS NOT NULL THEN RETURN 1;
		ELSE RETURN -1;
		END IF;
	END;
END;
$$;


--
-- Name: destination_delete_trigger_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.destination_delete_trigger_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM rating
    WHERE item_type = 'destination' AND item_id = OLD.destination_id;

    DELETE FROM review
    WHERE item_type = 'destination' AND item_id = OLD.destination_id;

    RETURN NULL;
END;
$$;


--
-- Name: fetch_filtered_flights(character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.fetch_filtered_flights(IN dap character varying, IN aap character varying, IN sclass character varying, IN fstyle character varying, OUT p_cursor refcursor)
    LANGUAGE plpgsql
    AS $$
DECLARE
    dapid INTEGER;
    aapid INTEGER;
		f RECORD;

BEGIN
-- 		DBMS_OUTPUT.PUT_LINE('The employee worked ' || dap || ' ' || aap || ' ' || sclass || ' ' || fstyle);

    SELECT airport_id INTO dapid FROM airport WHERE iata_code = dap;
		SELECT airport_id INTO aapid FROM airport WHERE iata_code = aap;
		
		RAISE NOTICE 'Airport Codes: dap=%, aap=%', dapid, aapid;
		
		p_cursor := 'filtered_flights_cursor';

    IF sclass = 'Economy' THEN
        IF fstyle = 'Round Trip' THEN
            OPEN p_cursor FOR
                SELECT flight_id, flight_style, airline_name, image, 
                       TO_CHAR(departure_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS departure_time, 
                       TO_CHAR(arrival_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS arrival_time, 
                       economy_seat_price * 2 AS seat_price, 
                       return_departure_time, 
                       return_arrival_time
                FROM flight
                WHERE departure_airport_id = dapid 
                  AND arrival_airport_id = aapid 
                  AND flight_style = fstyle
                ORDER BY departure_time;
        ELSE
            OPEN p_cursor FOR
                SELECT flight_id, flight_style, airline_name, image, 
                       TO_CHAR(departure_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS departure_time, 
                       TO_CHAR(arrival_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS arrival_time, 
                       economy_seat_price AS seat_price
                FROM flight
                WHERE departure_airport_id = dapid 
                  AND arrival_airport_id = aapid 
                  AND flight_style = fstyle
                ORDER BY departure_time;
								
        END IF;
    ELSIF sclass = 'Business' THEN
        IF fstyle = 'Round Trip' THEN
            OPEN p_cursor FOR
                SELECT flight_id, flight_style, airline_name, image, 
                       TO_CHAR(departure_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS departure_time, 
                       TO_CHAR(arrival_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS arrival_time, 
                       business_seat_price * 2 AS seat_price, 
                       return_departure_time, 
                       return_arrival_time
                FROM flight
                WHERE departure_airport_id = dapid 
                  AND arrival_airport_id = aapid 
                  AND flight_style = fstyle
                ORDER BY departure_time;
        ELSE
            OPEN p_cursor FOR
                SELECT flight_id, flight_style, airline_name, image, 
                       TO_CHAR(departure_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS departure_time, 
                       TO_CHAR(arrival_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS arrival_time, 
                       business_seat_price AS seat_price
                FROM flight
                WHERE departure_airport_id = dapid 
                  AND arrival_airport_id = aapid 
                  AND flight_style = fstyle
                ORDER BY departure_time;
        END IF;
    ELSE
        IF fstyle = 'Round Trip' THEN
            OPEN p_cursor FOR
                SELECT flight_id, flight_style, airline_name, image, 
                       TO_CHAR(departure_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS departure_time, 
                       TO_CHAR(arrival_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS arrival_time, 
                       first_seat_price * 2 AS seat_price, 
                       return_departure_time, 
                       return_arrival_time
                FROM flight
                WHERE departure_airport_id = dapid 
                  AND arrival_airport_id = aapid 
                  AND flight_style = fstyle
                ORDER BY departure_time;
        ELSE
            OPEN p_cursor FOR
                SELECT flight_id, flight_style, airline_name, image, 
                       TO_CHAR(departure_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS departure_time, 
                       TO_CHAR(arrival_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS arrival_time, 
                       first_seat_price AS seat_price
                FROM flight
                WHERE departure_airport_id = dapid 
                  AND arrival_airport_id = aapid 
                  AND flight_style = fstyle
                ORDER BY departure_time;
        END IF;
    END IF;
END;
$$;


--
-- Name: flight_delete_trigger_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.flight_delete_trigger_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN DELETE FROM rating WHERE item_type = 'flight' AND item_id = OLD.flight_id; DELETE FROM review WHERE item_type = 'flight' AND item_id = OLD.flight_id; RETURN NULL; END; $$;


--
-- Name: get_booking_id(integer, character varying, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_booking_id(tid integer, btype character varying, icost integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO BOOKING (TRIP_ID, BOOKING_TYPE, COST)
    VALUES (tid, btype, icost)
    RETURNING BOOKING_ID INTO new_id;

    RETURN new_id;
END;
$$;


--
-- Name: notification_add_for_booking_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notification_add_for_booking_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    aid INTEGER;
    cid INTEGER;
    tname VARCHAR(100);
BEGIN
    SELECT customer_id INTO cid FROM trip WHERE trip_id = NEW.trip_id;
    SELECT agent_id INTO aid FROM trip WHERE trip_id = NEW.trip_id;
    SELECT name INTO tname FROM trip WHERE trip_id = NEW.trip_id;

    INSERT INTO notification (user_id, content, notification_status)
    VALUES (cid, 'Booking into trip ''' || tname || ''' has been added successfully.', 'NOT SHOWED');

    INSERT INTO notification (user_id, content, notification_status)
    VALUES (aid, 'Booking into trip ''' || tname || ''' has been added successfully.', 'NOT SHOWED');

    RETURN NULL;
END;
$$;


--
-- Name: notification_add_for_trip_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notification_add_for_trip_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (NEW.agent_id, 'You received a new request.', 'NOT SHOWED');

        INSERT INTO notification (user_id, content, notification_status)
        VALUES (NEW.customer_id, 'Your request has been sent.', 'NOT SHOWED');

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (OLD.customer_id, 'Your trip ''' || OLD.name || ''' has been removed.', 'NOT SHOWED');

    ELSE
        -- Only status or agent changes are news (e.g. total_cost updates from bookings are not)
        IF NEW.trip_status IS NOT DISTINCT FROM OLD.trip_status AND NEW.agent_id IS NOT DISTINCT FROM OLD.agent_id THEN
            RETURN NULL;
        END IF;

        IF NEW.agent_id IS NULL THEN
            INSERT INTO notification (user_id, content, notification_status)
            VALUES (NEW.customer_id, 'Your request for trip ''' || NEW.name || ''' has been cancelled.', 'NOT SHOWED');
        ELSIF NEW.trip_status = 'UPDATING' THEN
            INSERT INTO notification (user_id, content, notification_status)
            VALUES (NEW.customer_id, 'Your request for trip ''' || NEW.name || ''' has been accepted.', 'NOT SHOWED');
        ELSIF NEW.trip_status = 'PENDING' THEN
            INSERT INTO notification (user_id, content, notification_status)
            VALUES (NEW.customer_id, 'Your trip ''' || NEW.name || ''' is waiting to be confirmed by admin.', 'NOT SHOWED');
        ELSIF NEW.trip_status = 'CONFIRMED' THEN
            INSERT INTO notification (user_id, content, notification_status)
            VALUES (NEW.customer_id, 'Your trip ''' || NEW.name || ''' has been approved by admin.', 'NOT SHOWED');
        ELSIF NEW.trip_status = 'COMPLETED' THEN
            INSERT INTO notification (user_id, content, notification_status)
            VALUES (NEW.customer_id, 'Your trip ''' || NEW.name || ''' has been completed.', 'NOT SHOWED');
        ELSE
            INSERT INTO notification (user_id, content, notification_status)
            VALUES (NEW.agent_id, 'You have received a new request.', 'NOT SHOWED');
        END IF;
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: notify_agent_signup_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_agent_signup_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.acc_status = 'OK' THEN
        INSERT INTO notification (user_id, content, notification_status, sender_id)
        VALUES (NEW.agent_id, 'Your registration request has been approved.', 'NOT SHOWED', 1);
    ELSIF NEW.acc_status = 'DECLINED' THEN
        INSERT INTO notification (user_id, content, notification_status, sender_id)
        VALUES (NEW.agent_id, 'Your registration request has been declined.', 'NOT SHOWED', 1);
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: notify_notification_created(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_notification_created() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Tells the backend (LISTEN notification_created) about every new notification, so it can push it to
    -- the user instantly. Postgres delivers it only when the inserting transaction commits.
    PERFORM pg_notify('notification_created', NEW.notification_id::text);
    RETURN NULL;
END;
$$;


--
-- Name: restaurant_delete_trigger_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.restaurant_delete_trigger_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM rating
    WHERE item_type = 'restaurant' AND item_id = OLD.restaurant_id;

    DELETE FROM review
    WHERE item_type = 'restaurant' AND item_id = OLD.restaurant_id;

    RETURN NULL;
END;
$$;


--
-- Name: trip_delete_trigger_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.trip_delete_trigger_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM rating
    WHERE item_type = 'trip' AND item_id = OLD.trip_id;

    DELETE FROM review
    WHERE item_type = 'trip' AND item_id = OLD.trip_id;

    RETURN NULL;
END;
$$;


--
-- Name: update_accommodation_wishlist_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_accommodation_wishlist_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (NEW.customer_id, 'Item has been added to wishlist.', 'NOT SHOWED');
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (OLD.customer_id, 'Item has been removed from wishlist.', 'NOT SHOWED');
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: update_destination_wishlist_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_destination_wishlist_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (NEW.customer_id, 'Item has been added to wishlist.', 'NOT SHOWED');
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (OLD.customer_id, 'Item has been removed from wishlist.', 'NOT SHOWED');
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: update_restaurant_wishlist_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_restaurant_wishlist_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (NEW.customer_id, 'Item has been added to wishlist.', 'NOT SHOWED');
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO notification (user_id, content, notification_status)
        VALUES (OLD.customer_id, 'Item has been removed from wishlist.', 'NOT SHOWED');
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: update_total_cost_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_total_cost_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prev_cost NUMERIC;
    new_cost NUMERIC;
BEGIN
    SELECT total_cost INTO prev_cost
    FROM trip
    WHERE trip_id = NEW.trip_id;

    new_cost := prev_cost + NEW.cost;

    UPDATE trip
    SET total_cost = new_cost
    WHERE trip_id = NEW.trip_id;

    RETURN NULL;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accommodation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accommodation (
    accommodation_id integer NOT NULL,
    name character varying(200),
    rating numeric(2,1),
    room_capacity integer,
    room_price integer,
    accommodation_type character varying(100),
    location_id integer,
    accommodation_class integer,
    style character varying(100),
    free_wifi character varying(1),
    parking character varying(1),
    breakfast character varying(1),
    pool character varying(1),
    accessible character varying(1),
    map character varying(1000),
    image character varying(1000),
    image1 character varying(1000),
    image2 character varying(1000),
    image3 character varying(1000),
    address character varying(300),
    description character varying(1000),
    phone_number character varying(11),
    facebook character varying(1000),
    website character varying(1000),
    email character varying(50),
    CONSTRAINT accommodation_accommodation_class_check CHECK ((accommodation_class <= 7)),
    CONSTRAINT accommodation_email_check CHECK (((email)::text ~~ '%@%.%'::text)),
    CONSTRAINT accommodation_phone_number_check CHECK (regexp_like((phone_number)::text, '^\d{11}$'::text)),
    CONSTRAINT accommodation_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


--
-- Name: accommodation_accommodation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accommodation_accommodation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accommodation_accommodation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accommodation_accommodation_id_seq OWNED BY public.accommodation.accommodation_id;


--
-- Name: accommodation_booking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accommodation_booking (
    accommodation_booking_id integer NOT NULL,
    accommodation_id integer,
    number_of_rooms integer,
    check_in timestamp without time zone,
    check_out timestamp without time zone
);


--
-- Name: accommodation_booking_accommodation_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accommodation_booking_accommodation_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accommodation_booking_accommodation_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accommodation_booking_accommodation_booking_id_seq OWNED BY public.accommodation_booking.accommodation_booking_id;


--
-- Name: accommodation_wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accommodation_wishlist (
    wishlist_id integer NOT NULL,
    customer_id integer,
    accommodation_id integer
);


--
-- Name: accommodation_wishlist_wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accommodation_wishlist_wishlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accommodation_wishlist_wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accommodation_wishlist_wishlist_id_seq OWNED BY public.accommodation_wishlist.wishlist_id;


--
-- Name: agent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agent (
    agent_id integer NOT NULL,
    experience_years integer,
    fee integer,
    acc_status character varying(20),
    rating numeric(2,1),
    CONSTRAINT agent_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


--
-- Name: agent_agent_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agent_agent_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agent_agent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agent_agent_id_seq OWNED BY public.agent.agent_id;


--
-- Name: airport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.airport (
    airport_id integer NOT NULL,
    name character varying(100),
    iata_code character varying(5),
    location_id integer
);


--
-- Name: airport_airport_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.airport_airport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: airport_airport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.airport_airport_id_seq OWNED BY public.airport.airport_id;


--
-- Name: booking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking (
    booking_id integer NOT NULL,
    trip_id integer,
    cost integer,
    booking_type character varying(100),
    booking_date date
);


--
-- Name: booking_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_booking_id_seq OWNED BY public.booking.booking_id;


--
-- Name: customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    passport_number character varying(20) NOT NULL,
    trip_booked integer
);


--
-- Name: customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_customer_id_seq OWNED BY public.customer.customer_id;


--
-- Name: customer_preference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_preference (
    customer_preference_id integer NOT NULL,
    customer_id integer,
    preference_id integer
);


--
-- Name: customer_preference_customer_preference_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_preference_customer_preference_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_preference_customer_preference_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_preference_customer_preference_id_seq OWNED BY public.customer_preference.customer_preference_id;


--
-- Name: destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destination (
    destination_id integer NOT NULL,
    name character varying(255),
    description character varying(1000),
    attractions character varying(1000),
    weather_info character varying(1000),
    travel_tips character varying(1000),
    image character varying(1000),
    rating numeric(2,1),
    location_id integer,
    map character varying(1000),
    image1 character varying(1000),
    image2 character varying(1000),
    image3 character varying(1000),
    CONSTRAINT destination_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


--
-- Name: destination_destination_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.destination_destination_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: destination_destination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.destination_destination_id_seq OWNED BY public.destination.destination_id;


--
-- Name: destination_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destination_type (
    destination_type_id integer NOT NULL,
    destination_id integer,
    place_type_id integer
);


--
-- Name: destination_type_destination_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.destination_type_destination_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: destination_type_destination_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.destination_type_destination_type_id_seq OWNED BY public.destination_type.destination_type_id;


--
-- Name: destination_wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destination_wishlist (
    wishlist_id integer NOT NULL,
    customer_id integer,
    destination_id integer
);


--
-- Name: destination_wishlist_wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.destination_wishlist_wishlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: destination_wishlist_wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.destination_wishlist_wishlist_id_seq OWNED BY public.destination_wishlist.wishlist_id;


--
-- Name: district; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.district (
    district_id integer NOT NULL,
    district_name character varying(100),
    division_id integer
);


--
-- Name: district_district_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.district_district_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: district_district_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.district_district_id_seq OWNED BY public.district.district_id;


--
-- Name: division; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.division (
    division_id integer NOT NULL,
    division_name character varying(100)
);


--
-- Name: division_division_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.division_division_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: division_division_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.division_division_id_seq OWNED BY public.division.division_id;


--
-- Name: flight; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flight (
    flight_id integer NOT NULL,
    airline_name character varying(200),
    departure_airport_id integer,
    arrival_airport_id integer,
    departure_time timestamp without time zone,
    arrival_time timestamp without time zone,
    image character varying(1000),
    flight_style character varying(100),
    return_departure_time timestamp without time zone,
    return_arrival_time timestamp without time zone,
    economy_seat_price integer,
    business_seat_price integer,
    first_seat_price integer,
    CONSTRAINT flight_flight_style_check CHECK (((flight_style)::text = ANY (ARRAY[('One Way'::character varying)::text, ('Round Trip'::character varying)::text])))
);


--
-- Name: flight_booking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flight_booking (
    flight_booking_id integer NOT NULL,
    flight_id integer,
    number_of_seats integer,
    seat_class character varying(50),
    flight_style character varying(15),
    departure_at timestamp without time zone,
    arrival_at timestamp without time zone,
    CONSTRAINT flight_booking_flight_style_check CHECK (((flight_style)::text = ANY (ARRAY[('One Way'::character varying)::text, ('Round Trip'::character varying)::text])))
);


--
-- Name: flight_booking_flight_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flight_booking_flight_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flight_booking_flight_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flight_booking_flight_booking_id_seq OWNED BY public.flight_booking.flight_booking_id;


--
-- Name: flight_flight_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flight_flight_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flight_flight_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flight_flight_id_seq OWNED BY public.flight.flight_id;


--
-- Name: gifts_and_coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gifts_and_coupons (
    coupon_id integer NOT NULL,
    customer_id integer,
    discount numeric(3,1)
);


--
-- Name: gifts_and_coupons_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gifts_and_coupons_coupon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gifts_and_coupons_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gifts_and_coupons_coupon_id_seq OWNED BY public.gifts_and_coupons.coupon_id;


--
-- Name: location; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.location (
    location_id integer NOT NULL,
    location_name character varying(100),
    district_id integer
);


--
-- Name: location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.location_location_id_seq OWNED BY public.location.location_id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    notification_id integer NOT NULL,
    user_id integer,
    content character varying(1000),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    notification_status character varying(20),
    sender_id integer,
    CONSTRAINT notification_notification_status_check CHECK (((notification_status)::text = ANY (ARRAY[('SHOWED'::character varying)::text, ('NOT SHOWED'::character varying)::text])))
);


--
-- Name: notification_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_notification_id_seq OWNED BY public.notification.notification_id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    customer_id integer,
    trip_id integer,
    payment_type character varying(100),
    payment_status character varying(10),
    account_id character varying(20),
    CONSTRAINT payment_payment_status_check CHECK (((payment_status)::text = ANY (ARRAY[('PENDING'::character varying)::text, ('PAID'::character varying)::text])))
);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- Name: place_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.place_type (
    place_type_id integer NOT NULL,
    type_name character varying(100)
);


--
-- Name: place_type_place_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.place_type_place_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: place_type_place_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.place_type_place_type_id_seq OWNED BY public.place_type.place_type_id;


--
-- Name: rating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rating (
    rating_id integer NOT NULL,
    customer_id integer,
    item_type character varying(20),
    item_id integer,
    rating integer
);


--
-- Name: rating_rating_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rating_rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rating_rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rating_rating_id_seq OWNED BY public.rating.rating_id;


--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurant (
    restaurant_id integer NOT NULL,
    name character varying(150),
    cuisine_type character varying(100),
    rating numeric(2,1),
    location_id integer,
    map character varying(1000),
    restaurant_class integer,
    image character varying(1000),
    image1 character varying(1000),
    image2 character varying(1000),
    image3 character varying(1000),
    phone_number character varying(11),
    address character varying(300),
    facebook character varying(1000),
    website character varying(1000),
    email character varying(50),
    free_wifi character varying(1),
    accessible character varying(1),
    delivery character varying(1),
    dine_in character varying(1),
    takeaway character varying(1),
    parking character varying(1),
    price_range character varying(5),
    booking_cost integer,
    CONSTRAINT restaurant_email_check CHECK (((email)::text ~~ '%@%.%'::text)),
    CONSTRAINT restaurant_phone_number_check CHECK (regexp_like((phone_number)::text, '^\d{11}$'::text)),
    CONSTRAINT restaurant_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric))),
    CONSTRAINT restaurant_restaurant_class_check CHECK ((restaurant_class <= 7))
);


--
-- Name: restaurant_booking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurant_booking (
    restaurant_booking_id integer NOT NULL,
    restaurant_id integer,
    number_of_seats integer,
    arrival_time timestamp without time zone,
    departure_time timestamp without time zone,
    booking_date date
);


--
-- Name: restaurant_booking_restaurant_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restaurant_booking_restaurant_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restaurant_booking_restaurant_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restaurant_booking_restaurant_booking_id_seq OWNED BY public.restaurant_booking.restaurant_booking_id;


--
-- Name: restaurant_restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restaurant_restaurant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restaurant_restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restaurant_restaurant_id_seq OWNED BY public.restaurant.restaurant_id;


--
-- Name: restaurant_wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.restaurant_wishlist (
    wishlist_id integer NOT NULL,
    customer_id integer,
    restaurant_id integer
);


--
-- Name: restaurant_wishlist_wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.restaurant_wishlist_wishlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: restaurant_wishlist_wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.restaurant_wishlist_wishlist_id_seq OWNED BY public.restaurant_wishlist.wishlist_id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    customer_id integer,
    item_type character varying(20),
    item_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    review character varying
);


--
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- Name: trip; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trip (
    trip_id integer NOT NULL,
    agent_id integer,
    customer_id integer,
    name character varying(255),
    departure_date date,
    return_date date,
    total_cost integer,
    discount numeric(2,1),
    rating numeric(2,1),
    trip_status character varying(15),
    CONSTRAINT trip_rating_check CHECK ((rating <= (5)::numeric)),
    CONSTRAINT trip_trip_status_check CHECK (((trip_status)::text = ANY ((ARRAY['REQUESTING'::character varying, 'UPDATING'::character varying, 'PENDING'::character varying, 'CONFIRMED'::character varying, 'COMPLETED'::character varying])::text[])))
);


--
-- Name: trip_destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trip_destination (
    trip_destination_id integer NOT NULL,
    trip_id integer,
    destination_id integer,
    departure_date date,
    return_date date
);


--
-- Name: trip_destination_trip_destination_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trip_destination_trip_destination_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trip_destination_trip_destination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trip_destination_trip_destination_id_seq OWNED BY public.trip_destination.trip_destination_id;


--
-- Name: trip_trip_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.trip_trip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: trip_trip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.trip_trip_id_seq OWNED BY public.trip.trip_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100),
    first_name character varying(50),
    last_name character varying(50),
    user_type character varying(20),
    email character varying(50),
    photo character varying(255),
    CONSTRAINT users_email_check CHECK (((email)::text ~~ '%@%.%'::text))
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: accommodation accommodation_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation ALTER COLUMN accommodation_id SET DEFAULT nextval('public.accommodation_accommodation_id_seq'::regclass);


--
-- Name: accommodation_booking accommodation_booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_booking ALTER COLUMN accommodation_booking_id SET DEFAULT nextval('public.accommodation_booking_accommodation_booking_id_seq'::regclass);


--
-- Name: accommodation_wishlist wishlist_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_wishlist ALTER COLUMN wishlist_id SET DEFAULT nextval('public.accommodation_wishlist_wishlist_id_seq'::regclass);


--
-- Name: agent agent_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent ALTER COLUMN agent_id SET DEFAULT nextval('public.agent_agent_id_seq'::regclass);


--
-- Name: airport airport_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.airport ALTER COLUMN airport_id SET DEFAULT nextval('public.airport_airport_id_seq'::regclass);


--
-- Name: booking booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking ALTER COLUMN booking_id SET DEFAULT nextval('public.booking_booking_id_seq'::regclass);


--
-- Name: customer customer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer ALTER COLUMN customer_id SET DEFAULT nextval('public.customer_customer_id_seq'::regclass);


--
-- Name: customer_preference customer_preference_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_preference ALTER COLUMN customer_preference_id SET DEFAULT nextval('public.customer_preference_customer_preference_id_seq'::regclass);


--
-- Name: destination destination_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination ALTER COLUMN destination_id SET DEFAULT nextval('public.destination_destination_id_seq'::regclass);


--
-- Name: destination_type destination_type_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_type ALTER COLUMN destination_type_id SET DEFAULT nextval('public.destination_type_destination_type_id_seq'::regclass);


--
-- Name: destination_wishlist wishlist_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_wishlist ALTER COLUMN wishlist_id SET DEFAULT nextval('public.destination_wishlist_wishlist_id_seq'::regclass);


--
-- Name: district district_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.district ALTER COLUMN district_id SET DEFAULT nextval('public.district_district_id_seq'::regclass);


--
-- Name: division division_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.division ALTER COLUMN division_id SET DEFAULT nextval('public.division_division_id_seq'::regclass);


--
-- Name: flight flight_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight ALTER COLUMN flight_id SET DEFAULT nextval('public.flight_flight_id_seq'::regclass);


--
-- Name: flight_booking flight_booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight_booking ALTER COLUMN flight_booking_id SET DEFAULT nextval('public.flight_booking_flight_booking_id_seq'::regclass);


--
-- Name: gifts_and_coupons coupon_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gifts_and_coupons ALTER COLUMN coupon_id SET DEFAULT nextval('public.gifts_and_coupons_coupon_id_seq'::regclass);


--
-- Name: location location_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location ALTER COLUMN location_id SET DEFAULT nextval('public.location_location_id_seq'::regclass);


--
-- Name: notification notification_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification ALTER COLUMN notification_id SET DEFAULT nextval('public.notification_notification_id_seq'::regclass);


--
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- Name: place_type place_type_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.place_type ALTER COLUMN place_type_id SET DEFAULT nextval('public.place_type_place_type_id_seq'::regclass);


--
-- Name: rating rating_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating ALTER COLUMN rating_id SET DEFAULT nextval('public.rating_rating_id_seq'::regclass);


--
-- Name: restaurant restaurant_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant ALTER COLUMN restaurant_id SET DEFAULT nextval('public.restaurant_restaurant_id_seq'::regclass);


--
-- Name: restaurant_booking restaurant_booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_booking ALTER COLUMN restaurant_booking_id SET DEFAULT nextval('public.restaurant_booking_restaurant_booking_id_seq'::regclass);


--
-- Name: restaurant_wishlist wishlist_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_wishlist ALTER COLUMN wishlist_id SET DEFAULT nextval('public.restaurant_wishlist_wishlist_id_seq'::regclass);


--
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- Name: trip trip_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip ALTER COLUMN trip_id SET DEFAULT nextval('public.trip_trip_id_seq'::regclass);


--
-- Name: trip_destination trip_destination_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip_destination ALTER COLUMN trip_destination_id SET DEFAULT nextval('public.trip_destination_trip_destination_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: accommodation_booking accommodation_booking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_booking
    ADD CONSTRAINT accommodation_booking_pkey PRIMARY KEY (accommodation_booking_id);


--
-- Name: accommodation accommodation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation
    ADD CONSTRAINT accommodation_pkey PRIMARY KEY (accommodation_id);


--
-- Name: accommodation_wishlist accommodation_wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_wishlist
    ADD CONSTRAINT accommodation_wishlist_pkey PRIMARY KEY (wishlist_id);


--
-- Name: accommodation_wishlist accommodation_wishlist_customer_item_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_wishlist
    ADD CONSTRAINT accommodation_wishlist_customer_item_key UNIQUE (customer_id, accommodation_id);


--
-- Name: agent agent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent
    ADD CONSTRAINT agent_pkey PRIMARY KEY (agent_id);


--
-- Name: airport airport_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.airport
    ADD CONSTRAINT airport_code_key UNIQUE (iata_code);


--
-- Name: airport airport_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.airport
    ADD CONSTRAINT airport_pkey PRIMARY KEY (airport_id);


--
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (booking_id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (customer_id);


--
-- Name: customer_preference customer_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_preference
    ADD CONSTRAINT customer_preference_pkey PRIMARY KEY (customer_preference_id);


--
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (destination_id);


--
-- Name: destination_type destination_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_type
    ADD CONSTRAINT destination_type_pkey PRIMARY KEY (destination_type_id);


--
-- Name: destination_wishlist destination_wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_wishlist
    ADD CONSTRAINT destination_wishlist_pkey PRIMARY KEY (wishlist_id);


--
-- Name: destination_wishlist destination_wishlist_customer_item_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_wishlist
    ADD CONSTRAINT destination_wishlist_customer_item_key UNIQUE (customer_id, destination_id);


--
-- Name: district district_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_pkey PRIMARY KEY (district_id);


--
-- Name: division division_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.division
    ADD CONSTRAINT division_pkey PRIMARY KEY (division_id);


--
-- Name: flight_booking flight_booking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight_booking
    ADD CONSTRAINT flight_booking_pkey PRIMARY KEY (flight_booking_id);


--
-- Name: flight flight_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_pkey PRIMARY KEY (flight_id);


--
-- Name: gifts_and_coupons gifts_and_coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gifts_and_coupons
    ADD CONSTRAINT gifts_and_coupons_pkey PRIMARY KEY (coupon_id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (location_id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (notification_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: place_type place_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.place_type
    ADD CONSTRAINT place_type_pkey PRIMARY KEY (place_type_id);


--
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (rating_id);


--
-- Name: rating rating_customer_item_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_customer_item_key UNIQUE (customer_id, item_type, item_id);


--
-- Name: restaurant_booking restaurant_booking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_booking
    ADD CONSTRAINT restaurant_booking_pkey PRIMARY KEY (restaurant_booking_id);


--
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (restaurant_id);


--
-- Name: restaurant_wishlist restaurant_wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_wishlist
    ADD CONSTRAINT restaurant_wishlist_pkey PRIMARY KEY (wishlist_id);


--
-- Name: restaurant_wishlist restaurant_wishlist_customer_item_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_wishlist
    ADD CONSTRAINT restaurant_wishlist_customer_item_key UNIQUE (customer_id, restaurant_id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- Name: trip_destination trip_destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip_destination
    ADD CONSTRAINT trip_destination_pkey PRIMARY KEY (trip_destination_id);


--
-- Name: trip trip_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip
    ADD CONSTRAINT trip_pkey PRIMARY KEY (trip_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: accommodation accommodation_delete_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER accommodation_delete_trigger AFTER DELETE ON public.accommodation FOR EACH ROW EXECUTE FUNCTION public.accommodation_delete_trigger_func();


--
-- Name: trip add_trip_count_and_discount; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER add_trip_count_and_discount AFTER UPDATE OF trip_status ON public.trip FOR EACH ROW EXECUTE FUNCTION public.add_trip_count_and_discount();


--
-- Name: destination destination_delete_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER destination_delete_trigger AFTER DELETE ON public.destination FOR EACH ROW EXECUTE FUNCTION public.destination_delete_trigger_func();


--
-- Name: flight flight_delete_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER flight_delete_trigger AFTER DELETE ON public.flight FOR EACH ROW EXECUTE FUNCTION public.flight_delete_trigger_func();


--
-- Name: booking notification_add_for_booking; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER notification_add_for_booking AFTER INSERT ON public.booking FOR EACH ROW EXECUTE FUNCTION public.notification_add_for_booking_func();


--
-- Name: trip notification_add_for_trip; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER notification_add_for_trip AFTER INSERT OR DELETE OR UPDATE ON public.trip FOR EACH ROW EXECUTE FUNCTION public.notification_add_for_trip_func();


--
-- Name: notification notification_created; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER notification_created AFTER INSERT ON public.notification FOR EACH ROW EXECUTE FUNCTION public.notify_notification_created();


--
-- Name: agent notify_agent_signup; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER notify_agent_signup AFTER UPDATE OF acc_status ON public.agent FOR EACH ROW EXECUTE FUNCTION public.notify_agent_signup_func();


--
-- Name: restaurant restaurant_delete_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER restaurant_delete_trigger AFTER DELETE ON public.restaurant FOR EACH ROW EXECUTE FUNCTION public.restaurant_delete_trigger_func();


--
-- Name: trip trip_delete_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trip_delete_trigger AFTER DELETE ON public.trip FOR EACH ROW EXECUTE FUNCTION public.trip_delete_trigger_func();


--
-- Name: accommodation_wishlist update_accommodation_wishlist; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_accommodation_wishlist AFTER INSERT OR DELETE ON public.accommodation_wishlist FOR EACH ROW EXECUTE FUNCTION public.update_accommodation_wishlist_func();


--
-- Name: destination_wishlist update_destination_wishlist; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_destination_wishlist AFTER INSERT OR DELETE ON public.destination_wishlist FOR EACH ROW EXECUTE FUNCTION public.update_destination_wishlist_func();


--
-- Name: restaurant_wishlist update_restaurant_wishlist; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_restaurant_wishlist AFTER INSERT OR DELETE ON public.restaurant_wishlist FOR EACH ROW EXECUTE FUNCTION public.update_restaurant_wishlist_func();


--
-- Name: booking update_total_cost; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_total_cost AFTER INSERT ON public.booking FOR EACH ROW EXECUTE FUNCTION public.update_total_cost_func();


--
-- Name: accommodation_booking accommodation_booking_accommodation_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_booking
    ADD CONSTRAINT accommodation_booking_accommodation_booking_id_fkey FOREIGN KEY (accommodation_booking_id) REFERENCES public.booking(booking_id) ON DELETE CASCADE;


--
-- Name: accommodation_booking accommodation_booking_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_booking
    ADD CONSTRAINT accommodation_booking_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodation(accommodation_id) ON DELETE CASCADE;


--
-- Name: accommodation accommodation_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation
    ADD CONSTRAINT accommodation_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON DELETE CASCADE;


--
-- Name: accommodation_wishlist accommodation_wishlist_accommodation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_wishlist
    ADD CONSTRAINT accommodation_wishlist_accommodation_id_fkey FOREIGN KEY (accommodation_id) REFERENCES public.accommodation(accommodation_id) ON DELETE CASCADE;


--
-- Name: accommodation_wishlist accommodation_wishlist_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accommodation_wishlist
    ADD CONSTRAINT accommodation_wishlist_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: agent agent_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent
    ADD CONSTRAINT agent_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: airport airport_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.airport
    ADD CONSTRAINT airport_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON DELETE CASCADE;


--
-- Name: booking booking_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trip(trip_id) ON DELETE CASCADE;


--
-- Name: customer customer_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: customer_preference customer_preference_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_preference
    ADD CONSTRAINT customer_preference_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: customer_preference customer_preference_preference_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_preference
    ADD CONSTRAINT customer_preference_preference_id_fkey FOREIGN KEY (preference_id) REFERENCES public.place_type(place_type_id) ON DELETE CASCADE;


--
-- Name: destination destination_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON DELETE CASCADE;


--
-- Name: destination_type destination_type_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_type
    ADD CONSTRAINT destination_type_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destination(destination_id) ON DELETE CASCADE;


--
-- Name: destination_type destination_type_place_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_type
    ADD CONSTRAINT destination_type_place_type_id_fkey FOREIGN KEY (place_type_id) REFERENCES public.place_type(place_type_id) ON DELETE CASCADE;


--
-- Name: destination_wishlist destination_wishlist_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_wishlist
    ADD CONSTRAINT destination_wishlist_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: destination_wishlist destination_wishlist_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_wishlist
    ADD CONSTRAINT destination_wishlist_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destination(destination_id) ON DELETE CASCADE;


--
-- Name: district district_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT district_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.division(division_id) ON DELETE CASCADE;


--
-- Name: notification fk_sender; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: flight flight_arrival_airport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_arrival_airport_id_fkey FOREIGN KEY (arrival_airport_id) REFERENCES public.airport(airport_id) ON DELETE CASCADE;


--
-- Name: flight_booking flight_booking_flight_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight_booking
    ADD CONSTRAINT flight_booking_flight_booking_id_fkey FOREIGN KEY (flight_booking_id) REFERENCES public.booking(booking_id) ON DELETE CASCADE;


--
-- Name: flight_booking flight_booking_flight_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight_booking
    ADD CONSTRAINT flight_booking_flight_id_fkey FOREIGN KEY (flight_id) REFERENCES public.flight(flight_id) ON DELETE CASCADE;


--
-- Name: flight flight_departure_airport_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flight
    ADD CONSTRAINT flight_departure_airport_id_fkey FOREIGN KEY (departure_airport_id) REFERENCES public.airport(airport_id) ON DELETE CASCADE;


--
-- Name: gifts_and_coupons gifts_and_coupons_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gifts_and_coupons
    ADD CONSTRAINT gifts_and_coupons_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: location location_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.district(district_id) ON DELETE CASCADE;


--
-- Name: notification notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: payment payment_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: payment payment_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trip(trip_id) ON DELETE CASCADE;


--
-- Name: rating rating_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: restaurant_booking restaurant_booking_restaurant_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_booking
    ADD CONSTRAINT restaurant_booking_restaurant_booking_id_fkey FOREIGN KEY (restaurant_booking_id) REFERENCES public.booking(booking_id) ON DELETE CASCADE;


--
-- Name: restaurant_booking restaurant_booking_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_booking
    ADD CONSTRAINT restaurant_booking_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id) ON DELETE CASCADE;


--
-- Name: restaurant restaurant_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON DELETE CASCADE;


--
-- Name: restaurant_wishlist restaurant_wishlist_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_wishlist
    ADD CONSTRAINT restaurant_wishlist_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: restaurant_wishlist restaurant_wishlist_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.restaurant_wishlist
    ADD CONSTRAINT restaurant_wishlist_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id) ON DELETE CASCADE;


--
-- Name: review review_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: trip trip_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip
    ADD CONSTRAINT trip_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agent(agent_id);


--
-- Name: trip trip_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip
    ADD CONSTRAINT trip_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id) ON DELETE CASCADE;


--
-- Name: trip_destination trip_destination_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip_destination
    ADD CONSTRAINT trip_destination_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destination(destination_id) ON DELETE CASCADE;


--
-- Name: trip_destination trip_destination_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trip_destination
    ADD CONSTRAINT trip_destination_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trip(trip_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict tNEAy2MRhpcFcUGoep6jaFzGNXWbQiFobqVgaziQs9vRbm964wyT9RClOjNQ26E

