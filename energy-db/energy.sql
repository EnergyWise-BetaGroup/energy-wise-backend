DROP TABLE IF EXISTS registration_info;
DROP TABLE IF EXISTS appliances;
DROP TABLE IF EXISTS smart_meter_data;
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
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
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
    start TIMESTAMP,
    end TIMESTAMP,
    created_at TIMESTAMP,
    PRIMARY KEY(datatime_id)
  );
 
  CREATE TABLE user_CO2_intensity
  (
    CO2_intensity_id BIGINT GENERATED ALWAYS AS IDENTITY,
    datetime_id INTEGER,
    recorded_at TIMESTAMP,
    carbon_intensity INTEGER,
    CO2_emission FLOAT,
    total_consumption FLOAT,
    created_at TIMESTAMP,
    PRIMARY KEY (CO2_intensity_id)
  );