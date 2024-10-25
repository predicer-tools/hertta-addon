// data_processor.rs

use crate::input_data::{InputData, TimeSeriesData, TimeSeries};
use std::collections::BTreeMap;

pub fn generate_control_results(input_data: &InputData) -> BTreeMap<String, TimeSeriesData> {
    let mut control_results = BTreeMap::new();

    // Assuming devices are represented by processes in InputData
    for (device_id, _process) in &input_data.processes {
        // Create imaginary test control data as TimeSeriesData with on/off timeseries
        let mut series = BTreeMap::new();
        let mut value = 0.0;

        for time in &input_data.temporals.t {
            // Alternate between 0.0 and 1.0
            value = if value == 0.0 { 1.0 } else { 0.0 };
            series.insert(time.clone(), value);
        }

        let time_series = TimeSeries {
            scenario: "default".to_string(),
            series,
        };

        let time_series_data = TimeSeriesData {
            ts_data: vec![time_series],
        };

        control_results.insert(device_id.clone(), time_series_data);
    }

    control_results
}
