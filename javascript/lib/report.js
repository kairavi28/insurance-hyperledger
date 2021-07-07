  
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Report extends Contract {

    async claimReport(ctx, policy_number, customer_id, driver_name, accident_details, date, time, injuries, entitled, officer_code, coverage, at_fault, exclusion) {
        console.info('============= START : Create ledger for Filing a new Report ===========');


        const customerDetails = await ctx.stub.getState(customer_id);
        if (!!customerDetails) {
            throw new Error(`No Customer with ID: ${customer_id} exists!`);
        }

        const InsuranceDetails = await ctx.stub.getState(policy_number);
        if (!!InsuranceDetails) {
            throw new Error(`Insurance with Policy Number: ${policy_number} already exists!`);
        }

        const Report = {
            policy_number,
            customer_id,
            driver_name,
            accident_details,
            date,
            time,
            injuries,
            entitled,
            officer_code,
            coverage,
            at_fault,
            exclusion,
            loss
        };

        await ctx.stub.putState(policy_number, Buffer.from(JSON.stringify(Report)));
        console.info('============= END : Create ledger for Storing Insurance Information ===========');
    }
    async getReports(ctx, policy_number) {
        const InsuranceDetails = await ctx.stub.getState(policy_number);
        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${policy_number} does not exist`);
        }
        console.log(InsuranceDetails.toString());
        return InsuranceDetails.toString();
    }
    async proofOfLoss(ctx, policy_number, total_loss) {
        const InsuranceDetails = await ctx.stub.getState(policy_number);
        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${policy_number} does not exist`);
        }
        const report = JSON.parse(InsuranceDetails.toString());
        report.loss = total_loss;
        await ctx.stub.putState(policy_number, Buffer.from(JSON.stringify(report)));    
    }
    async faultDetermined(ctx, policy_number, at_fault_percent){
        const InsuranceDetails = await ctx.stub.getState(policy_number);
        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${policy_number} does not exist`);
        }
        const report = JSON.parse(InsuranceDetails.toString());
        report.at_fault = at_fault_percent;
        await ctx.stub.putState(policy_number, Buffer.from(JSON.stringify(report)));    
    }
    
    async faultAssessment(ctx, policy_number){
        const InsuranceDetails = await ctx.stub.getState(policy_number);
        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${policy_number} does not exist`);
        }
        const report = JSON.parse(InsuranceDetails.toString());
        if(report.at_fault >== 50){
            console.info('Your fault in the accident is more than 50 percent.');
            report.coverage = report.coverage / at_fault;
        } else {
            console.info('Your fault in the accident is less than 50 percent.');
            report.coverage = report.coverage / at_fault;
        }
        await ctx.stub.putState(policy_number, Buffer.from(JSON.stringify(report)));  
    }
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

module.exports = Report;