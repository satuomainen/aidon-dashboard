export const topicNames = {
  cumulative_active_export: 'Cumulative hourly active export (kWh)',
  cumulative_active_import: 'Cumulative hourly active import (kWh)',
  cumulative_reactive_export: 'Cumulative hourly reactive export (kVarh)',
  cumulative_reactive_import: 'Cumulative hourly reactive export (kVarh)',
  current_phase_1: 'Current L1 (A)',
  current_phase_2: 'Current L2 (A)',
  current_phase_3: 'Current L3 (A)',
  momentary_active_export: 'Active export total (kW)',
  momentary_active_export_phase_1: 'Active export L1 (kW)',
  momentary_active_export_phase_2: 'Active export L2 (kW)',
  momentary_active_export_phase_3: 'Active export L3 (kW)',
  momentary_active_import: 'Active import total (kW)',
  momentary_active_import_phase_1: 'Active import L1 (kW)',
  momentary_active_import_phase_2: 'Active import L1 (kW)',
  momentary_active_import_phase_3: 'Active import L1 (kW)',
  momentary_reactive_export: 'Reactive export total (kVar)',
  momentary_reactive_export_phase_1: 'Reactive export L1 (kVar)',
  momentary_reactive_export_phase_2: 'Reactive export L2 (kVar)',
  momentary_reactive_export_phase_3: 'Reactive export L3 (kVar)',
  momentary_reactive_import: 'Reactive import total kVar',
  momentary_reactive_import_phase_1: 'Reactive import L1 (kVar)',
  momentary_reactive_import_phase_2: 'Reactive import L2 (kVar)',
  momentary_reactive_import_phase_3: 'Reactive import L3 (kVar)',
  voltage_phase_1: 'Voltage L1 (V)',
  voltage_phase_2: 'Voltage L2 (V)',
  voltage_phase_3: 'Voltage L3 (V)'
};


/**
 * Transform
 *  "topicPrefix/sensor/cumulative_active_export/state"
 * to
 *  "cumulative_active_export"
 *
 * @param topic
 * @return {string}
 */
export function defaultSubtopicExtractor(topic) {
  const parts = topic?.split('/');
  if (!parts || !Array.isArray(parts)) {
    return '-';
  }

  if (parts.length < 3) {
    return parts[1];
  }

  return parts[2];
}

export default function localizeTopic(topic) {
  return topicNames[defaultSubtopicExtractor(topic)] ?? topic;
}
