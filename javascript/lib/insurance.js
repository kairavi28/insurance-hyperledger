/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Insurance extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const registered_vehicles = [
            {
                policy_number: '123-4567-8910',
                registration_id: '17653661',
                make: 'Toyota',
                model: 'Prius',
                year:'2020',
                license_plate_num: 'KUOGN85R3B012814'
            }, {
                policy_number: '982-1763-1204',
                registration_id: '17653662',
                make: 'Toyota',
                model: 'Camry',
                year:'2021',
                license_plate_num: 'KUOGN84R3B012134'
            }
        ];
        const accident_details = [
            {
                driver_name: 'Joseph Tribbiani',
                license_number: '122136758',
                date: 'April 1, 2010',
                time: '18:30:10',
                accident_location: 'Williamsburg avenue',
                injuries: 'minor injury on knee',
                passenger_number: 1,
                description: 'The accident caused minor damage to vehicle.',
                insurance_company_name: 'Broker Union for Auto Injury',
                investigating_officer_name: 'Jane Aniston',
                investigating_officer_id: '387-675-2964',
                insurance_value: '12000',
                loss_ocuured: '0',
                fault_percent: '0',
                assessment_done: 'NO'
            }
        ];
        for (let i = 0; i < registered_vehicles.length; i++) {
            registered_vehicles[i].docType = 'vehicle_info';
            await ctx.stub.putState('VEHICLE' + i, Buffer.from(JSON.stringify(registered_vehicles[i])));
            console.info('Added <--> ', registered_vehicles[i]);
        }
        for (let i = 0; i < accident_details.length; i++) {
            accident_details[i].docType = 'accident_info';
            await ctx.stub.putState('ACCIDENT' + i, Buffer.from(JSON.stringify(accident_details[i])));
            console.info('Added <--> ', accident_details[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    async reportVehicleInfo(ctx, policy_number, registration_id, make, model, year, license_plate_num) {
        console.info('============= START : Create ledger for Storing Vehicle Information ===========');

        const vehicle = {
            policy_number,
            registration_id,
            docType: 'vehicle_info',
            make,
            model,
            year,
            license_plate_num
        };

        await ctx.stub.putState(policy_number, Buffer.from(JSON.stringify(vehicle)));
        console.info('============= END : Create ledger for Storing Vehicle Information ===========');
    }
    async reportAccidentInfo(ctx, driver_name, license_number, date, time, accident_location, injuries, passenger_number, description, insurance_company_name, investigating_officer_name, investigating_officer_id) {
        console.info('============= START : Create ledger for Storing Accident Information ===========');
  
        const accident = {
            driver_name,
            license_number,
            docType: 'accident_info',
            date,
            time,
            accident_location,
            injuries,
            passenger_number,
            description,
            insurance_company_name,
            investigating_officer_name,
            investigating_officer_id
        };

        await ctx.stub.putState(license_number, Buffer.from(JSON.stringify(accident)));
        console.info('============= END : Create ledger for Storing Accident Information ===========');
    }
    async queryAccidentReport(ctx, license_number) {
        const driverDetailsAsBytes = await ctx.stub.getState(license_number); // get the accident from chaincode state
        if (!driverDetailsAsBytes || driverDetailsAsBytes.length === 0) {
            throw new Error(`${license_number} does not exist`);
        }
        console.log(driverDetailsAsBytes.toString());
        return driverDetailsAsBytes.toString();
    }
    async proofOfLoss(ctx, license_number) {
        console.info('============= START : Proof Of Loss ===========');
        const detailsAsBytes = await ctx.stub.getState(license_number); 
        if (!detailsAsBytes || detailsAsBytes.length === 0) {
            throw new Error(`${license_number} does not exist`);
        }
        const details = JSON.parse(detailsAsBytes.toString());
        details.loss_ocuured = details.insurance_value - 1000;
        await ctx.stub.putState(license_number, Buffer.from(JSON.stringify(details)));
        console.info('============= END : Proof Of Loss ===========');
    }
    async faultDetermined(ctx, insurance_company_name) {
        console.info('============= START : Fault Determination ===========');
        const detailsAsBytes = await ctx.stub.getState(license_number); 
        if (!detailsAsBytes || detailsAsBytes.length === 0) {
            throw new Error(`${license_number} does not exist`);
        }
        const details = JSON.parse(detailsAsBytes.toString());
        details.fault_percent = '50';
        await ctx.stub.putState(license_number, Buffer.from(JSON.stringify(details)));
        console.info('============= END : Fault Determination ===========');
    }
    async faultAssessment(ctx, license_number) {
        console.info('============= START : Fault Assessment ===========');
        const detailsAsBytes = await ctx.stub.getState(license_number); 
        if (!detailsAsBytes || detailsAsBytes.length === 0) {
            throw new Error(`${license_number} does not exist`);
        }
        const details = JSON.parse(detailsAsBytes.toString());
        details.assessment_done = 'YES';
        await ctx.stub.putState(license_number, Buffer.from(JSON.stringify(details)));
        console.info('============= END : Fault Assessment ===========');
    }
    
    async queryAllReports(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async redeemClaim(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
