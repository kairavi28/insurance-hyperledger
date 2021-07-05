/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Vehicle extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Vehicle Ledger ===========');
        const registered_vehicles = [
            {
                customer_id: '17653661',
                make: 'Toyota',
                model: 'Prius',
                year:'2020',
                license_plate_num: 'KUOGN85R3B012814'
            }, {
                customer_id: '17653662',
                make: 'Hyundai',
                model: 'Elentra',
                year:'2020',
                license_plate_num: 'KUOGN82R3J012909'
            }
        ];

        for (let i = 0; i < registered_vehicles.length; i++) {
            registered_vehicles[i].docType = 'vehicle_info';
            await ctx.stub.putState('VEHICLE' + i, Buffer.from(JSON.stringify(registered_vehicles[i])));
            console.info('Added <--> ', registered_vehicles[i]);
        }

        console.info('============= END : Initialize Vehicle Ledger ===========');
    }
    async addVehicleInfo(ctx, customer_id, make, model, year, license_plate_num) {
        console.info('============= START : Create ledger for Storing Vehicle Information ===========');

        const vehicle = {
            customer_id,
            docType: 'vehicle_info',
            make,
            model,
            year,
            license_plate_num
        };

        await ctx.stub.putState(customer_id, Buffer.from(JSON.stringify(vehicle)));
        console.info('============= END : Create ledger for Storing Vehicle Information ===========');
    }

    async getVehicleInfo(ctx, license_plate_num) {
        const vehicleDetails = await ctx.stub.getState(license_plate_num); 
        if (!vehicleDetails || vehicleDetails.length === 0) {
            throw new Error(`${license_plate_num} does not exist`);
        }
        console.log(vehicleDetails.toString());
        return vehicleDetails.toString();
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
}

module.exports = Vehicle;
