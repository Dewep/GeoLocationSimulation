var configs = {
    components: {
        gps: true,
        accelerometer: true
    },
    defaultValues: {
        speed: 0.0,
        latitude: 47.7696790,
        longitude: 6.2900230,
        altitude: 278,
        accuracy: 20,
        bearing: 90.0,
        angle: 25
    },
    simulations_types: ["stop", "spinAround", "walk", "run", "bike"],
    simulations: {
        default: {
            name: "Default",
            speed: {
                value: {
                    default: null,
                    decimal: 1,
                    min: 0.0,
                    max: 150.0,
                    circular: false
                },
                maxDifference: 5.0,
                precision: {
                    limit: 1.0,
                    margin: 0.3
                }
            },
            latitude: {
                value: {
                    default: null,
                    decimal: 7,
                    min: -90.0,
                    max: 90.0,
                    circular: true
                },
                maxDifference: 0.001,
                precision: {
                    limit: 0.0002,
                    margin: 0.0001
                }
            },
            longitude: {
                value: {
                    default: null,
                    decimal: 7,
                    min: -180.0,
                    max: 180.0,
                    circular: true
                },
                maxDifference: 0.002,
                precision: {
                    limit: 0.0004,
                    margin: 0.0002
                }
            },
            altitude: {
                value: {
                    default: null,
                    decimal: 0,
                    min: -20,
                    max: 10000,
                    circular: false
                },
                maxDifference: 5,
                precision: {
                    limit: 20,
                    margin: 5
                }
            },
            accuracy: {
                value: {
                    default: 20,
                    decimal: 0,
                    min: 0,
                    max: 200,
                    circular: false
                },
                maxDifference: 200,
                precision: {
                    limit: 200,
                    margin: 50
                }
            },
            bearing: {
                value: {
                    default: null,
                    decimal: 2,
                    min: 0.0,
                    max: 359.99,
                    circular: true
                },
                maxDifference: 90.0,
                precision: {
                    limit: 80.0,
                    margin: 20.0
                }
            },
            angle: {
                value: {
                    default: null,
                    decimal: 0,
                    min: 0,
                    max: 359,
                    circular: true
                },
                maxDifference: 90.0,
                precision: {
                    limit: 50,
                    margin: 20
                }
            },
            rateUpdate: 0.9
        },
        stop: {
            name: "Stop",
            speed: {
                value: {
                    default: 0.0
                },
                precision: {
                    limit: 1.0,
                    margin: 0.3
                }
            },
            bearing: {
                precision: {
                    limit: 20.0,
                    margin: 5.0
                }
            },
            angle: {
                value: {
                    default: 25
                },
                precision: {
                    limit: 15,
                    margin: 5
                }
            },
            rateUpdate: 0.99
        },
        spinAround: {
            name: "Spin around",
            speed: {
                value: {
                    default: 3.0
                },
                precision: {
                    limit: 2.0,
                    margin: 1.0
                }
            },
            bearing: {
                precision: {
                    limit: 40.0,
                    margin: 10.0
                }
            },
            angle: {
                value: {
                    default: 30
                },
                precision: {
                    limit: 30,
                    margin: 10
                }
            },
            rateUpdate: 0.95
        },
        walk: {
            name: "Walk",
            speed: {
                value: {
                    default: 5.0
                },
                precision: {
                    limit: 3.0,
                    margin: 2.0
                }
            },
            angle: {
                value: {
                    default: 40
                }
            }
        },
        run: {
            name: "Run",
            speed: {
                value: {
                    default: 11.0
                },
                precision: {
                    limit: 5.0,
                    margin: 2.0
                }
            },
            angle: {
                value: {
                    default: 160
                },
                precision: {
                    limit: 60,
                    margin: 30
                }
            }
        },
        bike: {
            name: "Bike",
            speed: {
                value: {
                    default: 20.0
                },
                precision: {
                    limit: 10.0,
                    margin: 4.0
                }
            },
            angle: {
                value: {
                    default: 160
                },
                precision: {
                    limit: 60,
                    margin: 30
                }
            }
        }
    }
};
