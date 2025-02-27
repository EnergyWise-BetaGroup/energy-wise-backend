DROP TABLE IF EXISTS registration_info;
DROP TABLE IF EXISTS appliances;
DROP TABLE IF EXISTS smart_meter_data;
DROP TABLE IF EXISTS co2_intensity;


CREATE TABLE registration_info
  (
    registration_id BIGINT, 
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(64) NOT NULL,
    house_size INTEGER, 
    postcode VARCHAR(7) NOT NULL,
    region VARCHAR(30) NOT NULL,
    provider VARCHAR(50),
    api_key VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    PRIMARY KEY(registration_id)
  );

  CREATE TABLE appliances 
  (
    appliance_id BIGINT GENERATED ALWAYS AS IDENTITY, 
    registration_id BIGINT,
    washing_machine BOOLEAN,
    dryer BOOLEAN,
    electric_vehicle BOOLEAN,
    laptops BOOLEAN,
    desktop_computer BOOLEAN,
    fridge BOOLEAN,
    freezer BOOLEAN,
    PRIMARY KEY (appliance_id)
  );

  CREATE TABLE smart_meter_data 
  (
    datatime_id BIGINT GENERATED ALWAYS AS IDENTITY,
    registration_id BIGINT,
    consumption FLOAT,
    cost float,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    PRIMARY KEY(datatime_id)
  );

  CREATE TABLE co2_intensity
  (
    co2_intensity_id BIGINT GENERATED ALWAYS AS IDENTITY,
    registration_id BIGINT,
    co2_start_datetime TIMESTAMP,
    co2_end_datetime TIMESTAMP,
    co2_intensity INTEGER,
    PRIMARY KEY(co2_intensity_id)
  );


-- update registration_info updated_at
CREATE OR REPLACE FUNCTION update_timestamp() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registration_info
BEFORE UPDATE ON registration_info
FOR EACH ROW 
EXECUTE FUNCTION update_timestamp();


INSERT INTO registration_info (registration_id, name, username, email, password, house_size, postcode, region, provider, api_key, created_at, updated_at) 
VALUES
(401, 'John Doe', 'johndoe', 'johndoe@example.com', 'hashedpassword1', 120, '1234567', 'England', 'Provider A', 'APIKEY12345', '2024-02-25 00:00:00', '2024-02-25 00:00:00'),
(402, 'Jane Smith', 'janesmith', 'janesmith@example.com', 'hashedpassword2', 95, '7654321', 'Scotland', 'Provider B', 'APIKEY67890', '2024-02-25 00:00:00', '2024-02-25 00:00:00');

INSERT INTO appliances (registration_id, washing_machine, dryer, electric_vehicle, laptops, desktop_computer, fridge, freezer) 
VALUES
(401, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE, FALSE),
(402, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, TRUE);


