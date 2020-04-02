// [Dependency File] - Cannot be used as a standalone library. Common functionality has been moved to a common library for all web components in the parent project to use.

// Credits
// iconmonstr:
//  file icon: https://iconmonstr.com/note-19-svg/

import Common from "../../common.js";

var instanceCount = 0;
const fileIconLiteral = `<svg class="icon file" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="main" d="M6 22v-16h16v7.543c0 4.107-6 2.457-6 2.457s1.518 6-2.638 6h-7.362zm18-7.614v-10.386h-20v20h10.189c3.163 0 9.811-7.223 9.811-9.614zm-10 1.614h-5v-1h5v1zm5-4h-10v1h10v-1zm0-3h-10v1h10v-1zm2-7h-19v19h-2v-21h21v2z"/></svg>`;
const fileIconSource = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNiAyMnYtMTZoMTZ2Ny41NDNjMCA0LjEwNy02IDIuNDU3LTYgMi40NTdzMS41MTggNi0yLjYzOCA2aC03LjM2MnptMTgtNy42MTR2LTEwLjM4NmgtMjB2MjBoMTAuMTg5YzMuMTYzIDAgOS44MTEtNy4yMjMgOS44MTEtOS42MTR6bS0xMCAxLjYxNGgtNXYtMWg1djF6bTUtNGgtMTB2MWgxMHYtMXptMC0zaC0xMHYxaDEwdi0xem0yLTdoLTE5djE5aC0ydi0yMWgyMXYyeiIvPjwvc3ZnPg==";
const defaultPreviewWidth = 480;

export default class FileSelector extends HTMLElement
{
    // Basic component scaffolding
    static get instances() { return instanceCount; }
    static set instances(value) { instanceCount = value; }
    static get observedAttributes() { return ['identifier', 'filetypes', 'browsetext', 'cleartext', 'icon']; }
    static register() { if(!customElements.get('file-selector')) { customElements.define('file-selector', FileSelector); } }
    connectedCallback() { this._init(); this.__isConnected = true; this.__classOverrride_dispatchEvent(this, 'onconnect'); }
    disconnectedCallback() { this.__isConnected = false; this.__classOverrride_dispatchEvent(this, 'ondisconnect'); }
    adoptedCallback() { this.__classOverrride_dispatchEvent(this, 'onadopted'); }
    __classOverrride_dispatchEvent($target, eventName, data) { if($target == this) { let customEvent = (data) ? new CustomEvent(eventName, { detail: data }) : new CustomEvent(eventName); this.dispatchEvent(customEvent); } Common.dispatchEventToAttributeHandlers($target, eventName, data); }
    
    // component definition
    get identifier()
    {
        if(this._identifier == null)
        {
            if(this.title == null || this.title.trim() == "")
            {
                //generate uuidv4
                this._identifier = Common.getUUID();
            }
            else
            {
                //slugify title
                this._identifier = Common.toKebabCase(this.title);
            }
        }

        return this._identifier;
    }
    set identifier(value)
    {
        this._identifier = value;

        if(this.$input != null)
        {
            this.$input.id = value;
        }
        if(this.$browseButton != null)
        {
            this.$browseButton.setAttribute('for', value);
        }
    }

    get $videoPreview()
    {
        if(this._$videoPreview == null)
        {
            this._$videoPreview = document.createElement('video');
            this._$videoPreview.width = defaultPreviewWidth;
        }
        return this._$videoPreview;
    }
    get $videoPreviewCanvas()
    {
        if(this._$videoPreviewCanvas == null)
        {
            this._$videoPreviewCanvas = document.createElement('canvas');
        }
        return this._$videoPreviewCanvas;
    }
    get videoPreviewCanvasBufferContext()
    {
        if(this._videoPreviewCanvasBufferContext == null)
        {
            this._videoPreviewCanvasBufferContext = this.$videoPreviewCanvas.getContext('2d');
        }
        return this._videoPreviewCanvasBufferContext;
    }

    constructor(attributes)
    {
        super();

        this.pages = {};

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

        if(name == 'filetypes')
        {
            this.$input.accept = newValue;
        }
        if(name === 'identifier')
        {
            this.identifier = newValue;
        }
        if(name === 'browsetext')
        {
            this.$browseButton.$description.textContent = newValue;
        }
        if(name == 'cleartext')
        {
            this.$clearButton.title = newValue;
        }
        if(name == 'icon')
        {
            this.$browseButton.removeChild(this.$browseButton.$description);
            this.$browseButton.innerHTML = decodeURIComponent(newValue);
            this.$browseButton.appendChild(this.$browseButton.$description);
        }
        
        this.__classOverrride_dispatchEvent(this, 'onattributechanged', { name: name, oldValue: oldValue, newValue: newValue });
    }

