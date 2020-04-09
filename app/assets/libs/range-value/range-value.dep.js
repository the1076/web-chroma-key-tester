// [Dependency File] - Cannot be used as a standalone library. Common functionality has been moved to a common library for all web components in the parent project to use.

import Common from "../common.js";

var instanceCount = 0;

export default class RangeValue extends HTMLElement
{
    // Basic component scaffolding
    static get instances() { return instanceCount; }
    static set instances(value) { instanceCount = value; }
    static get observedAttributes() { return ['value', 'min', 'max', 'step', 'placeholder']; }
    static register() { if(!customElements.get('range-value')) { customElements.define('range-value', RangeValue); } }
    connectedCallback() { this._init(); this.__isConnected = true; this.__classOverrride_dispatchEvent(this, 'onconnect'); }
    disconnectedCallback() { this.__isConnected = false; this.__classOverrride_dispatchEvent(this, 'ondisconnect'); }
    adoptedCallback() { this.__classOverrride_dispatchEvent(this, 'onadopted'); }
    __classOverrride_dispatchEvent($target, eventName, data) { if($target == this) { let customEvent = (data) ? new CustomEvent(eventName, { detail: data }) : new CustomEvent(eventName); this.dispatchEvent(customEvent); } Common.dispatchEventToAttributeHandlers($target, eventName, data); }
    
    // component definition
    get value() { return this._value; }
    set value(val) { this._value = val; if(this.$number) { this.$number.value = val; } if(this.$range) { this.$range.value = val; } }
    get min() { return this._min; }
    set min(val) { this._min = val; if(this.$number) { this.$number.min = val; } if(this.$range) { this.$range.min = val; } }
    get max() { return this._max; }
    set max(val) { this._max = val; if(this.$number) { this.$number.max = val; } if(this.$range) { this.$range.max = val; } }
    get step() { return this._step; }
    set step(val) { this._step = val; if(this.$number) { this.$number.step = val; } if(this.$range) { this.$range.step = val; } }
    get placeholder() { return this._placeholder; }
    set placeholder(val) { this._placeholder = val; if(this.$number) { this.$number.placeholder = val; } }

    constructor(attributes)
    {
        super();

        if(attributes != null)
        {
            for(let property in attributes)
            {
                if(attributes.hasOwnProperty(property))
                {
                    this.setAttribute(property, attributes[property]);
                }
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue)
    {
        if(!this.__isConnected)
        {
            return;
        }

        if(RangeValue.observedAttributes.indexOf(name) > -1)
        {
            this[name] = newValue;
        }
        
        this.__classOverrride_dispatchEvent(this, 'onattributechanged', { name: name, oldValue: oldValue, newValue: newValue });
    }

    _init()
    {
        this._createStaticElements();
        this._addEventListeners();
       
        RangeValue.instances++;
    }
    _createStaticElements()
    {
        this.innerHTML = `<input type="range" min="${this.min}" max="${this.max}" step="${this.step}" orient="vertical" />
        <input type="number" placeholder="${this.placeholder}" />`;

        this.$range = this.querySelector('input[type="range"]');
        this.$number = this.querySelector('input[type="number"]');

        this.value = this.getAttribute('value');
        this.min = this.getAttribute('min') || '';
        this.max = this.getAttribute('max') || '';
        this.step = this.getAttribute('step') || '';
        this.placeholder = this.getAttribute('placeholder') || '';
    }
    _addEventListeners()
    {
        this.$range.addEventListener('input', this._range_onInput.bind(this));
        this.$number.addEventListener('change', this._number_onChange.bind(this));
    }

    // handlers
    _range_onInput(event)
    {
        this.value = event.currentTarget.value;
    }
    _number_onChange(event)
    {
        this.value = event.currentTarget.value;
    }
}
