/* eslint-disable no-unused-vars */
/* eslint-disable require-await */
// @ts-check
import _ from 'lodash';

/**
 * @param {ReturnType<import('./settings').SettingsMixin>} Base
 * @returns {import('../driver').BaseDriverBase<import('@appium/types').TimeoutCommands & import('@appium/types').EventCommands & import('@appium/types').FindCommands & import('@appium/types').LogCommands & import('@appium/types').SettingsCommands & import('@appium/types').SessionCommands>}
 */
export function SessionMixin (Base) {
  return class SessionCommands extends Base {
    async getSessions () {
      let ret = [];

      if (this.sessionId) {
        ret.push({
          id: this.sessionId,
          capabilities: this.caps,
        });
      }

      return ret;
    }

    async getSession () {
      if (this.caps.eventTimings) {
        return Object.assign({}, this.caps, {events: this.eventHistory});
      }
      return this.caps;
    }
  };
}

export function fixCaps (originalCaps, desiredCapConstraints = {}, log) {
  let caps = _.clone(originalCaps);

  // boolean capabilities can be passed in as strings 'false' and 'true'
  // which we want to translate into boolean values
  let booleanCaps = _.keys(
    _.pickBy(desiredCapConstraints, (k) => k.isBoolean === true),
  );
  for (let cap of booleanCaps) {
    let value = originalCaps[cap];
    if (_.isString(value)) {
      value = value.toLowerCase();
      if (value === 'true' || value === 'false') {
        log.warn(
          `Capability '${cap}' changed from string to boolean. This may cause unexpected behavior`,
        );
        caps[cap] = value === 'true';
      }
    }
  }

  // int capabilities are often sent in as strings by frameworks
  let intCaps = _.keys(
    _.pickBy(desiredCapConstraints, (k) => k.isNumber === true),
  );
  for (let cap of intCaps) {
    let value = originalCaps[cap];
    if (_.isString(value)) {
      value = value.trim();
      let newValue = parseInt(value, 10);
      if (value !== `${newValue}`) {
        newValue = parseFloat(value);
      }
      log.warn(
        `Capability '${cap}' changed from string ('${value}') to integer (${newValue}). This may cause unexpected behavior`,
      );
      caps[cap] = newValue;
    }
  }

  return caps;
}
