// src/services/homeAssistantService.js
import { HOME_ASSISTANT_URL, ACCESS_TOKEN } from '../config';

export const getDeviceState = async (entityId) => {
  try {
    const response = await fetch(`${HOME_ASSISTANT_URL}/api/states/${entityId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch device state');
      throw new Error('Failed to fetch device state');
    }
  } catch (error) {
    console.error('Error fetching device state:', error);
    throw error;
  }
};

export const callService = async (domain, service, entityId, data = {}) => {
  try {
    const response = await fetch(`${HOME_ASSISTANT_URL}/api/services/${domain}/${service}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entity_id: entityId, ...data }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to call service');
      throw new Error('Failed to call service');
    }
  } catch (error) {
    console.error('Error calling service:', error);
    throw error;
  }
};
