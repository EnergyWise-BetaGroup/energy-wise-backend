## Backend endpoints and data expected

| Endpoint | Type | Data Expected / Returned | Auth* |
|----------|------|--------------------------|--------|
| /users/login | POST | username, password | No |
| /users/register | POST | name, password, username, email, postcode, region | No |
| /users/profile | GET | registration_id, name, username, email, postcode, region | Yes |
| /stats/ | GET | TBC | Yes |

 \* If Yes - requires a header with an 'authorization' key and JWT token value.