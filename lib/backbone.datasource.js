"use strict";

var _ = require('lodash');

// Kendo UI: kendo.backbone.DataSource
// -----------------------------------
//
// An adapter that wraps around a 
// `Backbone.Collection` as the underlying data store and
// transport for a `kendo.data.DataSource`. This will provide basic
// data-binding functionality for Kendo UI widgets and controls, such
// as grids, list views, etc.


// kendo.Backbone.DataSource
// -----------------------------------
var BackboneCollectionAdapter = require('./collectionadapter');
var BackboneTransport = require('./backbonetransport');

// Setup default schema, if none is provided
function setupDefaultSchema(target, collection){
  // build the schema.model, one step at a time, 
  // to ensure it is not replaced, and ensure it is
  // properly set up in case parts of a schema or model
  // are provided by the specific application needs
  _.defaults(target, { schema: {} });
  _.defaults(target.schema, { model: {} });

  // set an id field based on the collection's model.idAttribute,
  // or use the default "id" if none found
  _.defaults(target.schema.model, {
    id: Object.getPrototypeOf(collection).model.prototype.idAttribute || "id"
  });

  return target;
}

// Define the custom data source that uses a Backbone.Collection
// as the underlying data store / transport
var DataSource = kendo.data.DataSource.extend({
  init: function(options) {
    // build a collection wrapper for the backbone.collection
    var collection = options.collection;
    var colWrap = new BackboneCollectionAdapter(collection, this);

    // configure the Backbone transport with the collection
    var bbtrans = new BackboneTransport(colWrap);
    _.defaults(options, { transport: bbtrans });

    // initialize the datasource with the new configuration
    options = setupDefaultSchema(options, collection);
    kendo.data.DataSource.prototype.init.call(this, options);
  }
}); 

module.exports = DataSource;
