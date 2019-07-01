/**
 * Module FanWall
 *
 * @author Xtraball SAS <dev@xtraball.com>
 * @version 4.17.0
 */
angular.module("starter").factory("FanwallPost", function ($pwaRequest) {
    var factory = {
        value_id: null,
        extendedOptions: {},
        collection: []
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
    };

    factory.findAll = function (offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::FanwallPost.findAll] missing value_id");
        }

        return $pwaRequest.get("fanwall/mobile_post/find-all", angular.extend({
            urlParams: {
                value_id: this.value_id,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };

    factory.findAllNearby = function (location, offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::FanwallPost.findAllNearby] missing value_id");
        }

        return $pwaRequest.get("fanwall/mobile_post/find-all-nearby", angular.extend({
            urlParams: {
                value_id: this.value_id,
                latitude: location.latitude,
                longitude: location.longitude,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };

    factory.findAllMap = function (location, offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::FanwallPost.findAllMap] missing value_id");
        }

        return $pwaRequest.get("fanwall/mobile_post/find-all-map", angular.extend({
            urlParams: {
                value_id: this.value_id,
                latitude: location.latitude,
                longitude: location.longitude,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };

    factory.like = function (postId) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::FanwallPost.like] missing value_id");
        }

        return $pwaRequest.post("fanwall/mobile_post/like-post", angular.extend({
            urlParams: {
                value_id: this.value_id,
                postId: postId
            }
        }, factory.extendedOptions));
    };

    factory.unlike = function (postId) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::FanwallPost.like] missing value_id");
        }

        return $pwaRequest.post("fanwall/mobile_post/unlike-post", angular.extend({
            urlParams: {
                value_id: this.value_id,
                postId: postId
            }
        }, factory.extendedOptions));
    };

    /**
     * Send new post!
     *
     * @param postId
     * @param form
     */
    factory.sendPost = function (postId, form) {
        return $pwaRequest.post("fanwall/mobile_post/send-post", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                postId: postId,
                form: form
            },
            cache: false
        });
    };

    /**
     * Send new comment!
     *
     * @param postId
     * @param form
     */
    factory.sendComment = function (postId, form) {
        return $pwaRequest.post("fanwall/mobile_post/send-comment", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                postId: postId,
                form: form
            },
            cache: false
        });
    };

    /**
     * Report unwanted post!
     *
     * @param postId
     * @param reportMessage
     */
    factory.reportPost = function (postId, reportMessage) {
        return $pwaRequest.post("fanwall/mobile_report/report-post", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                postId: postId,
                reportMessage: reportMessage
            }
        });
    };

    /**
     * Delete self comment!
     *
     * @param commentId
     */
    factory.deleteComment = function (commentId) {
        return $pwaRequest.post("fanwall/mobile_post/delete-comment", {
            urlParams: {
                value_id: factory.value_id,
                commentId: commentId
            }
        });
    };

    /**
     * Report unwanted comment!
     *
     * @param commentId
     * @param reportMessage
     */
    factory.reportComment = function (commentId, reportMessage) {
        return $pwaRequest.post("fanwall/mobile_report/report-comment", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                commentId: commentId,
                reportMessage: reportMessage
            }
        });
    };

    return factory;
});