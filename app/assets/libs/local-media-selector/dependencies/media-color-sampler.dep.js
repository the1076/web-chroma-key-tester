// [Dependency File] - Cannot be used as a standalone library. Common functionality has been moved to a common library for all web components in the parent project to use.

// Credits
// iconmonstr:
//  eyedropper icon: https://iconmonstr.com/eyedropper-3-svg/
//  play icon: https://iconmonstr.com/media-control-48-svg/
//  pause icon: https://iconmonstr.com/media-control-49-svg/

import Common from "../../common.js";

var instanceCount = 0;
const eyedropperIconLiteral = `<svg class="icon eyedropper" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="main" d="M18.717 8.831c-.734.824-.665 2.087.158 2.825l-1.333 1.491-7.455-6.667 1.334-1.49c.822.736 2.087.666 2.822-.159l3.503-3.831c.593-.663 1.414-1 2.238-1 1.666 0 3.016 1.358 3.016 2.996 0 .723-.271 1.435-.779 2.005l-3.504 3.83zm-8.217 6.169h-2.691l3.928-4.362-1.491-1.333-7.9 8.794c-1.277 1.423-.171 2.261-1.149 4.052-.135.244-.197.48-.197.698 0 .661.54 1.151 1.141 1.151.241 0 .492-.079.724-.256 1.733-1.332 2.644-.184 3.954-1.647l7.901-8.792-1.491-1.333-2.729 3.028z"/></svg>`;
const playIconLiteral = `<svg class="icon play" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="main" d="M3 22v-20l18 10-18 10z"/></svg>`;
const pauseIconLiteral = `<svg class="icon pause" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="main" d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z"/></svg>`;

export default class MediaColorSampler extends HTMLElement
{
    // Basic component scaffolding
    static get instances() { return instanceCount; }
    static set instances(value) { instanceCount = value; }
    static get observedAttributes() { return ['color', 'sourcequery']; }
    static register() { if(!customElements.get('media-color-sampler')) { customElements.define('media-color-sampler', MediaColorSampler); } }
    connectedCallback() { this._init(); this.__isConnected = true; this.__classOverrride_dispatchEvent(this, 'onconnect'); }
    disconnectedCallback() { this.__isConnected = false; this.__classOverrride_dispatchEvent(this, 'ondisconnect'); }
    adoptedCallback() { this.__classOverrride_dispatchEvent(this, 'onadopted'); }
    __classOverrride_dispatchEvent($target, eventName, data) { if($target == this) { let customEvent = (data) ? new CustomEvent(eventName, { detail: data }) : new CustomEvent(eventName); this.dispatchEvent(customEvent); } Common.dispatchEventToAttributeHandlers($target, eventName, data); }
    
    // component definition
    constructor($source, attributes)
    {
        super();

        this.setSource($source);

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

        if(name == 'color')
        {
            this.setColor(newValue);
        }
        if(name == 'sourcequery')
        {
            this.setSourceFromQuery(newValue);
        }
        
        this.__classOverrride_dispatchEvent(this, 'onattributechanged', { name: name, oldValue: oldValue, newValue: newValue });
    }

