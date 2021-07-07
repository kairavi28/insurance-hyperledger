  
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Insurance extends Contract {

    async addInsuranceInfo(ctx, policy_number, customer_id, plate_number, type, coverage, company_name) {
        console.info('============= START : Create ledger for Storing Insurance Information ===========');


        const customerDetails = await ctx.stub.getState(customer_id);
        if (!!customerDetails) {
            throw new Error(`No Customer with ID: ${license_plate_num} exists!`);
<<<<<<< HEAD
        }


        const vehicleDetails = await ctx.stub.getState(plate_number);
        if (!!vehicleDetails) {
            throw new Error(`No Vehicle with ID: ${license_plate_num} exists!`);
        }


=======
        }


        const vehicleDetails = await ctx.stub.getState(plate_number);
        if (!!vehicleDetails) {
            throw new Error(`No Vehicle with ID: ${license_plate_num} exists!`);
        }


>>>>>>> 2c3e0f82ed88f20a2469d776d6674a4f8a0ca23c
        const InsuranceDetails = await ctx.stub.getState(policy_number);
        if (!!InsuranceDetails) {
            throw new Error(`Insurance with Plicy Number: ${license_plate_num} already exists!`);
        }

        const Insurance = {
            policy_number,
            customer_id,
            plate_number,
            type,
            coverage,
            company_name
        };

        await ctx.stub.putState(policy_number, Buffer.from(JSON.stringify(Insurance)));
        console.info('============= END : Create ledger for Storing Insurance Information ===========');
    }

    async getInsuranceInfo(ctx, policy_number) {
        const InsuranceDetails = await ctx.stub.getState(policy_number);
        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${license_plate_num} does not exist`);
        }
        console.log(InsuranceDetails.toString());
        return InsuranceDetails.toString();
    }
<<<<<<< HEAD
    
=======

>>>>>>> 2c3e0f82ed88f20a2469d776d6674a4f8a0ca23c
    async queryAllInsurances(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
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

<<<<<<< HEAD
module.exports = Insurance;
=======
module.exports = Insurance;
>>>>>>> 2c3e0f82ed88f20a2469d776d6674a4f8a0ca23c
