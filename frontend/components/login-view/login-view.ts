import { customElement, html, LitElement, property } from 'lit-element';

import '@vaadin/vaadin-login/vaadin-login-overlay';
import { LoginI18n } from '@vaadin/vaadin-login/@types/interfaces';
import { Router, AfterEnterObserver, RouterLocation } from '@vaadin/router';
import { LoginResult, login } from '@vaadin/flow-frontend';
import { Lumo } from '../../utils/lumo';
import styles from './login-view.css';

@customElement('login-view')
export class LoginView extends LitElement implements AfterEnterObserver {

  @property({type: Boolean})
  private error = false;

  @property({type: Boolean})
  private open = true;

  @property()
  private errorTitle = '';

  @property()
  private errorMessage = '';

  private returnUrl = '/';

  private onSuccess: (result:LoginResult) => void;

  static styles = [Lumo, styles];

  constructor(){
    super();
    this.onSuccess = () => {
      Router.go(this.returnUrl);
    };
  }

  async showOverlay(): Promise<LoginResult>{
    return new Promise(resolve => {
      this.onSuccess = (result: LoginResult) => {
        this.remove();
        resolve(result);
      }
      document.body.append(this);
    });
  }

  render() {
    return html`
      <vaadin-login-overlay
        ?opened="${this.open}" 
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
    const result = await login(event.detail.username, event.detail.password);
    this.error = result.error;
    this.errorTitle = result.errorTitle || this.errorTitle;
    this.errorMessage = result.errorMessage || this.errorMessage;

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
