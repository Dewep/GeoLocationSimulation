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

    window.current_simulation_type = null;
    window.values = $.extend(true, {}, configs.defaultValues);
    window.targetValues = $.extend(true, {}, configs.defaultValues);

    $("[data-value=bearing]").val(window.targetValues.bearing).change();
    $("[data-value=angle]").val(window.targetValues.angle).change();
    $(".knob").knob();

    $("[data-simulation-type]").click(function() {
        window.current_simulation_type = $(this).attr("data-simulation-type");
        Lib.updateValues(true);
    });

    Lib.updateValues();

    setInterval(Lib.computeNextPosition, 1000);

});
