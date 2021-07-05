/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Customer = require('./lib/customer');
const Vehicle = require('./lib/vehicle');
const Insurance = require('./lib/insurance');

module.exports.Customer = Customer;
module.exports.Vehicle = Vehicle;
module.exports.Insurance = Insurance;

module.exports.contracts = [Customer, Vehicle, Insurance];
