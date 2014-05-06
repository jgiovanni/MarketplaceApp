describe("module:ng.directive:ngSelected", function() {
  beforeEach(function() {
    browser.get("./examples/example-example10/index2.html");
  });

  it('should select Greetings!', function() {
    expect(element(by.id('greet')).getAttribute('selected')).toBeFalsy();
    element(by.model('selected')).click();
    expect(element(by.id('greet')).getAttribute('selected')).toBeTruthy();
  });
});