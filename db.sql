Table creation commands:

--1. Users:
	CREATE TABLE Users (
		USER_ID SERIAL PRIMARY KEY,
		USERNAME VARCHAR(50) UNIQUE NOT NULL,
		PASSWORD VARCHAR(100),
		FIRST_NAME VARCHAR(50),
		LAST_NAME VARCHAR(50),
		USER_TYPE VARCHAR(20),
		EMAIL VARCHAR(50) CHECK(EMAIL LIKE '%@%.%')
	);

--2. Customer
	CREATE TABLE Customer (
		customer_id SERIAL PRIMARY KEY,
		passport_number VARCHAR(20) NOT NULL,
		trip_booked INTEGER,
		FOREIGN KEY (customer_id) REFERENCES Users(user_id) ON DELETE CASCADE
	);

--3. Agent
	CREATE TABLE Agent (
		agent_id SERIAL PRIMARY KEY,
		experience_years INTEGER,
		fee INTEGER,
		acc_status VARCHAR(20),
		FOREIGN KEY (agent_id) REFERENCES Users(user_id) ON DELETE CASCADE
	);

--4. Destination
	CREATE TABLE Destination (
		destination_id SERIAL PRIMARY KEY,
		name VARCHAR(255),
		Description VARCHAR(1000),
		Attractions VARCHAR(1000),
		Weather_info VARCHAR(1000),
		Travel_Tips VARCHAR(1000),
		image VARCHAR(1000),
		rating NUMERIC(2, 1) check(rating>=0 and rating<=5),
		location_id INTEGER,
		map VARCHAR(1000),
		image1 VARCHAR(1000),
		image2 VARCHAR(1000),
		image3 VARCHAR(1000),
		FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

--5. place_type
	CREATE TABLE Place_Type(
		PLACE_TYPE_ID SERIAL PRIMARY KEY,
		TYPE_NAME VARCHAR(100)
	);

--6. Customer_Preference
	CREATE TABLE Customer_Preference (
		customer_preference_id SERIAL PRIMARY KEY,
    	customer_id INTEGER,
		preference_id INTEGER,
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (PREFERENCE_ID) REFERENCES Place_Type(place_type_id) ON DELETE CASCADE
	);

--7. Destination_Type
	CREATE TABLE Destination_Type (
		destination_type_id SERIAL PRIMARY KEY,
		destination_id INTEGER,
		place_type_id INTEGER,
		FOREIGN KEY (destination_id) REFERENCES Destination(destination_id) ON DELETE CASCADE,
		FOREIGN KEY (place_type_id) REFERENCES Place_Type(place_type_id) ON DELETE CASCADE
	);

--8. Trip 
	CREATE TABLE Trip (
		trip_id SERIAL PRIMARY KEY,
		agent_id INTEGER,
		customer_id INTEGER,
		name VARCHAR(255),
		departure_date DATE,
		return_date DATE,
		total_cost INTEGER,
		discount NUMERIC(2,1),
		rating NUMERIC(2,1) CHECK(rating<=5),
		trip_status VARCHAR(15) CHECK(trip_status IN ('UPDATING', 'REQUESTING', 'CONFIRMED', 'COMPLETED')),
		FOREIGN KEY (agent_id) REFERENCES Agent(agent_id),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
	);

--9. Booking
	CREATE TABLE Booking (
		booking_id SERIAL PRIMARY KEY,
		trip_id INTEGER,
		cost INTEGER,
		booking_type VARCHAR(100),
		booking_date DATE,	
		FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE CASCADE
	);

--10. Trip_Destination
	CREATE TABLE Trip_Destination (
		trip_destination_id SERIAL PRIMARY KEY,
		trip_id INTEGER,
		destination_id INTEGER,
		departure_date DATE,
		return_date DATE,
		FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE CASCADE,
		FOREIGN KEY (destination_id) REFERENCES Destination(destination_id) ON DELETE CASCADE
	);

--11. Accommodation
	CREATE TABLE Accommodation (
		accommodation_id SERIAL PRIMARY KEY,
		name VARCHAR(200),
		rating NUMERIC(2,1) CHECK(rating>=0 and rating<=5),
		room_capacity INTEGER,
		room_price INTEGER,
		accommodation_type VARCHAR(100),
		location_id INTEGER,
		accommodation_class INTEGER CHECK(accommodation_class<=7),
		style VARCHAR(100),
		free_wifi VARCHAR(1),
		parking VARCHAR(1),
		breakfast VARCHAR(1),
		pool VARCHAR(1),
		accessibility VARCHAR(1),
		map VARCHAR(1000),
		image VARCHAR(1000),
		image1 VARCHAR(1000),
		image2 VARCHAR(1000),
		image3 VARCHAR(1000),
		address VARCHAR(300),
		description VARCHAR(1000),
		phone_number VARCHAR(11) CHECK (REGEXP_LIKE(phone_number, '^\d{11}$')),
		facebook VARCHAR(1000),
		website VARCHAR(1000),
		email VARCHAR(50) CHECK(email LIKE '%@%.%'),
		FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

--12. Accommodation_Booking
	CREATE TABLE Accommodation_Booking (
		accommodation_booking_id SERIAL PRIMARY KEY,
		accommodation_id INTEGER,
		number_of_rooms INTEGER,
		check_in TIMESTAMP,
		check_out TIMESTAMP,
		FOREIGN KEY (accommodation_booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
		FOREIGN KEY (accommodation_id) REFERENCES Accommodation(accommodation_id) ON DELETE CASCADE
	);

--13. Flight
	CREATE TABLE Flight (
		flight_id SERIAL PRIMARY KEY,
		airline_name VARCHAR(200),
		departure_airport_id INTEGER,
		arrival_airport_id INTEGER,
		economy_seat_price INTEGER,
		business_seat_price INTEGER,
		first_seat_price INTEGER,
		departure_time TIMESTAMP,
		arrival_time TIMESTAMP,
		image VARCHAR(1000),
		flight_style VARCHAR(100) CHECK(flight_style IN ('One Way', 'Round Trip')),
		return_departure_time TIMESTAMP,
		return_arrival_time TIMESTAMP,
		FOREIGN KEY (departure_airport_id) REFERENCES Airport(airport_id) ON DELETE CASCADE,
		FOREIGN KEY (arrival_airport_id) REFERENCES Airport(airport_id) ON DELETE CASCADE
	);

--14. Flight_Booking
	CREATE TABLE Flight_Booking (
		flight_booking_id SERIAL PRIMARY KEY,
		flight_id INTEGER,
		number_of_seats INTEGER,
		seat_class VARCHAR(50),
		flight_style VARCHAR(15) CHECK(flight_style IN ('One Way', 'Round Trip')),
		departure_at TIMESTAMP,
		arrival_at TIMESTAMP,
		FOREIGN KEY (flight_booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
		FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE CASCADE
	);

--15. Restaurant
	CREATE TABLE Restaurant(
		restaurant_id SERIAL PRIMARY KEY,
		name VARCHAR(150),
		cuisine_type VARCHAR(100),
		rating NUMERIC(2,1) check(rating>=0 and rating<=5),
		location_id INTEGER,
		map VARCHAR(1000),
		restaurant_class INTEGER CHECK(restaurant_class<=7),
		image VARCHAR(1000),
		image1 VARCHAR(1000),
		image2 VARCHAR(1000),
		image3 VARCHAR(1000),
		phone_number VARCHAR(11) CHECK (REGEXP_LIKE(phone_number, '^\d{11}$')),
		address VARCHAR(300),
		facebook VARCHAR(1000),
		website VARCHAR(1000),
		email VARCHAR(50) CHECK(email LIKE '%@%.%'),
		free_wifi VARCHAR(1),
		accessible VARCHAR(1),
		delivery VARCHAR(1),
		dine_in VARCHAR(1),
		takeaway VARCHAR(1),
		parking VARCHAR(1),
		price_range VARCHAR(5),
		booking_cost INTEGER,
		FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

--16. Restaurant_Booking
	CREATE TABLE Restaurant_Booking (
		restaurant_booking_id SERIAL PRIMARY KEY,
		restaurant_id INTEGER,
		number_of_seats INTEGER,
		arrival_time TIMESTAMP,
		departure_time TIMESTAMP,
		booking_date DATE,
		FOREIGN KEY (restaurant_booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
		FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE
	);

--17. Payment
	CREATE TABLE Payment (
		payment_id SERIAL PRIMARY KEY,
		customer_id INTEGER,
		trip_id INTEGER,
		payment_type VARCHAR(100),
		payment_status VARCHAR(10) CHECK (payment_status IN ('PENDING', 'PAID')),
		account_id VARCHAR(20),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (trip_id) REFERENCES Trip(trip_id) ON DELETE CASCADE
	);

--18. Gifts and Coupons
	CREATE TABLE Gifts_and_Coupons (
		coupon_id SERIAL PRIMARY KEY,
		customer_id INTEGER,
		discount NUMERIC(3,1),
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
	);

--19. Division
	CREATE TABLE Division(
		division_id SERIAL PRIMARY KEY,
		division_name VARCHAR(100)
	);

--20. District
	CREATE TABLE District(
		district_id SERIAL PRIMARY KEY,
		district_name VARCHAR(100),
		division_id INTEGER,
		FOREIGN KEY (division_id) REFERENCES Division(division_id) ON DELETE CASCADE
	);

--21. Location 
	CREATE TABLE Location(
		location_id SERIAL PRIMARY KEY,
		location_name VARCHAR(100),
		district_id INTEGER,
		FOREIGN KEY (district_id) REFERENCES District(district_id) ON DELETE CASCADE
	);

--22. Airport
	CREATE TABLE Airport(
		airport_id SERIAL PRIMARY KEY,
		name VARCHAR(100),
		code VARCHAR(5) UNIQUE,
		location_id INTEGER,
		FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
	);

--23. Rating
	CREATE TABLE Rating(
		rating_id SERIAL PRIMARY KEY,
		customer_id INTEGER,
		rating NUMERIC(2,1) CHECK(rating>=0 and rating<=5),
		item_type VARCHAR(20),
		item_id INTEGER,
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
	);

--24. Review
	CREATE TABLE Review(
		review_id SERIAL PRIMARY KEY,
		customer_id INTEGER,
		rating INTEGER CHECK(rating>=0 and rating<=5),
		item_type VARCHAR(20),
		item_id INTEGER,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
	);

--25. Notification
	CREATE TABLE Notification(
		notification_id SERIAL PRIMARY KEY,
		user_id INTEGER,
		sender_id INTEGER,
		content VARCHAR(1000),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		notification_status VARCHAR(20) CHECK (notification_status IN ('SHOWED', 'NOT SHOWED')),
		FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
		FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE
	);

--26. Destination_Wishlist
	CREATE TABLE Destination_Wishlist(
		wishlist_id SERIAL PRIMARY KEY,
		customer_id INTEGER,
		destination_id INTEGER,
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (destination_id) REFERENCES Destination(destination_id) ON DELETE CASCADE
	);

--27. Accommodation_Wishlist
	CREATE TABLE Accommodation_Wishlist(
		wishlist_id SERIAL PRIMARY KEY,
		customer_id INTEGER,
		accommodation_id INTEGER,
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (accommodation_id) REFERENCES Accommodation(accommodation_id) ON DELETE CASCADE
	);

--28. Restaurant_Wishlist
	CREATE TABLE Restaurant_Wishlist(
		wishlist_id SERIAL PRIMARY KEY,
		customer_id INTEGER,
		restaurant_id INTEGER,
		FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
		FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE
	);