    _init()
    {
        this._addFunctionalStyles();
        this._createStaticElements();
        this._addEventListeners();
       
        FileSelector.instances++;
    }
    _addFunctionalStyles()
    {
        let indexStyle = document.styleSheets[0];
        indexStyle.insertRule(`file-selector .value { display: none; }`);
        indexStyle.insertRule(`file-selector .preview[src=""] ~ .clear { display: none; }`);
        indexStyle.insertRule(`file-selector .preview:not([src=""]) ~ .browse { display: none; }`);
    }
    _createStaticElements()
    {
        let identifier = this.getAttribute('identifier');
        let iconLiteral = this.getAttribute('icon') || fileIconLiteral;
        let browseText = this.getAttribute('browsetext') || "Select a file...";
        let clearText = this.getAttribute('cleartext') || "Clear selected file";
        let filetypes = this.getAttribute('filetypes') || '*';

        if(identifier != null && identifier.trim() != '')
        {
            this.identifier = identifier;
        }

        let elementLiteral = `<label>
        <input class="value" type="file" id="${this.identifier}" accept="${filetypes}">
        <img class="preview" src="" width="${defaultPreviewWidth}">
        <label class="button browse" for="${this.identifier}">
            ${decodeURIComponent(iconLiteral)}
            <span>${browseText}</span>
        </label>
        </label>
        <button class="clear" title="${clearText}">×</button>`;

        this.innerHTML = elementLiteral;

        this.$input = this.querySelector('input');
        this.$preview = this.querySelector('.preview');
        this.$browseButton = this.querySelector('.button.browse');
        this.$browseButton.$description = this.$browseButton.querySelector('span');
        this.$clearButton = this.querySelector('.clear');
    }
    _addEventListeners()
    {
        this.$browseButton.addEventListener('click', this._browseButton_OnClick.bind(this));
        this.$input.addEventListener('change', this._input_OnChange.bind(this));       
        this.$clearButton.addEventListener('click', this._clearButton_OnClick.bind(this)); 
    }

    //handlers
    _browseButton_OnClick(event)
    {
        this.$input.value = null;
    }
    _input_OnChange(event)
    {
        let input = event.currentTarget;
        if(input.value == null || input.value.trim() == "")
        {
            return;
        }

        if (input.files && input.files[0])
        {
            var reader = new FileReader();
            
            reader.onload = (event) =>
            {
                let dataUrl = event.target.result;

                let onload = () =>
                {
                    this.__classOverrride_dispatchEvent(this, 'previewload');
                    this.$preview.removeEventListener('load', onload);
                }
                this.$preview.addEventListener('load', onload);  

                if(dataUrl.startsWith('data:video/'))
                {
                    let onVideoLoaded = () =>
                    {
                        this.$videoPreview.currentTime = this.$videoPreview.duration / 2;

                        let timeout = 1000;
                        let elapsed = 0;
                        let interval = setInterval(() =>
                        {
                            elapsed++;
                            if(this.$videoPreview.readyState >= 2)
                            {
                                clearInterval(interval);
                                this.$videoPreviewCanvas.width = this.$videoPreview.videoWidth;
                                this.$videoPreviewCanvas.height = this.$videoPreview.videoHeight;
                                this.videoPreviewCanvasBufferContext.drawImage(this.$videoPreview, 0, 0, this.$videoPreview.videoWidth, this.$videoPreview.videoHeight);
                                let previewUrl = this.$videoPreviewCanvas.toDataURL();
                                this.$preview.setAttribute('src', previewUrl);
                            }

                            if(elapsed > timeout)
                            {
                                this.$preview.setAttribute('src', fileIconSource);
                                clearInterval(interval);
                            }
                        }, 2);
                    }
                    this.$videoPreview.addEventListener('loadedmetadata', onVideoLoaded, {once: true})
                    this.$videoPreview.src = dataUrl;
                }
                else if(dataUrl.startsWith('data:image/'))
                {
                    this.$preview.setAttribute('src', event.target.result);
                }
                else
                {
                    this.$preview.setAttribute('src', fileIconSource);
                }              
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }
    _clearButton_OnClick(event)
    {
        this.clearSelection();
    }

    //functionality
    clearSelection()
    {
        this.$input.value = null;
        this.$preview.src = "";
        this.__classOverrride_dispatchEvent(this, 'previewclear');
    }
}