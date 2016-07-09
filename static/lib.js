window.Lib = {};

Lib.sendValues = function(data) {
    console.log("sendValues", data);
};

Lib.updateValues = function(doNotSend) {
    var data = $.extend(true, {}, window.values);

    for (var field in data) {
        data[field] = data[field].toFixed(configs.simulations[window.current_simulation_type][field].value.decimal);

        $("[data-text=" + field + "]").text(data[field]);
        $("[data-value=" + field + "]").val(data[field]).change();
    }

    $("[data-simulation-type]").removeClass("active");
    $("[data-simulation-type=" + window.current_simulation_type + "]").addClass("active");

    if (!doNotSend) {
        Lib.sendValues(data);
    }
};
