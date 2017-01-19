import { ClueAppPage } from './app.po';

describe('clue-app App', function() {
  let page: ClueAppPage;

  beforeEach(() => {
    page = new ClueAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
