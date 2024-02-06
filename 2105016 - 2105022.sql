Table creation commands:

--1. Users:
	CREATE TABLE Users (
		USER_ID NUMBER PRIMARY KEY,
		USERNAME VARCHAR2(50) UNIQUE NOT NULL,
		PASSWORD VARCHAR2(100),
		FIRST_NAME VARCHAR2(50),
		LAST_NAME VARCHAR2(50),
		USER_TYPE VARCHAR2(20),
		EMAIL VARCHAR2(50) CHECK(EMAIL LIKE '%@%.%')
	);

	
	CREATE SEQUENCE user_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;

	CREATE OR REPLACE TRIGGER user_id_trigger
	BEFORE INSERT ON Users
	FOR EACH ROW
	BEGIN
		SELECT user_id_sequence.NEXTVAL
		INTO :NEW.USER_ID
		FROM DUAL;
	END;
	/



	INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL)
	VALUES ('john_doe', 'password123', 'John', 'Doe', 'customer', 'john@example.com');

	INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL)
	VALUES ('jane_smith', 'pass1234', 'Jane', 'Smith', 'customer', 'jane@example.com');

	INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL)
	VALUES ('sam_jackson', 'sammy456', 'Sam', 'Jackson', 'customer', 'sam@example.com');

	INSERT INTO Users (USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, USER_TYPE, EMAIL)
	VALUES ('agent007', 'agentpass', 'James', 'Bond', 'agent', 'james@mi6.com');


--2. Customer
	CREATE TABLE Customer (
		customer_id NUMBER PRIMARY KEY,
		passport_number VARCHAR2(20) NOT NULL,
		preferred_language VARCHAR2(50),
		FOREIGN KEY (customer_id) REFERENCES Users(user_id) ON DELETE CASCADE
	);

	INSERT INTO Customer (USER_ID,PREFERENCES) VALUES (1,'Mountains,Lakes');
	INSERT INTO Customer (USER_ID,PREFERENCES) VALUES (2,'Mountains,Deserts');
	INSERT INTO Customer (USER_ID,PREFERENCES) VALUES (3,'Lakes,Beaches');

--3. Agent
	CREATE TABLE Agent (
		agent_id NUMBER PRIMARY KEY,
		experience_years NUMBER,
		fee NUMBER,
		working_area_id NUMBER,
		FOREIGN KEY (agent_id) REFERENCES Users(user_id) ON DELETE CASCADE,
		FOREIGN KEY (working_area_id) REFERENCES Destination(destination_id) ON DELETE CASCADE
	);
	
	INSERT INTO Agent (USER_ID,EXPERIENCE_YEARS,FEE) VALUES(4,5,10000);

