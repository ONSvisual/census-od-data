# Census 2021 origin-destination data processing scripts

A set of scripts for processing Census 2021 origin-destination data into files suitable for the [origin-destination data explorer](https://github.com/ONSvisual/census-od-map).

You need to install [Git](https://git-scm.com/) and [NodeJS](https://nodejs.org/) on your machine in order to run these scripts. The scripts should run fine on Windows, MacOS or Linux.

## Clone the repo and install dependencies

Run these commands to clone this repo and install NodeJS dependencies from NPM.

- `git clone https://github.com/ONSvisual/census-od-data.git`
- `cd census-od-data`
- `npm install`

## Run the scripts

### Clean the data

You need to run this step before any of the below steps.

- `npm run clean-data`

### Generating dots

- `npm run make-journeys`
- `npm run make-points`
- `npm run compress-points`

### Generating "chunks" of data

- `npm run make-chunks`

### Generating metadata

- `npm run make-metadata`

### Generating summary counts for all areas

- `npm run make-counts`
