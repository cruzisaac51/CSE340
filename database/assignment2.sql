--Assignment 2, Task 1

--insert Tony stark account

INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'

);

--Update Tony to Admin
UPDATE account
    set account_type = 'Admin' 
    where account_id = 1;


--Delete Tony account
DELETE from account 
    where account_id = 1;

--Update Hummer Interiors
UPDATE inventory
    SET INV_DESCRIPTION = REGEXP_REPLACE(INV_DESCRIPTION,'small interiors', 'huge Interiors') 
    WHERE inv_model = 'Hummer';


-- inner join 
SELECT
    inv_make,
    inv_model,
	classification_name
    
FROM
    inventory
INNER JOIN classification 
    ON inventory.inv_id = classification.classification_id
WHERE classification_name = 'Sport';

--Update all records in the inventory table to add "/vehicles"
UPDATE inventory
set inv_image = REPLACE(inv_image, '/images/','/images/vehicles/'),
	  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
