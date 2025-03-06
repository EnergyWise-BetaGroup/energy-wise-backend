# EnergyWise Backend

## Description
This is the backend service for EnergyWise, which handles user authentication, data storage, external/internal API calls, resource provisioning and configuration. It is built with [Technology Stack (e.g., Node.js, PostgresSQL, Azure Pipelines, Python, Terraform, Ansible)].

## How to Run the Application

1. Clone the repository:
   ```bash
   git clone git@github.com:EnergyWise-BetaGroup/energy-wise-backend.git
   cd energy-wise-backend
   ```
   ```bash
   git clone git@github.com:EnergyWise-BetaGroup/energy-wise-frontend.git
   ```
   ```bash
   git clone git@github.com:EnergyWise-BetaGroup/plotly-python-microservice.git
   ```

Now that the repos are running on your device and you have changed directory into the energy-wise-backend, navigate to the energy-db directory:
``` cd energy-db ```


and run the following command to build the image (You should have your Docker Engin running at this point):

``` docker build -t <your-docker-username>/energy-db . ```

and then push this image to the registry

``` docker push <your-docker-username>/energy-db:latest ```

cd directory to energy-mvc and run this command:
``` docker build -t <your-docker-username>/energy-mvc:latest . ```
and push as shown previosuly.

finally go to the plotly-python-microservice repo and run this command:
``` docker build -t <your-docker-username>/energy-python:latest . ```

navigate to the energy-mvc folder it should contain the docker-compose.yaml file and run:
``` docker-compose up -d ```

You will now have a local copy of the application running on your device at:

http://localhost:3000



## Backend endpoints and data expected

| Endpoint            | Type   | Data Expected / Returned                     | Auth* |
|---------------------|--------|----------------------------------------------|--------|
| **/users/login**    | POST   | username, password                          | No     |
| **/users/register** | POST   | name, password, username, email, postcode, region | No  |
| **/users/profile**  | GET    | registration_id, name, username, email, postcode, region | Yes  |
| **/stats/line-graph** | GET  | line graph showing carbon consumption over time   | Yes    |
| **/stats/donut**    | GET    | electricity source for user postcode at the moment        | Yes    |
| **/stats/gauge**    | GET    | guage to compare daily and weekly carbon consumption                 | Yes    |
| **/stats/table**    | GET    | table to highlight the carbon intensity forecast             | Yes    |


 \* If Yes - requires a header with an 'authorization' key and JWT token value.



 ## Running code on Virtual Machine
 To run the code on a virtual machine the user will have to naviagate to the terraform folder where main.tf is. Now run the following command:
 ``` az ad sp create-for-rbac --name "MyServicePrincipal" --role contributor --scopes /subscriptions/{subscription-id} ```
 The user should generate a ssh key at ~/azure/azure_keys/ with the following code:
 ``` ssh-keygen -t rsa -b 4096 ```

 This will give the user a new service principle for their azure account (needed for creating resources)
 The following data should then be saved to env variables like this:
 ``` export client_id = <client id> ```
 ``` export client_secret = <client secret> ```
 ``` export ssh_public_key = ~/azure/azure_keys/azure_rsa.pub ```

 The user should then run:
 ``` terraform init ```
 ``` terraform apply ```

 There should now be a Virtual Machine (VM) running.
 Copy over the docker compose file to the VM:
 ``` scp -i ~/azure/azure_keys/azure_rsa.pub <path-to-docker-compose> azureuser@<vm-public-ip>:/home/user/ ```

 The user should then push the front end repo to their github and then go to azure devops and open up azure pipelines. 

 The user should then create a new starter pipeline and select the newly created github repo. 

 The pipeline 'azure-pipelines.yml' and then run the other pipeline 'azure-pipeline-copy-repo.yml'. 
 
 The first yml file Install HTTPD on the Azure VM and the latter installs copies over the repo to the virtual machine.

 Now the docker compose file and the frontend are on the VM, run:
 ``` sudo docker-compose up -d ```

 The application will be hosted on:
 http://<"VM-ip address">:3000