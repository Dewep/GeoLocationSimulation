window.Lib = {};

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
}

Lib.sendValues = function(data_values) {
    window.socket.emit('geoloc-send', {
        simulationIdentifier: window.simulationIdentifier,
        data: data_values
    });
};

Lib.updateValues = function(doNotSend) {
    var data = $.extend(true, {}, window.targetValues);

    for (var field in data) {
        var simulation_type = window.current_simulation_type || "default";
        if (typeof(data[field]) == "number") {
            data[field] = data[field].toFixed(configs.simulations[simulation_type][field].value.decimal);
        }

        $("[data-text=" + field + "]").text(data[field]);
    }

    $("[data-simulation-type]").removeClass("active");
    if (window.current_simulation_type) {
        $("[data-simulation-type=" + window.current_simulation_type + "]").addClass("active");
    }

    if (window.current_marker) {
        window.current_marker.setPosition({
            lat: parseFloat(window.values.latitude),
            lng: parseFloat(window.values.longitude)
        });
    }

    if (window.current_simulation_type && !doNotSend) {
        Lib.sendValues(data);
    }
};

// latitude/longitude/bearing in degrees, distance in km
Lib.destinationPoint = function(origin_latitude, origin_longitude, bearing, distance) {
    origin_latitude = origin_latitude.toRad();
    origin_longitude = origin_longitude.toRad();
    bearing = bearing.toRad();
    distance = distance / 6371;

    var dest_latitude = Math.asin(Math.sin(origin_latitude) * Math.cos(distance) + Math.cos(origin_latitude) * Math.sin(distance) * Math.cos(bearing));
    var dest_longitude = origin_longitude + Math.atan2(Math.sin(bearing) * Math.sin(distance) * Math.cos(origin_latitude), Math.cos(distance) - Math.sin(origin_latitude) * Math.sin(dest_latitude));

    if (isNaN(dest_latitude) || isNaN(dest_longitude)) {
        console.error("destinationPoint NaN", dest_latitude, dest_longitude);
        return null;
    }

    return {
        latitude: dest_latitude.toDeg(),
        longitude: dest_longitude.toDeg()
    };
};

Lib.valueSelection = function(field) {
    var config = window.configs.simulations[window.current_simulation_type][field];
    var min_value = Math.max(config.value.min, window.targetValues[field] - config.precision.limit);
    var max_value = Math.min(config.value.max, window.targetValues[field] + config.precision.limit);

    if (window.values[field] + config.precision.margin < min_value) {
        window.values[field] = min_value;
    } else if (window.values[field] - config.precision.margin > max_value) {
        window.values[field] = max_value;
    } else {
        min_value = Math.max(window.values[field] - config.precision.margin, min_value);
        max_value = Math.min(window.values[field] + config.precision.margin, max_value);
        window.values[field] = Math.random() * (max_value - min_value) + min_value;
    }
};

Lib.computeNextPosition = function() {
    if (window.current_simulation_type) {
        window.targetValues.speed = window.configs.simulations[window.current_simulation_type].speed.value.default;
        Lib.valueSelection("speed");

        window.targetValues.bearing = parseInt($("#bearing-slider").val());
        Lib.valueSelection("bearing");

        window.targetValues.angle = parseInt($("#angle-slider").val());
        Lib.valueSelection("angle");

        var destination = Lib.destinationPoint(window.targetValues.latitude, window.targetValues.longitude, window.values.bearing, window.values.speed / 3600 / (1000 / window.configs.update_interval));
        if (destination) {
            window.targetValues.latitude = destination.latitude;
            window.targetValues.longitude = destination.longitude;
        }
        Lib.valueSelection("latitude");
        Lib.valueSelection("longitude");

        Lib.valueSelection("altitude");
        Lib.valueSelection("accuracy");
    }

    Lib.updateValues();
};

Lib.updateBearing = function(latitude, longitude) {
    var distance_longitude = (longitude - window.targetValues.longitude).toRad();
    var y = Math.sin(distance_longitude) * Math.cos(latitude.toRad());
    var x = Math.cos(window.targetValues.latitude.toRad()) * Math.sin(latitude.toRad()) - Math.sin(window.targetValues.latitude.toRad()) * Math.cos(latitude.toRad())*Math.cos(distance_longitude);
    var bearing = Math.atan2(y, x).toDeg();
    $("[data-value=bearing]").val((bearing + 360) % 360).change();
};

Lib.initMap = function() {
    window.map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: window.values.latitude,
            lng: window.values.longitude
        },
        zoom: 17
    });

    window.current_marker = new google.maps.Marker({
        map: window.map
    });

    window.map.addListener('click', function(event) {
        Lib.updateBearing(event.latLng.lat(), event.latLng.lng());
    });
};
