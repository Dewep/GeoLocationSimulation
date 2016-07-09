/*
latitude (-90° ; 90°)
longitude (-180° ; 180°)
altitude (-20m ; 10000m)
accuracy (0m ; 200m)
bearing (0° ; 359.99°)
angle (0° ; 359°)
*/

$(function($) {

    for (var type in configs.simulations_types) {
        var index = configs.simulations_types[type];
        configs.simulations[index] = $.extend(true, {}, configs.simulations.default, configs.simulations[index]);
    }

    window.current_simulation_type = configs.simulations_types[0];
    window.values = $.extend(true, {}, configs.defaultValues);

    $(".knob").knob();

    $("[data-simulation-type]").click(function() {
        window.current_simulation_type = $(this).attr("data-simulation-type");
        Lib.updateValues(true);
    });

    Lib.updateValues();

});
