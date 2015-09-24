/// <reference path="../../typings/mocha/mocha.d.ts" />
/// <reference path="../../typings/chai/chai.d.ts" />

/**
 * Module dependencies.
 */
import chai = require('chai');
import database = require('../database/postgres');
/**
 * Globals
 */

var should = chai.should();
var expect = chai.expect;

describe('User Model Unit Tests:', () => {
    
    describe('Database Test', () => {
        it('Should not be null', (done) => {
            expect(database).to.not.be.null;
            done();
        })
    })
});