/**
 * Copyright 2025 petriedavid
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { ref } from "lit/directives/ref.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.max = 10;
    this.min = 0;
    this.count = 0;
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      min: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
      count: { type: Number, reflect: true },
    };
  }


  // handles updates and triggers confetti at max
  updated(changed) {
    if (super.updated) super.updated(changed);
    if (changed.has("count")) {
      if (this.count == this.max) {
        this.makeItRain();
      }
    }
  }

  // lazy load and activiation for confetti 
  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(() => {
      setTimeout(() => {
        const el = this.shadowRoot?.querySelector("#confetti");
        if (el) el.setAttribute("popped", "");
      }, 0);
    });
  }

  // determines color based on counter
  get #color() {
    if (this.count === this.min) return 'var(--ddd-theme-default-warningOrange)';
    if (this.count === this.max) return 'var(--ddd-theme-default-dangerRed)';
    if (this.count === 21) return 'var(--ddd-theme-default-electricGreen)';
    if (this.count === 18) return 'var(--ddd-theme-default-futureBlue)';
    return 'var(--ddd-theme-default-wonderPurple)';
  }
  // increase / decrease methods without exceeding limits
  #inc = () => { if (this.count < this.max) this.count += 1; };
  #dec = () => { if (this.count > this.min) this.count -= 1; };

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
        :host {
          display: block;
          background: #fff;
          border: 1px solid var(--ddd-border, #e5e7eb);
          border-radius: 8px;
          padding: 12px;
      }
        .wrap {
          display: grid;
          gap: 10px;
          justify-items: center;
      }
        .value {
          margin: 0;
          font-size: 48px; /* big number */
          font-weight: 800;
          line-height: 1;
          color: var(--number-color, var(--ddd-theme-default-wonderPurple, #1e407c));
          transition: color 120ms linear;
      }
        .controls {
          display: flex;
          gap: 8px; /* 8 / 16 rhythm */
      }
        button {
          font: inherit;
          border: 1px solid var(--ddd-theme-default-ink, #111827);
          background: var(--btn-bg-psu, #1e407c);
          color: var(--btn-fg-psu, #ffffff);
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
      }
        button:hover { opacity: 0.92; }
        button:focus-visible {
          outline: 2px solid var(--ddd-theme-default-futureBlue, #41b6e6);
          outline-offset: 2px;
      }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
      }
    `];
  }

  // Lit render the HTML
  render() {
    const atMin = this.count === this.min;
    const atMax = this.count === this.max;

    return html`
    <confetti-container id="confetti">
      <div class="wrap">
        <p class="value" style="--number-color:${this.#color}" aria-live="polite" aria-atomic="true">
          ${this.count}
        </p>

        <div class="controls" role="group" aria-label="Counter controls">
          <button @click=${this.#dec} ?disabled=${atMin} title="Decrease">−</button>
          <button @click=${this.#inc} ?disabled=${atMax} title="Increase">+</button>
        </div>
      </div>
    </confetti-container>
    `;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(CounterApp.tag, CounterApp);