INSERT INTO co2_intensity (registration_id, co2_start_datetime, co2_end_datetime, co2_intensity) 
VALUES
(401, '2024-02-25 00:00:00', '2024-02-25 00:30:00', 215),
(401, '2024-02-25 00:30:00', '2024-02-25 01:00:00', 220),
(401, '2024-02-25 01:00:00', '2024-02-25 01:30:00', 212),
(401, '2024-02-25 01:30:00', '2024-02-25 02:00:00', 223),
(401, '2024-02-25 02:00:00', '2024-02-25 02:30:00', 229),
(401, '2024-02-25 02:30:00', '2024-02-25 03:00:00', 211),
(401, '2024-02-25 03:00:00', '2024-02-25 03:30:00', 214),
(401, '2024-02-25 03:30:00', '2024-02-25 04:00:00', 218),
(401, '2024-02-25 04:00:00', '2024-02-25 04:30:00', 221),
(401, '2024-02-25 04:30:00', '2024-02-25 05:00:00', 224),
(401, '2024-02-25 05:00:00', '2024-02-25 05:30:00', 217),
(401, '2024-02-25 05:30:00', '2024-02-25 06:00:00', 213),
(401, '2024-02-25 06:00:00', '2024-02-25 06:30:00', 225),
(401, '2024-02-25 06:30:00', '2024-02-25 07:00:00', 232),
(401, '2024-02-25 07:00:00', '2024-02-25 07:30:00', 234),
(401, '2024-02-25 07:30:00', '2024-02-25 08:00:00', 220),
(401, '2024-02-25 08:00:00', '2024-02-25 08:30:00', 216),
(401, '2024-02-25 08:30:00', '2024-02-25 09:00:00', 228),
(401, '2024-02-25 09:00:00', '2024-02-25 09:30:00', 230),
(401, '2024-02-25 09:30:00', '2024-02-25 10:00:00', 212),
(401, '2024-02-25 10:00:00', '2024-02-25 10:30:00', 224),
(401, '2024-02-25 10:30:00', '2024-02-25 11:00:00', 231),
(401, '2024-02-25 11:00:00', '2024-02-25 11:30:00', 215),
(401, '2024-02-25 11:30:00', '2024-02-25 12:00:00', 222),
(401, '2024-02-25 12:00:00', '2024-02-25 12:30:00', 226),
(401, '2024-02-25 12:30:00', '2024-02-25 13:00:00', 220),
(401, '2024-02-25 13:00:00', '2024-02-25 13:30:00', 229),
(401, '2024-02-25 13:30:00', '2024-02-25 14:00:00', 233),
(401, '2024-02-25 14:00:00', '2024-02-25 14:30:00', 221),
(401, '2024-02-25 14:30:00', '2024-02-25 15:00:00', 227),
(401, '2024-02-25 15:00:00', '2024-02-25 15:30:00', 212),
(401, '2024-02-25 15:30:00', '2024-02-25 16:00:00', 218),
(401, '2024-02-25 16:00:00', '2024-02-25 16:30:00', 224),
(401, '2024-02-25 16:30:00', '2024-02-25 17:00:00', 220),
(401, '2024-02-25 17:00:00', '2024-02-25 17:30:00', 230),
(401, '2024-02-25 17:30:00', '2024-02-25 18:00:00', 221),
(401, '2024-02-25 18:00:00', '2024-02-25 18:30:00', 225),
(401, '2024-02-25 18:30:00', '2024-02-25 19:00:00', 234),
(401, '2024-02-25 19:00:00', '2024-02-25 19:30:00', 232),
(401, '2024-02-25 19:30:00', '2024-02-25 20:00:00', 218),
(401, '2024-02-25 20:00:00', '2024-02-25 20:30:00', 226),
(401, '2024-02-25 20:30:00', '2024-02-25 21:00:00', 224),
(401, '2024-02-25 21:00:00', '2024-02-25 21:30:00', 222),
(401, '2024-02-25 21:30:00', '2024-02-25 22:00:00', 220),
(401, '2024-02-25 22:00:00', '2024-02-25 22:30:00', 225),
(401, '2024-02-25 22:30:00', '2024-02-25 23:00:00', 233),
(401, '2024-02-25 23:00:00', '2024-02-25 23:30:00', 221),
(402, '2024-02-26 00:00:00', '2024-02-26 00:30:00', 205),
(402, '2024-02-26 00:30:00', '2024-02-26 01:00:00', 198),
(402, '2024-02-26 01:00:00', '2024-02-26 01:30:00', 203),
(402, '2024-02-26 01:30:00', '2024-02-26 02:00:00', 211),
(402, '2024-02-26 02:00:00', '2024-02-26 02:30:00', 200),
(402, '2024-02-26 02:30:00', '2024-02-26 03:00:00', 202),
(402, '2024-02-26 03:00:00', '2024-02-26 03:30:00', 210),
(402, '2024-02-26 03:30:00', '2024-02-26 04:00:00', 204),
(402, '2024-02-26 04:00:00', '2024-02-26 04:30:00', 199),
(402, '2024-02-26 04:30:00', '2024-02-26 05:00:00', 208),
(402, '2024-02-26 05:00:00', '2024-02-26 05:30:00', 207),
(402, '2024-02-26 05:30:00', '2024-02-26 06:00:00', 201),
(402, '2024-02-26 06:00:00', '2024-02-26 06:30:00', 206),
(402, '2024-02-26 06:30:00', '2024-02-26 07:00:00', 210),
(402, '2024-02-26 07:00:00', '2024-02-26 07:30:00', 202),
(402, '2024-02-26 07:30:00', '2024-02-26 08:00:00', 207),
(402, '2024-02-26 08:00:00', '2024-02-26 08:30:00', 211),
(402, '2024-02-26 08:30:00', '2024-02-26 09:00:00', 208),
(402, '2024-02-26 09:00:00', '2024-02-26 09:30:00', 203),
(402, '2024-02-26 09:30:00', '2024-02-26 10:00:00', 202),
(402, '2024-02-26 10:00:00', '2024-02-26 10:30:00', 211),
(402, '2024-02-26 10:30:00', '2024-02-26 11:00:00', 207),
(402, '2024-02-26 11:00:00', '2024-02-26 11:30:00', 209),
(402, '2024-02-26 11:30:00', '2024-02-26 12:00:00', 205),
(402, '2024-02-26 12:00:00', '2024-02-26 12:30:00', 210),
(402, '2024-02-26 12:30:00', '2024-02-26 13:00:00', 202),
(402, '2024-02-26 13:00:00', '2024-02-26 13:30:00', 207),
(402, '2024-02-26 13:30:00', '2024-02-26 14:00:00', 211),
(402, '2024-02-26 14:00:00', '2024-02-26 14:30:00', 202),
(402, '2024-02-26 14:30:00', '2024-02-26 15:00:00', 203),
(402, '2024-02-26 15:00:00', '2024-02-26 15:30:00', 206),
(402, '2024-02-26 15:30:00', '2024-02-26 16:00:00', 209),
(402, '2024-02-26 16:00:00', '2024-02-26 16:30:00', 207),
(402, '2024-02-26 16:30:00', '2024-02-26 17:00:00', 202),
(402, '2024-02-26 17:00:00', '2024-02-26 17:30:00', 211),
(402, '2024-02-26 17:30:00', '2024-02-26 18:00:00', 210),
(402, '2024-02-26 18:00:00', '2024-02-26 18:30:00', 207),
(402, '2024-02-26 18:30:00', '2024-02-26 19:00:00', 206),
(402, '2024-02-26 19:00:00', '2024-02-26 19:30:00', 209),
(402, '2024-02-26 19:30:00', '2024-02-26 20:00:00', 202),
(402, '2024-02-26 20:00:00', '2024-02-26 20:30:00', 204),
(402, '2024-02-26 20:30:00', '2024-02-26 21:00:00', 211),
(402, '2024-02-26 21:00:00', '2024-02-26 21:30:00', 202),
(402, '2024-02-26 21:30:00', '2024-02-26 22:00:00', 209),
(402, '2024-02-26 22:00:00', '2024-02-26 22:30:00', 205),
(402, '2024-02-26 22:30:00', '2024-02-26 23:00:00', 203),
(402, '2024-02-26 23:00:00', '2024-02-26 23:30:00', 210);



