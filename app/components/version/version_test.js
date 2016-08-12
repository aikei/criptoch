'use strict';

describe('crApp.version module', function() {
  beforeEach(module('crApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