    _init()
    {
        this.seeking = false;
        this.boundMouseMoveHandler = this._seeker_onMouseMove.bind(this);

        this._addFunctionalStyles();
        this._createStaticElements();
        this._addEventListeners();
       
        MediaColorSampler.instances++;
    }
    _addFunctionalStyles()
    {
        if(MediaColorSampler.instances > 0)
        {
            return;
        }

        let indexStyle = document.styleSheets[0];
        indexStyle.insertRule(`media-color-sampler { display: flex; max-height: 35px; }`);
        indexStyle.insertRule(`media-color-sampler button.eyedropper { display: flex; align-items:center; justify-content: center; margin-right: 10px; }`);
        indexStyle.insertRule(`media-color-sampler button.eyedropper .icon { --size: 16px; width:var(--size); height:var(--size); }`);
        indexStyle.insertRule(`media-color-sampler input[type="color"] { height: auto; margin-right: 10px; }`);
        indexStyle.insertRule(`.media-color-sampler-modal { position: fixed; top: 0; left: 0; z-index: 9999; display: flex; align-items:center; justify-content: center; width: 100vw; height: 100vh; background-color:rgba(0,0,0,.3); }`);
        indexStyle.insertRule(`.media-color-sampler-modal .window { margin: 2em; max-width: 800px; min-height: 400px; background-color:#fff; border-radius: 3px; box-shadow: 0 0 2px 5px rgba(0,0,0,.1); border: solid 1px #ddd; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .stage { cursor: crosshair; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls { display: none; align-items; center; justify-content: space-between; background-color:#333; color: #666; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .window.video .controls { display: flex;`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle { display: flex; align-items; center; justify-content: center; background: none; border: none; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle:focus,.media-color-sampler-modal .controls .play-toggle:active  { outline: none; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle .icon .main { fill: #666; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle:focus .icon .main, .media-color-sampler-modal .controls .play-toggle:active .icon .main { fill: #999; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle .play { display:block; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle .pause { display:none; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle.play .pause { display:block; }`);
        indexStyle.insertRule(`.media-color-sampler-modal .controls .play-toggle.play .play { display:none; }`);

        let userAgentRules = 
        [
            '.media-color-sampler-modal .controls .seeker { -webkit-appearance: none !important;  margin:10px 0px;  padding:0px; background: #666; height:5px; }',
            '.media-color-sampler-modal .controls .seeker:focus, .media-color-sampler-modal .controls .seeker:active { outline: none; }',
            '.media-color-sampler-modal .controls .seeker::-ms-fill-lower  {  background:#666; }',
            '.media-color-sampler-modal .controls .seeker::-ms-fill-upper  {  background:#666; }',
            '.media-color-sampler-modal .controls .seeker::-moz-range-track {  border:none; background: #666; }',
            '.media-color-sampler-modal .controls .seeker::-webkit-slider-thumb { -webkit-appearance: none !important; background: #999; height:12px; width:12px;  border-radius:100%;  cursor:pointer; border: solid 1px #888; }',
            '.media-color-sampler-modal .controls .seeker::-moz-range-thumb { background: #999; height:11px; width:11px;  border-radius:100%;  cursor:pointer; border: solid 1px #888; }',
            '.media-color-sampler-modal .controls .seeker::-ms-thumb { -webkit-appearance: none !important; background: #999; height:11px; width:11px;  border-radius:100%;  cursor:pointer; border: solid 1px #888; }'
        ];
        for(let i = 0; i < userAgentRules.length; i++)
        {
            let rule = userAgentRules[i];
            try { indexStyle.insertRule(rule); } catch(exception) { /* do nothing */ }
        }
    }
    _createStaticElements()
    {
        let selectionDescription = this.getAttribute('selectiondescription') || 'Click a point on the image to sample a color from that point.';

        this.innerHTML = `<button class="eyedropper">${eyedropperIconLiteral}</button>
        <input type="color" />
        <input type="text" />`;

        this.$eyedropperButton = this.querySelector('button.eyedropper');
        this.$color = this.querySelector('input[type="color"]');
        this.$hex = this.querySelector('input[type="text"]');

        this.$modal = document.createElement('div');
        this.$modal.classList.add('media-color-sampler-modal');
        this.$modal.innerHTML = `<div class="window">
            <header>
                <div class="description">${selectionDescription}</div>
            </header>
            <canvas class="stage"></canvas>
            <div class="controls">
                <button class="play-toggle">
                    ${playIconLiteral}
                    ${pauseIconLiteral}
                </button>
                <input class="seeker" type="range" min="0" max="100" step="1" />
            </div>
        </div>`;

        this.$overlay = this.$modal.querySelector('.overlay');
        this.$window = this.$modal.querySelector('.window');
        this.$stage = this.$modal.querySelector('.stage');
        this.$playToggle = this.$modal.querySelector('.play-toggle');
        this.$seeker = this.$modal.querySelector('.seeker');

        this.$stage.context = this.$stage.getContext('2d');

        let color = this.getAttribute('color') || '#FFFFFF';
        this.setColor(color);
        let sourceQuery = this.getAttribute('sourcequery');
        if(sourceQuery) { this.setSourceFromQuery(sourceQuery); }
    }
    _addEventListeners()
    {
        this.$hex.addEventListener('paste', this._hex_onPaste.bind(this));
        this.$eyedropperButton.addEventListener('click', this._eyedropper_onClick.bind(this));
        this.$color.addEventListener('change', this._color_onChange.bind(this));
        this.$playToggle.addEventListener('click', this._playToggle_onClick.bind(this));
        this.$seeker.addEventListener('mousedown', this._seeker_onMouseDown.bind(this));
        this.$seeker.addEventListener('mouseup', this._seeker_onMouseUp.bind(this));
        this.$seeker.addEventListener('change', this._seeker_onChange.bind(this));
    }

    // handlers
    _hex_onPaste(event)
    {
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        paste = (paste.startsWith('#')) ? paste.substring(1) : paste;
        this.$hex.value = paste;

        event.preventDefault();
    }

    async _eyedropper_onClick(event)
    {
        if(this.$source == null)
        {
            console.warn("Cannot select color when no source has been provided.");
            return;
        }

        if(this.sourceType == 'image')
        {
            this.$stage.context.drawImage(this.$source, 0, 0, this.$stage.width, this.$stage.height);
        }
        else if(this.sourceType == 'video')
        {
            this.$seeker.value = 0;
            this.$source.currentTime = 0;
            this.$source.play().then(() => { this.$source.pause(); });
            this.$stage.context.drawImage(this.$source, 0, 0, this.$stage.width, this.$stage.height);
        }

        // add listener to handle canvas click as well as close-modal clicks
        // note: can't use the 'once' argument on a document listener because only two code paths need to remove the listener, rather than all of them.
        let documentHandler = (event) =>
        {
            try
            {
                if(this.$stage == event.target || this.$stage.contains(event.target))
                {
                    let pixelData = this.$stage.context.getImageData(event.offsetX, event.offsetY, 1, 1).data;
                    let hex = this.rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
                    this.setColor(hex);
                }
                else if(this.$window == event.target || this.$window.contains(event.target))
                {
                    return;
                }
                document.removeEventListener('click', boundDocumentHandler);
                document.body.removeChild(this.$modal);
            }
            catch(exception)
            {
                console.error(exception);
                document.removeEventListener('click', boundDocumentHandler);
                document.body.removeChild(this.$modal);
            }
        };
        let boundDocumentHandler = documentHandler.bind(this);

        document.addEventListener('click', boundDocumentHandler);
        document.body.appendChild(this.$modal);

        event.preventDefault();
        event.stopPropagation();
    }

    _color_onChange(event)
    {
        let input = event.currentTarget;
        this.setColor(input.value);
    }

    _playToggle_onClick(event)
    {
        if(this.$source.paused)
        {
            this.$playToggle.classList.add('play');
            this.playSource();
        }
        else
        {
            this.$playToggle.classList.remove('play');
            this.pauseSource();
        }
    }

    _onAnimationFrame(event)
    {
        if(this._isPlaying)
        {
            this.$seeker.value = (this.$source.currentTime/this.$source.duration) * parseFloat(this.$seeker.max);
            this.$stage.context.drawImage(this.$source, 0, 0, this.$stage.width, this.$stage.height);
            requestAnimationFrame(this._onAnimationFrame.bind(this));
        }
    }

    _seeker_onMouseDown(event)
    {
        this.$seeker.addEventListener('mousemove', this.boundMouseMoveHandler);
    }
    _seeker_onMouseMove(event)
    {
        this.$source.currentTime = this.$source.duration * (this.$seeker.value / 100);
        this.$stage.context.drawImage(this.$source, 0, 0, this.$stage.width, this.$stage.height);
    }
    _seeker_onChange(event)
    {
        this.$source.currentTime = this.$source.duration * (this.$seeker.value / 100);
        this.$stage.context.drawImage(this.$source, 0, 0, this.$stage.width, this.$stage.height);
    }
    _seeker_onMouseUp(event)
    {
        this.$seeker.removeEventListener('mousemove', this.boundMouseMoveHandler);
    }

    // functionality
    setSourceFromQuery(query)
    {
        let $element = document.querySelector(query);
        this.setSource($element);
    }
    setSource($element)
    {
        this.$source = $element;
        if(this.$source != null)
        {
            if(this.$source.tagName.toLowerCase() == 'img')
            {
                this.$stage.width = this.$source.width;
                this.$stage.height = this.$source.height;
                this.sourceType = 'image';
                this.$window.classList.remove('video');
            }
            else if(this.$source.tagName.toLowerCase() == 'video')
            {
                this.$stage.width = this.$source.width;
                this.$stage.height = this.$source.width * (this.$source.videoHeight/this.$source.videoWidth);
                this.sourceType = 'video';
                this.$window.classList.add('video');
            }
        }
    }

    setColor(hex)
    {
        this.$color.value = hex;
        this.$hex.value = hex.substring(1).toUpperCase();
        this.value = hex;

        this.__classOverrride_dispatchEvent(this, 'colorchange', { color: this.value });
    }

    rgbToHex(r, g, b)
    {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    playSource()
    {
        this.$source.play();
        this._isPlaying = true;
        requestAnimationFrame(this._onAnimationFrame.bind(this));
    }
    pauseSource()
    {
        this.$source.pause();
        this._isPlaying = false;
    }
}