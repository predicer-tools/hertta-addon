// Function to generate processes data for electric heaters
const generateProcessesData = (electricHeaters) => {
  return electricHeaters.reduce((acc, heater) => {
    acc[heater.id] = {
      id: heater.id,                      // ID for easier reference
      name: heater.name || heater.id,     // Name of the heater process, or ID as default
      groups: heater.groups || [],        // Group information, empty by default
      conversion: heater.conversion || 1, // Default conversion value is 1
      is_cf: heater.is_cf || false,       // Whether the heater has a capacity factor
      is_cf_fix: heater.is_cf_fix || false, // Whether the capacity factor is fixed
      is_online: heater.is_online || false, // Assuming the heater starts offline
      is_res: heater.is_res || false,     // Not a reserve unit by default
      eff: heater.eff || 1.0,             // Efficiency, default is 1.0
      load_min: heater.load_min || 0.0,   // Minimum load the heater can handle
      load_max: heater.load_max || 1.0,   // Maximum load
      start_cost: heater.start_cost || 0.0, // Cost to start the heater
      min_online: heater.min_online || 0.0, // Minimum time to remain online
      min_offline: heater.min_offline || 0.0, // Minimum time to remain offline
      max_online: heater.max_online || 0.0,   // Maximum time the heater can stay online
      max_offline: heater.max_offline || 0.0, // Maximum time the heater can stay offline
      initial_state: heater.initial_state || true, // Initial state is active by default
      is_scenario_independent: heater.is_scenario_independent || false, // Whether the process changes with scenarios
      topos: heater.topos || [],          // Topology data, empty by default
      cf: heater.cf || {},                // Capacity factor, empty by default
      eff_ts: heater.eff_ts || {},        // Efficiency over time, empty by default
      eff_ops: heater.eff_ops || [],      // Operational efficiency functions, empty by default
      eff_fun: heater.eff_fun || []       // Specific efficiency-related functions, empty by default
    };
    return acc;
  }, {});
};

export default generateProcessesData;