INSERT INTO smart_meter_data (registration_id, consumption, cost, start_datetime, end_datetime)
VALUES
(401, 1.23, 18.75, '2024-02-25 00:00:00', '2024-02-25 00:30:00'),
(401, 0.87, 19.33, '2024-02-25 00:30:00', '2024-02-25 01:00:00'),
(401, 0.91, 14.28, '2024-02-25 01:00:00', '2024-02-25 01:30:00'),
(401, 1.07, 9.44, '2024-02-25 01:30:00', '2024-02-25 02:00:00'),
(401, 0.52, 15.68, '2024-02-25 02:00:00', '2024-02-25 02:30:00'),
(401, 1.33, 12.81, '2024-02-25 02:30:00', '2024-02-25 03:00:00'),
(401, 1.12, 6.80, '2024-02-25 03:00:00', '2024-02-25 03:30:00'),
(401, 0.98, 17.24, '2024-02-25 03:30:00', '2024-02-25 04:00:00'),
(401, 0.65, 8.67, '2024-02-25 04:00:00', '2024-02-25 04:30:00'),
(401, 1.09, 11.51, '2024-02-25 04:30:00', '2024-02-25 05:00:00'),
(401, 1.13, 13.14, '2024-02-25 05:00:00', '2024-02-25 05:30:00'),
(401, 1.18, 5.62, '2024-02-25 05:30:00', '2024-02-25 06:00:00'),
(401, 1.21, 7.80, '2024-02-25 06:00:00', '2024-02-25 06:30:00'),
(401, 0.99, 17.11, '2024-02-25 06:30:00', '2024-02-25 07:00:00'),
(401, 1.29, 9.04, '2024-02-25 07:00:00', '2024-02-25 07:30:00'),
(401, 1.06, 8.95, '2024-02-25 07:30:00', '2024-02-25 08:00:00'),
(401, 1.30, 10.12, '2024-02-25 08:00:00', '2024-02-25 08:30:00'),
(401, 1.19, 13.23, '2024-02-25 08:30:00', '2024-02-25 09:00:00'),
(401, 1.07, 6.11, '2024-02-25 09:00:00', '2024-02-25 09:30:00'),
(401, 0.88, 12.75, '2024-02-25 09:30:00', '2024-02-25 10:00:00'),
(401, 0.90, 15.42, '2024-02-25 10:00:00', '2024-02-25 10:30:00'),
(401, 1.00, 19.26, '2024-02-25 10:30:00', '2024-02-25 11:00:00'),
(401, 1.11, 11.79, '2024-02-25 11:00:00', '2024-02-25 11:30:00'),
(401, 1.14, 22.11, '2024-02-25 11:30:00', '2024-02-25 12:00:00'),
(401, 1.12, 16.42, '2024-02-25 12:00:00', '2024-02-25 12:30:00'),
(401, 0.95, 10.91, '2024-02-25 12:30:00', '2024-02-25 13:00:00'),
(401, 1.22, 9.33, '2024-02-25 13:00:00', '2024-02-25 13:30:00'),
(401, 1.28, 6.99, '2024-02-25 13:30:00', '2024-02-25 14:00:00'),
(401, 1.05, 11.20, '2024-02-25 14:00:00', '2024-02-25 14:30:00'),
(401, 1.09, 13.42, '2024-02-25 14:30:00', '2024-02-25 15:00:00'),
(401, 1.13, 7.88, '2024-02-25 15:00:00', '2024-02-25 15:30:00'),
(401, 1.18, 17.51, '2024-02-25 15:30:00', '2024-02-25 16:00:00'),
(401, 0.97, 8.47, '2024-02-25 16:00:00', '2024-02-25 16:30:00'),
(401, 1.31, 18.85, '2024-02-25 16:30:00', '2024-02-25 17:00:00'),
(401, 1.14, 14.75, '2024-02-25 17:00:00', '2024-02-25 17:30:00'),
(401, 1.19, 7.04, '2024-02-25 17:30:00', '2024-02-25 18:00:00'),
(401, 1.28, 20.92, '2024-02-25 18:00:00', '2024-02-25 18:30:00'),
(401, 1.00, 8.99, '2024-02-25 18:30:00', '2024-02-25 19:00:00'),
(401, 1.20, 6.55, '2024-02-25 19:00:00', '2024-02-25 19:30:00'),
(401, 1.06, 12.42, '2024-02-25 19:30:00', '2024-02-25 20:00:00'),
(401, 1.09, 10.88, '2024-02-25 20:00:00', '2024-02-25 20:30:00'),
(401, 1.14, 15.73, '2024-02-25 20:30:00', '2024-02-25 21:00:00'),
(401, 1.17, 6.99, '2024-02-25 21:00:00', '2024-02-25 21:30:00'),
(401, 1.13, 9.77, '2024-02-25 21:30:00', '2024-02-25 22:00:00'),
(401, 1.10, 13.62, '2024-02-25 22:00:00', '2024-02-25 22:30:00'),
(401, 1.02, 10.92, '2024-02-25 22:30:00', '2024-02-25 23:00:00'),
(401, 0.96, 18.14, '2024-02-25 23:00:00', '2024-02-25 23:30:00'),
(402, 0.82, 20.76, '2024-02-26 00:00:00', '2024-02-26 00:30:00'),
(402, 0.90, 14.31, '2024-02-26 00:30:00', '2024-02-26 01:00:00'),
(402, 1.23, 19.72, '2024-02-26 01:00:00', '2024-02-26 01:30:00'),
(402, 1.01, 16.34, '2024-02-26 01:30:00', '2024-02-26 02:00:00'),
(402, 0.75, 22.05, '2024-02-26 02:00:00', '2024-02-26 02:30:00'),
(402, 0.85, 9.93, '2024-02-26 02:30:00', '2024-02-26 03:00:00'),
(402, 1.10, 13.50, '2024-02-26 03:00:00', '2024-02-26 03:30:00'),
(402, 0.94, 18.64, '2024-02-26 03:30:00', '2024-02-26 04:00:00'),
(402, 1.05, 7.45, '2024-02-26 04:00:00', '2024-02-26 04:30:00'),
(402, 0.99, 14.92, '2024-02-26 04:30:00', '2024-02-26 05:00:00'),
(402, 1.23, 12.76, '2024-02-26 05:00:00', '2024-02-26 05:30:00'),
(402, 1.04, 18.50, '2024-02-26 05:30:00', '2024-02-26 06:00:00'),
(402, 1.07, 10.92, '2024-02-26 06:00:00', '2024-02-26 06:30:00'),
(402, 1.01, 19.48, '2024-02-26 06:30:00', '2024-02-26 07:00:00'),
(402, 1.23, 16.99, '2024-02-26 07:00:00', '2024-02-26 07:30:00'),
(402, 1.12, 14.50, '2024-02-26 07:30:00', '2024-02-26 08:00:00'),
(402, 1.00, 7.10, '2024-02-26 08:00:00', '2024-02-26 08:30:00'),
(402, 0.88, 15.50, '2024-02-26 08:30:00', '2024-02-26 09:00:00'),
(402, 0.99, 16.10, '2024-02-26 09:00:00', '2024-02-26 09:30:00'),
(402, 1.02, 12.87, '2024-02-26 09:30:00', '2024-02-26 10:00:00'),
(402, 1.15, 8.33, '2024-02-26 10:00:00', '2024-02-26 10:30:00'),
(402, 1.10, 9.48, '2024-02-26 10:30:00', '2024-02-26 11:00:00'),
(402, 1.05, 19.70, '2024-02-26 11:00:00', '2024-02-26 11:30:00'),
(402, 1.00, 6.80, '2024-02-26 11:30:00', '2024-02-26 12:00:00'),
(402, 1.08, 12.50, '2024-02-26 12:00:00', '2024-02-26 12:30:00'),
(402, 1.10, 14.80, '2024-02-26 12:30:00', '2024-02-26 13:00:00'),
(402, 0.95, 9.20, '2024-02-26 13:00:00', '2024-02-26 13:30:00'),
(402, 0.98, 10.40, '2024-02-26 13:30:00', '2024-02-26 14:00:00'),
(402, 1.15, 11.60, '2024-02-26 14:00:00', '2024-02-26 14:30:00'),
(402, 1.12, 7.00, '2024-02-26 14:30:00', '2024-02-26 15:00:00'),
(402, 1.10, 12.75, '2024-02-26 15:00:00', '2024-02-26 15:30:00'),
(402, 1.08, 16.50, '2024-02-26 15:30:00', '2024-02-26 16:00:00'),
(402, 1.01, 18.70, '2024-02-26 16:00:00', '2024-02-26 16:30:00'),
(402, 0.95, 15.80, '2024-02-26 16:30:00', '2024-02-26 17:00:00'),
(402, 0.91, 6.90, '2024-02-26 17:00:00', '2024-02-26 17:30:00'),
(402, 1.10, 11.95, '2024-02-26 17:30:00', '2024-02-26 18:00:00'),
(402, 1.12, 7.15, '2024-02-26 18:00:00', '2024-02-26 18:30:00'),
(402, 1.03, 10.30, '2024-02-26 18:30:00', '2024-02-26 19:00:00'),
(402, 1.05, 9.50, '2024-02-26 19:00:00', '2024-02-26 19:30:00'),
(402, 1.07, 12.70, '2024-02-26 19:30:00', '2024-02-26 20:00:00'),
(402, 1.00, 8.20, '2024-02-26 20:00:00', '2024-02-26 20:30:00'),
(402, 1.12, 11.50, '2024-02-26 20:30:00', '2024-02-26 21:00:00'),
(402, 0.98, 9.60, '2024-02-26 21:00:00', '2024-02-26 21:30:00'),
(402, 1.04, 14.00, '2024-02-26 21:30:00', '2024-02-26 22:00:00'),
(402, 0.90, 6.70, '2024-02-26 22:00:00', '2024-02-26 22:30:00'),
(402, 0.95, 7.90, '2024-02-26 22:30:00', '2024-02-26 23:00:00'),
(402, 0.89, 8.10, '2024-02-26 23:00:00', '2024-02-26 23:30:00');