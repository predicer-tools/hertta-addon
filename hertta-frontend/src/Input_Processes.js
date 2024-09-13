const generateProcessesData = (electricHeaters) => {
  return electricHeaters.reduce((acc, heater) => {
    acc[heater.id] = {
      name: heater.id,
      groups: ["p1"],
      conversion: 1,
      is_cf: false,
      is_cf_fix: false,
      is_online: false,
      is_res: false,
      eff: 1.0,
      load_min: 0.0,
      load_max: 1.0,
      start_cost: 0.0,
      min_online: 0.0,
      min_offline: 0.0,
      max_online: 0.0,
      max_offline: 0.0,
      initial_state: true,
      is_scenario_independent: false,
      topos: [
        {
          source: "electricitygrid",
          sink: heater.id,
          capacity: heater.capacity,
          vom_cost: 0.0,
          ramp_up: 1.0,
          ramp_down: 1.0,
          initial_load: 0.0,
          initial_flow: 0.0,
          cap_ts: {
            ts_data: [
              { scenario: "s1", series: {} },
              { scenario: "s2", series: {} }
            ]
          }
        },
        {
          source: heater.id,
          sink: heater.roomId,
          capacity: heater.capacity,
          vom_cost: 0.0,
          ramp_up: 1.0,
          ramp_down: 1.0,
          initial_load: 0.0,
          initial_flow: 0.0,
          cap_ts: {
            ts_data: [
              { scenario: "s1", series: {} },
              { scenario: "s2", series: {} }
            ]
          }
        }
      ],
      cf: {
        ts_data: [
          { scenario: "s1", series: {} },
          { scenario: "s2", series: {} }
        ]
      },
      eff_ts: {
        ts_data: [
          { scenario: "s1", series: {} },
          { scenario: "s2", series: {} }
        ]
      },
      eff_ops: [],
      eff_fun: []
    };
    return acc;
  }, {});
};

export default generateProcessesData;
