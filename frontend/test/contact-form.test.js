import { expect } from '@esm-bundle/chai';
import { fixture, html } from '@open-wc/testing-helpers';
import '../components/contact-form/contact-form.ts';

describe('contact-form', () => {
  let form, save

  const contact = {
    email: 'foo@gmail.com',
    firstName: 'Foo',
    lastName: 'Bar'
  };

  beforeEach(async () => {
    form = await fixture(html`<contact-form .contact="${contact}"></contact-form>`);
    save = form.renderRoot.querySelector('vaadin-button');
  });

  it('should make Save button disabled by default', () => {
    expect(save.disabled).to.be.true;
  });
});
