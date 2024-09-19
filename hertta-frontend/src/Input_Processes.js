const generateProcessesData = (electricHeaters) => {
  return electricHeaters.reduce((acc, heater) => {
    acc[heater.id] = {
      id: heater.id, // Add ID for easier reference
      name: heater.id, // Name of the heater process
      groups: ["p1"], // Group information, possibly for categorization
      conversion: 1, // Default conversion value
      is_cf: false,
      is_cf_fix: false,
      is_online: false, // Assuming the heater starts offline
      is_res: false, // Not a reserve unit by default
      eff: 1.0, // Efficiency
      load_min: 0.0, // Minimum load the heater can handle
      load_max: 1.0, // Maximum load
      start_cost: 0.0, // Cost to start the heater
      min_online: 0.0, // Minimum time to remain online
      min_offline: 0.0, // Minimum time to remain offline
      max_online: 0.0,
      max_offline: 0.0,
      initial_state: true, // Assuming the heater starts in an initial active state
      is_scenario_independent: false, // If the process changes with scenarios
      topos: [
        {
          source: "electricitygrid", // The source is the electricity grid
          sink: heater.id, // The heater itself is the sink
          capacity: heater.capacity, // Use the heater's capacity for the connection
          vom_cost: 0.0, // Variable operating & maintenance cost
          ramp_up: 1.0, // Ramp-up rate
          ramp_down: 1.0, // Ramp-down rate
          initial_load: 0.0, // Initial load
          initial_flow: 0.0, // Initial flow
          cap_ts: {
            ts_data: [
              { scenario: "s1", series: {} },
              { scenario: "s2", series: {} }
            ]
          }
        },
        {
          source: heater.id, // Now, the heater is the source
          sink: heater.roomId, // It supplies energy to the room it is located in
          capacity: heater.capacity, // Capacity between the heater and the room
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
      // Capacity Factor (cf) is used to represent the process's capacity over time
      cf: {
        ts_data: [
          { scenario: "s1", series: {} },
          { scenario: "s2", series: {} }
        ]
      },
      // Efficiency over time, which may vary depending on different scenarios
      eff_ts: {
        ts_data: [
          { scenario: "s1", series: {} },
          { scenario: "s2", series: {} }
        ]
      },
      eff_ops: [], // Operational efficiency functions (not used in this case)
      eff_fun: [] // Any specific efficiency-related functions (also not used here)
    };
    return acc;
  }, {});
};

export default generateProcessesData;
