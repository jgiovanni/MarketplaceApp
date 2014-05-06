describe("module:ng.directive:ngValue", function() {
  beforeEach(function() {
    browser.get("./examples/example-ngValue-directive/index2.html");
  });

  var favorite = element(by.binding('my.favorite'));

  it('should initialize to model', function() {
    expect(favorite.getText()).toContain('unicorns');
  });
  it('should bind the values to the inputs', function() {
    element.all(by.model('my.favorite')).get(0).click();
    expect(favorite.getText()).toContain('pizza');
  });
});