
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Report extends Contract {

    async addReport(ctx, policy_number, customer_id, driver_name, accident_details, date, time, injuries, entitled, officer_code, coverage, at_fault, exclusion, loss) {
        console.info('============= START : Create ledger for Filing a new Report ===========');

        const reportDetails = await ctx.stub.getState(policy_number);
        if (!!reportDetails) {
            throw new Error(`Report with policy number: ${policy_number} already exists!`);
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

    async getReportInfo(ctx, policy_number) {
        const InsuranceDetails = await ctx.stub.getState(policy_number);

        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${policy_number} does not exist`);
        }

        return InsuranceDetails.toString();
    }

    async setProofOfLoss(ctx, policy_number, total_loss) {
        const InsuranceDetails = await ctx.stub.getState(policy_number);

        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${policy_number} does not exist`);
        }

        const report = JSON.parse(InsuranceDetails.toString());
        report.loss = total_loss;

        await ctx.stub.putState(policy_number, Buffer.from(JSON.stringify(report)));
    }

    async setFaultDetermined(ctx, policy_number, at_fault_percent) {
        const InsuranceDetails = await ctx.stub.getState(policy_number);

        if (!InsuranceDetails || InsuranceDetails.length === 0) {
            throw new Error(`${policy_number} does not exist`);
        }

        if (at_fault_percent > 100 || at_fault_percent < 0) {
            throw new Error('Wrong fault percentage!');
        }

        const report = JSON.parse(InsuranceDetails.toString());

        report.at_fault = at_fault_percent;

        //Coverage: this is one proposed calculation
        const coverage = parseFloat(report.coverage);
        coverage = coverage - (0.2 * coverage * at_fault_percent / 100);
        report.coverage = coverage;

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