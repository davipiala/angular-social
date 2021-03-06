'use strict';

describe('Directive updateStatusForm: ', function () {

  beforeEach( module('angularTinySocialApp') );

  beforeEach(inject(function ($rootScope, $httpBackend, $timeout, $compile) {
    this.$httpBackend = $httpBackend;
    this.$timeout = $timeout;

    this.$scope = $rootScope.$new();
    this.$scope.feeds = [];

    this.$element = $compile('<update-status-form></update-status-form>')(this.$scope);
    $rootScope.$apply();
    this.controller = this.$element.controller('updateStatusForm');
  }));


  afterEach(function () {
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.$httpBackend.verifyNoOutstandingRequest();
  });


  it('When form validation fails, should not post', function () {
    this.controller.send(this.$scope.form);

    this.$scope.feeds.length.should.equal(0);
    this.controller.failSendStatus.should.equal(false);
  });


  it('Insert the POST response into the list of feeds and clear the data', function () {
    this.$scope.form.text.$setViewValue('Testing');
    this.$timeout.flush(); //needed because the form has debounce options

    var spy = jasmine.createSpy('newsFeed-top-spy');
    this.$scope.$on('newsFeed-top', spy);

    this.$httpBackend.expectPOST('/api/status').respond(200, {});
    this.controller.send(this.$scope.form);
    this.$httpBackend.flush();

    expect(spy).toHaveBeenCalled();
    this.controller.formModel.text.should.equal('');
    this.controller.failSendStatus.should.equal(false);
    this.$scope.form.$pristine.should.equal(true);
  });
});
