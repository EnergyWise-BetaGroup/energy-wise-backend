DROP TABLE IF EXISTS registration_info;
DROP TABLE IF EXISTS appliances;
DROP TABLE IF EXISTS smart_meter_data;
DROP TABLE IF EXISTS co2_intensity;
DROP TABLE IF EXISTS user_CO2_intensity;


CREATE TABLE registration_info
  (
    registration_id BIGINT GENERATED ALWAYS AS IDENTITY, 
    account_number VARCHAR(30) ,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(64) NOT NULL,
    house_size INTEGER, 
    postcode VARCHAR(7) NOT NULL,
    region VARCHAR(30) NOT NULL,
    provider VARCHAR(50),
    api_key VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, --need to be changed 
    PRIMARY KEY(registration_id)
  );

  CREATE TABLE appliances 
  (
    appliance_id BIGINT GENERATED ALWAYS AS IDENTITY, 
    registration_id INTEGER,
    washing_machine BOOLEAN,
    dryer BOOLEAN,
    electric_vehicle BOOLEAN,
    laptops BOOLEAN,
    desktop_laptop BOOLEAN,
    fridge BOOLEAN,
    freezer BOOLEAN,
    PRIMARY KEY (appliance_id)
  );

  CREATE TABLE smart_meter_data 
  (
    datatime_id BIGINT GENERATED ALWAYS AS IDENTITY,
    registration_id INTEGER,
    consumption FLOAT,
    cost float,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    PRIMARY KEY(datatime_id)
  );

  CREATE TABLE co2_intensity
  (
    co2_intensity_id BIGINT GENERATED ALWAYS AS IDENTITY,
    registration_id INTEGER,
    co2_datetime TIMESTAMP,
    co2_intensity INTEGER,
    PRIMARY KEY(CO2_intensity_id)
  );

  CREATE TABLE user_CO2_intensity 
  (
    CO2_intensity_id BIGINT GENERATED ALWAYS AS IDENTITY,
    registration_id INTEGER,
    smart_meter_datetime TIMESTAMP,
    co2_datetime TIMESTAMP,
    total_consumption FLOAT,
    co2_intensity INTEGER,
    CO2_emission FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (CO2_intensity_id)
  );



-- user co2 intensity triggers
CREATE OR REPLACE FUNCTION auto_insert1() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_CO2_intensity (registration_id, smart_meter_datetime, total_consumption)
    VALUES (NEW.registration_id, NEW.start_datetime, NEW.consumption);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_insert_smart_data
AFTER INSERT ON smart_meter_data
FOR EACH ROW 
EXECUTE FUNCTION auto_insert1();


CREATE OR REPLACE FUNCTION auto_insert2() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_CO2_intensity
    SET co2_datetime = NEW.co2_datetime, 
        co2_intensity = NEW.co2_intensity,
        CO2_emission = total_consumption * (NEW.co2_intensity / 1000.0)
    WHERE registration_id = NEW.registration_id
    AND DATE_TRUNC('minute', smart_meter_datetime) = DATE_TRUNC('minute', NEW.co2_datetime AT TIME ZONE 'UTC');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER after_insert_co2_intensity
AFTER INSERT ON co2_intensity
FOR EACH ROW 
EXECUTE FUNCTION auto_insert2();


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



INSERT INTO smart_meter_data  (registration_id, consumption, cost, start_datetime, end_datetime)
VALUES 
(1, 0.082000,	1.97,	'2024-12-01T00:00:00+00:00',	'2024-12-01T00:30:00+00:00'),
(1, 0.081000,	1.94,	'2024-12-01T00:30:00+00:00',	'2024-12-01T01:00:00+00:00'),
(1, 0.658000,	15.80,	'2024-12-01T01:00:00+00:00',	'2024-12-01T01:30:00+00:00'),
(1, 0.065000,	1.56,	'2024-12-01T01:30:00+00:00',	'2024-12-01T02:00:00+00:00'),
(1, 0.065000,	1.56,	'2024-12-01T02:00:00+00:00',	'2024-12-01T02:30:00+00:00'); 


INSERT INTO co2_intensity (registration_id, co2_datetime, co2_intensity)
VALUES 
(1, '2024-12-01T00:00Z',	90),
(1, '2024-12-01T00:30Z', 94),
(1, '2024-12-01T01:00Z',	92),
(1, '2024-12-01T01:30Z',	90),
(1, '2024-12-01T02:00Z', 85);

SELECT * FROM user_co2_intensity;
