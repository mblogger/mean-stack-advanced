import { AppPage } from './app.po';

describe('Add Post using Angular App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Add Post using Angular');
  });
});
