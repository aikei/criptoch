'use strict';

angular.module('crApp.version', [
  'crApp.version.interpolate-filter',
  'crApp.version.version-directive'
])

.value('version', '0.1');
