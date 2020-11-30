import { customElement, html, LitElement, property } from 'lit-element';

import '@vaadin/vaadin-login/vaadin-login-overlay';
import { LoginI18n } from '@vaadin/vaadin-login/@types/interfaces';
import { Router, AfterEnterObserver, RouterLocation } from '@vaadin/router';
import type { LoginResult } from '@vaadin/flow-frontend';
import { rootStore } from '../../stores';
import { Lumo } from '../../utils/lumo';
import styles from './login-view.css';

@customElement('login-view')
export class LoginView extends LitElement implements AfterEnterObserver {

  @property({type: Boolean})
  private error = false;

  @property()
  private errorTitle = '';

  @property()
  private errorMessage = '';

  private returnUrl = '/';

  private onSuccess = (_: LoginResult) => { Router.go(this.returnUrl) };

  static styles = [Lumo, styles];

  private static overlayResult?: Promise<LoginResult>;
  static async showOverlay(): Promise<LoginResult> {
    if (this.overlayResult) {
      return this.overlayResult;
    }

    const overlay = new this();
    return this.overlayResult = new Promise(resolve => {
      overlay.onSuccess = result => {
        this.overlayResult = undefined;
        overlay.remove();
        resolve(result);
      }
      document.body.append(overlay);
    });
  }

  render() {
    return html`
      <vaadin-login-overlay
        opened 
        .error=${this.error}
        .i18n="${this.i18n}"
        @login="${this.login}">    
      </vaadin-login-overlay>
    `;
  }

  onAfterEnter(location: RouterLocation) {
    this.returnUrl = location.redirectFrom || this.returnUrl;
  }

  async login(event: CustomEvent): Promise<LoginResult> {
    this.error = false;
    const result = await rootStore.auth.login(event.detail.username, event.detail.password);
    this.error = result.error;
    this.errorTitle = result.errorTitle || this.errorTitle;
    this.errorMessage = result.errorMessage || this.errorMessage;

    if (!result.error) {
      this.onSuccess(result);
    }

    return result;
  }

  private get i18n(): LoginI18n {
    return {
      header: {
        title: 'Vaadin CRM',
        description: 'Demo app for the Java Web App tutorial series. Log in with user: user and password: password.'
      },
      form: {
        title: 'Log in',
        username: 'Username',
        password: 'Password',
        submit: 'Log in',
        forgotPassword: 'Forgot password'
      },
      errorMessage: {
        title: this.errorTitle,
        message: this.errorMessage
      },
    };
  }
}
