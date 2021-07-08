/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Customer = require('./lib/customer');
const Vehicle = require('./lib/vehicle');
const Insurance = require('./lib/insurance');
const Report = require('./lib/report');

module.exports.Customer = Customer;
module.exports.Vehicle = Vehicle;
module.exports.Insurance = Insurance;
module.exports.Report = Report;

module.exports.contracts = [Customer, Vehicle, Insurance, Report];
