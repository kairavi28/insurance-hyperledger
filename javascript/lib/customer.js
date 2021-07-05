/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Customer extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Customer Ledger ===========');
        const customer_info = [
            {
                customer_id: '17653661',
                first_name: 'Kate',
                last_name: 'Winslet',
                registration_date: 'Jun 24, 2012'
            }, {
                customer_id: '14355139',
                first_name: 'Jennifer',
                last_name: 'Aniston',
                registration_date: 'Dec 15, 2008'
            }
        ];

        for (let i = 0; i < customer_info.length; i++) {
            customer_info[i].docType = 'customer_details';
            await ctx.stub.putState('CUSTOMER' + i, Buffer.from(JSON.stringify(customer_info[i])));
            console.info('Added <--> ', customer_info[i]);
        }

        console.info('============= END : Initialize Customer Ledger ===========');
    }
    async addCustomerInfo(ctx, customer_id, first_name, last_name, registration_date) {
        console.info('============= START : Create ledger for Storing Customer Information ===========');

        const cust = {
            customer_id,
            docType: 'customer_details',
            first_name,
            last_name,
            registration_date
        };

        await ctx.stub.putState(customer_id, Buffer.from(JSON.stringify(cust)));
        console.info('============= END : Create ledger for Storing Customer Information ===========');
    }

    async getCustomerInfo(ctx, customer_id) {
        const custDetails = await ctx.stub.getState(customer_id); 
        if (!custDetails || custDetails.length === 0) {
            throw new Error(`${customer_id} does not exist`);
        }
        console.log(custDetails.toString());
        return custDetails.toString();
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

module.exports = Customer;
