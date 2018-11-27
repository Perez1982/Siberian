/* global
    App, angular
 */

/**
 * Places
 *
 * @author Xtraball SAS
 */
angular.module('starter').factory('Places', function ($pwaRequest, Cms) {
    var factory = {
        value_id: null,
        collection: [],
        extendedOptions: {}
    };

    /**
     *
     * @param value_id
     */
    factory.setValueId = function (value_id) {
        factory.value_id = value_id;
    };

    /**
     *
     * @param options
     */
    factory.setExtendedOptions = function (options) {
        factory.extendedOptions = options;
    };

    /**
     * Pre-Fetch feature.
     */
    factory.preFetch = function () {
        factory.findAll();
    };

    /**
     * @param filters
     * @param refresh
     */
    factory.findAll = function (filters, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject('[Factory::Places.findAll] missing value_id');
        }

        filters.value_id = this.value_id;

        return $pwaRequest.get('places/mobile_list/findall', angular.extend({
            urlParams: filters,
            refresh: refresh
        }, factory.extendedOptions));
    };

    factory.findAllMaps = function (refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject('[Factory::Places.findAll] missing value_id');
        }

        var parameters = {
            value_id: this.value_id,
            maps: true
        };

        return $pwaRequest.get('places/mobile_list/findall', angular.extend({
            urlParams: parameters,
            refresh: refresh
        }, factory.extendedOptions));
    };

    /**
     *
     * @param placeId
     */
    factory.find = function (placeId) {
        if (!this.value_id) {
            return $pwaRequest.reject('[Factory::Places.find] missing value_id');
        }

        return $pwaRequest.get('places/mobile_list/find-one', {
            urlParams: {
                value_id: this.value_id,
                place_id: placeId
            }
        });
    };

    /**
     * Search for place payload inside cached collection
     *
     * @param placeId
     * @returns {*}
     */
    factory.getPlace = function (placeId) {
        if (!this.value_id) {
            return $pwaRequest.reject('[Factory::Places.getPlace] missing value_id');
        }

        var place = _.get(_.filter(factory.collection, function (item) {
            return (item.id == placeId);
        })[0], 'embed_payload', false);

        if (!place) {
            // Well then fetch it!
            return factory.find(placeId);
        }

        return $pwaRequest.resolve(place);
    };

    factory.settings = function () {
        /* The url and agent must be non-null */
        if (!this.value_id) {
            return $pwaRequest.reject('[Factory::Places.settings] missing value_id');
        }

        return $pwaRequest.resolve($pwaRequest.getPayloadForValueId(factory.value_id).settings);
    };

    return factory;
});