--4. Destination
	CREATE TABLE Destination (
		destination_id NUMBER PRIMARY KEY,
		name VARCHAR2(255),
		Description VARCHAR2(1000),
		Attractions VARCHAR2(1000),
		Weather_info VARCHAR2(1000),
		Travel_Tips VARCHAR2(1000),
		image VARCHAR2(1000),
		rating NUMBER check(rating<=5),
		location_id NUMBER,
		map VARCHAR2(1000),
		FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE destination_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;

	CREATE OR REPLACE TRIGGER destination_id_trigger
    BEFORE INSERT ON Destination
    FOR EACH ROW
	BEGIN
		SELECT destination_id_sequence.NEXTVAL
		INTO :NEW.DESTINATION_ID
		FROM DUAL;
	END;
	/

--5. place_type
	CREATE TABLE Place_Type(
		PLACE_TYPE_ID NUMBER PRIMARY KEY,
		TYPE_NAME VARCHAR2(100)
	);

	CREATE SEQUENCE place_type_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;

	CREATE OR REPLACE TRIGGER place_type_id_trigger
    BEFORE INSERT ON Place_Type
    FOR EACH ROW
	BEGIN
		SELECT place_type_id_sequence.NEXTVAL
		INTO :NEW.PLACE_TYPE_ID
		FROM DUAL;
	END;
	/

--6. Customer_Preference
	CREATE TABLE Customer_Preference (
		customer_preference_id NUMBER PRIMARY KEY,
    	customer_id NUMBER,
		preference_id NUMBER,
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (PREFERENCE_ID) REFERENCES Place_Type(place_type_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE customer_preference_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;

	CREATE OR REPLACE TRIGGER customer_preference_id_trigger
	BEFORE INSERT ON Customer_Preference
	FOR EACH ROW
	BEGIN
		SELECT customer_preference_id_sequence.NEXTVAL
		INTO :NEW.CUSTOMER_PREFERENCE_ID
		FROM DUAL;
	END;
	/

--7. Destination_Type
	CREATE TABLE Destination_Type (
		destination_type_id NUMBER PRIMARY KEY,
		destination_id NUMBER,
		place_type_id NUMBER,
		FOREIGN KEY (destination_id) REFERENCES Destination(destination_id) ON DELETE CASCADE,
		FOREIGN KEY (place_type_id) REFERENCES Place_Type(place_type_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE destination_type_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;

	CREATE OR REPLACE TRIGGER destination_type_id_trigger
	BEFORE INSERT ON Destination_Type
	FOR EACH ROW
	BEGIN
		SELECT destination_type_id_sequence.NEXTVAL
		INTO :NEW.DESTINATION_TYPE_ID
		FROM DUAL;
	END;
	/

--8. Trip 
	CREATE TABLE Trip (
		trip_id NUMBER PRIMARY KEY,
		agent_id NUMBER,
		customer_id NUMBER,
		departure_date DATE,
		trip_duration NUMBER,
		total_cost NUMBER,
		discount NUMBER,
		FOREIGN KEY (agent_id) REFERENCES Agent(agent_id),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE trip_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER trip_id_trigger
    BEFORE INSERT ON Trip
    FOR EACH ROW
	BEGIN
		SELECT trip_id_sequence.NEXTVAL
		INTO :NEW.TRIP_ID
		FROM DUAL;
	END;
	/

--9. Booking
	CREATE TABLE Booking (
		booking_id NUMBER PRIMARY KEY,
		customer_id NUMBER,
		trip_id NUMBER,
		agent_id NUMBER,
		booking_date DATE,
		cost NUMBER,
		booking_type VARCHAR2(100),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE CASCADE,
		FOREIGN KEY (agent_id) REFERENCES Agent(agent_id)
	);

	CREATE SEQUENCE booking_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER booking_id_trigger
    BEFORE INSERT ON Booking
    FOR EACH ROW
	BEGIN
		SELECT booking_id_sequence.NEXTVAL
		INTO :NEW.BOOKING_ID
		FROM DUAL;
	END;
	/

--10. Trip_Destination
	CREATE TABLE Trip_Destination (
		trip_destination_id NUMBER PRIMARY KEY,
		trip_id NUMBER,
		destination_id NUMBER,
		FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE CASCADE,
		FOREIGN KEY (destination_id) REFERENCES Destination(destination_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE trip_destination_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;

	CREATE OR REPLACE TRIGGER trip_destination_id_trigger
	BEFORE INSERT ON Trip_Destination
	FOR EACH ROW
	BEGIN
		SELECT trip_destination_id_sequence.NEXTVAL
		INTO :NEW.TRIP_DESTINATION_ID
		FROM DUAL;
	END;
	/

--11. Accommodation
	CREATE TABLE Accommodation (
		accommodation_id NUMBER PRIMARY KEY,
		name VARCHAR2(200),
		rating NUMBER CHECK(rating<=5),
		room_capacity NUMBER,
		room_price NUMBER,
		accommodation_type VARCHAR2(100),
		location_id NUMBER,
		accommodation_class NUMBER,
		style VARCHAR2(100),
		free_wifi VARCHAR2(1),
		parking VARCHAR2(1),
		breakfast VARCHAR2(1),
		pool VARCHAR2(1),
		map VARCHAR2(1000),
		FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE accommodation_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER accommodation_id_trigger
    BEFORE INSERT ON Accommodation
    FOR EACH ROW
	BEGIN
		SELECT accommodation_id_sequence.NEXTVAL
		INTO :NEW.ACCOMMODATION_ID
		FROM DUAL;
	END;
	/

--12. Accommodation_Booking
	CREATE TABLE Accommodation_Booking (
		accommodation_booking_id NUMBER PRIMARY KEY,
		accommodation_id NUMBER,
		number_of_rooms NUMBER,
		check_in DATE,
		check_out DATE,
		FOREIGN KEY (accommodation_booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
		FOREIGN KEY (accommodation_id) REFERENCES Accommodation(accommodation_id) ON DELETE CASCADE
	);

--13. Transport
	CREATE TABLE Transport (
		transport_id NUMBER PRIMARY KEY,
		name VARCHAR2(200),
		rating NUMBER CHECK(rating<=5),
		ticket_price NUMBER,
		departure_location_id NUMBER,
		arrival_location_id NUMBER,
		departure_time INTERVAL DAY TO SECOND,
		transport_type VARCHAR2(100),
		FOREIGN KEY (departure_location_id) REFERENCES Location(location_id) ON DELETE CASCADE,
		FOREIGN KEY (arrival_location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE transport_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER transport_id_trigger
    BEFORE INSERT ON Transport
    FOR EACH ROW
	BEGIN
		SELECT transport_id_sequence.NEXTVAL
		INTO :NEW.TRANSPORT_ID
		FROM DUAL;
	END;
	/

--14. Transport_Booking
	CREATE TABLE Transport_Booking (
		transport_booking_id NUMBER PRIMARY KEY,
		transport_id NUMBER,
		departure_time INTERVAL DAY TO SECOND,
		departure_location VARCHAR2(100),
		number_of_seats NUMBER,
		FOREIGN KEY (transport_booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
		FOREIGN KEY (transport_id) REFERENCES Transport(transport_id) ON DELETE CASCADE
	);

--15. Flight
	CREATE TABLE Flight (
		flight_id NUMBER PRIMARY KEY,
		airline_name VARCHAR2(200),
		rating NUMBER CHECK(rating<=5),
		seat_class VARCHAR2(50),
		ticket_price NUMBER,
		departure_location_id NUMBER,
		arrival_location_id NUMBER,
		departure_time INTERVAL DAY TO SECOND,
		arrival_time INTERVAL DAY TO SECOND,
		FOREIGN KEY (departure_location_id) REFERENCES Location(location_id) ON DELETE CASCADE,
		FOREIGN KEY (arrival_location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE flight_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER flight_id_trigger
    BEFORE INSERT ON Flight
    FOR EACH ROW
	BEGIN
		SELECT flight_id_sequence.NEXTVAL
		INTO :NEW.FLIGHT_ID
		FROM DUAL;
	END;
	/

--16. Flight_Booking
	CREATE TABLE Flight_Booking (
		flight_booking_id NUMBER PRIMARY KEY,
		flight_id NUMBER,
		seat_class VARCHAR2(50),
		airline_name VARCHAR2(200),
		number_of_seats NUMBER,
		departure_time INTERVAL DAY TO SECOND,
		departure_location VARCHAR2(100),
		FOREIGN KEY (flight_booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
		FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE CASCADE
	);

--17. Restaurant
	CREATE TABLE Restaurant(
		restaurant_id NUMBER PRIMARY KEY,
		name VARCHAR2(150),
		location_id NUMBER,
		phone_number NUMBER check(LENGTH(phone_number)=11),
		cuisine_type VARCHAR2(100),
		restaurant_class VARCHAR2(100),
		price_range VARCHAR2(50),
		rating NUMBER check(rating<=5),
		map VARCHAR2(1000),
		FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE restaurant_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER restaurant_id_trigger
    BEFORE INSERT ON Restaurant
    FOR EACH ROW
	BEGIN
		SELECT restaurant_id_sequence.NEXTVAL
		INTO :NEW.RESTAURANT_ID
		FROM DUAL;
	END;
	/

--18. Restaurant_Booking
	CREATE TABLE Restaurant_Booking (
		restaurant_booking_id NUMBER PRIMARY KEY,
		restaurant_id NUMBER,
		seat_class VARCHAR2(50),
		number_of_seats NUMBER,
		arrival_time DATE,
		FOREIGN KEY (restaurant_booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
		FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE
	);

--19. Payment
	CREATE TABLE Payment (
		customer_id NUMBER,
		trip_id NUMBER,
		payment_type VARCHAR2(100),
		payment_status VARCHAR2(10),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE CASCADE
	);

--20. Feedback
	CREATE TABLE Feedback (
		customer_id NUMBER,
		trip_id NUMBER,
		review VARCHAR2(200),
		rating NUMBER CHECK(rating<=5),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE CASCADE
	);

--21. Gifts and Coupons
	CREATE TABLE Gifts_and_Coupons (
		coupon_id NUMBER PRIMARY KEY,
		customer_id NUMBER,
		discount NUMBER,
		category VARCHAR2(50),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE coupon_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER coupon_id_trigger
    BEFORE INSERT ON Gifts_and_Coupons
    FOR EACH ROW
	BEGIN
		SELECT coupon_id_sequence.NEXTVAL
		INTO :NEW.COUPON_ID
		FROM DUAL;
	END;
	/

--22. Division
	CREATE TABLE Division(
		division_id NUMBER PRIMARY KEY,
		division_name VARCHAR2(100)
	);

	CREATE SEQUENCE division_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER division_id_trigger
    BEFORE INSERT ON Division
    FOR EACH ROW
	BEGIN
		SELECT division_id_sequence.NEXTVAL
		INTO :NEW.DIVISION_ID
		FROM DUAL;
	END;
	/

--23. District
	CREATE TABLE District(
		district_id NUMBER PRIMARY KEY,
		district_name VARCHAR2(100),
		division_id NUMBER,
		FOREIGN KEY (division_id) REFERENCES Division(division_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE district_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER district_id_trigger
    BEFORE INSERT ON District
    FOR EACH ROW
	BEGIN
		SELECT district_id_sequence.NEXTVAL
		INTO :NEW.DISTRICT_ID
		FROM DUAL;
	END;
	/

--24. Location 
	CREATE TABLE Location(
		location_id NUMBER PRIMARY KEY,
		location_name VARCHAR2(100),
		district_id NUMBER,
		FOREIGN KEY (district_id) REFERENCES District(district_id) ON DELETE CASCADE
	);

	CREATE SEQUENCE location_id_sequence
		START WITH 1
		INCREMENT BY 1
		NOMAXVALUE;


	CREATE OR REPLACE TRIGGER location_id_trigger
    BEFORE INSERT ON Location
    FOR EACH ROW
	BEGIN
		SELECT location_id_sequence.NEXTVAL
		INTO :NEW.LOCATION_ID
		FROM DUAL;
	END;
	/