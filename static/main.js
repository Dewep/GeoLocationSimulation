/*
latitude (-90° ; 90°)
longitude (-180° ; 180°)
altitude (-20m ; 10000m)
accuracy (0m ; 200m)
bearing (0° ; 359.99°)
angle (0° ; 359°)
*/

$(function($) {

    window.socket = io();

    for (var type in configs.simulations_types) {
        var index = configs.simulations_types[type];
        configs.simulations[index] = $.extend(true, {}, configs.simulations.default, configs.simulations[index]);
    }

    window.current_simulation_type = null;
    window.values = $.extend(true, {}, configs.defaultValues);
    window.targetValues = $.extend(true, {}, configs.defaultValues);

    $("[data-value=bearing]").val(window.targetValues.bearing).change();
    $("[data-value=angle]").val(window.targetValues.angle).change();
    $(".knob").knob();

    if (window.simulationIdentifier) {

        $("[data-text=simulationIdentifier]").text("READ-ONLY " + window.simulationIdentifier);
        $("[data-href-simulation=simulationIdentifier]").attr("href", "/simulation-" + window.simulationIdentifier);
        $("[data-simulation-type]").addClass("disabled").attr("disabled", "disabled");

        window.socket.emit("register", window.simulationIdentifier);

        window.socket.on("geoloc", function (data) {
            window.values = data;
            Lib.updateValues(true);
        });

    } else {

        window.simulationIdentifier = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        $("[data-text=simulationIdentifier]").text(window.simulationIdentifier);
        $("[data-href-simulation=simulationIdentifier]").attr("href", "/simulation-" + window.simulationIdentifier);

        $("[data-simulation-type]").click(function() {
            window.current_simulation_type = $(this).attr("data-simulation-type");
            Lib.updateValues(true);
        });

        Lib.updateValues();

        setInterval(Lib.computeNextPosition, window.configs.update_interval);

    }

});
