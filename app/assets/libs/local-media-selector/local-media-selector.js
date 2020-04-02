// [Dependency File] - Cannot be used as a standalone library. Common functionality has been moved to a common library for all web components in the parent project to use.

// Credits
// iconmonstr:
//  image icon: https://iconmonstr.com/picture-6-svg/
//  video icon: https://iconmonstr.com/video-5-svg/
//  media icon: https://iconmonstr.com/picture-17-svg/

import Common from "../common.js";
import FileSelector from "./dependencies/file-selector.dep.js";
import MediaColorSampler from "./dependencies/media-color-sampler.dep.js";

var instanceCount = 0;
const imageIconLiteral = `<svg class="icon image" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="main" d="M9 12c0-.552.448-1 1.001-1s.999.448.999 1-.446 1-.999 1-1.001-.448-1.001-1zm6.2 0l-1.7 2.6-1.3-1.6-3.2 4h10l-3.8-5zm5.8-7v-2h-21v15h2v-13h19zm3 2v14h-20v-14h20zm-2 2h-16v10h16v-10z"/></svg>`;
const videoIconLiteral = `<svg class="icon video" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="main" d="M4 5v18h20v-18h-20zm4 16h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm10 12h-8v-6h8v6zm0-8h-8v-6h8v6zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm-1-6h-19v17h-2v-19h21v2z"/></svg>`;
const mediaIconLiteral = `<svg class="icon media" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class="main" d="M1.859 6l-.489-2h21.256l-.491 2h-20.276zm1.581-4l-.439-2h17.994l-.439 2h-17.116zm20.56 16h-24l2 6h20l2-6zm-20.896-2l-.814-6h19.411l-.839 6h2.02l1.118-8h-24l1.085 8h2.019zm2.784-3.995c-.049-.555.419-1.005 1.043-1.005.625 0 1.155.449 1.185 1.004.03.555-.438 1.005-1.044 1.005-.605 0-1.136-.449-1.184-1.004zm7.575-.224l-1.824 2.68-1.813-1.312-2.826 2.851h10l-3.537-4.219z"/></svg>`;
const typeMap = 
{
    image: { filetypes:"image/*", icon: encodeURIComponent(imageIconLiteral), browsetext:"Select an image...", cleartext: "Clear selected image", target: "$preview" },
    video: { filetypes:"video/*", icon: encodeURIComponent(videoIconLiteral), browsetext:"Select a video...", cleartext: "Clear selected video", target: "$videoPreview" },
    webcam: { target: "$webcamPreview" },
}

export default class LocalMediaSelector extends HTMLElement
{
    // Basic component scaffolding
    static get instances() { return instanceCount; }
    static set instances(value) { instanceCount = value; }
    static get observedAttributes() { return ['mediatype']; }
    static register() { if(!customElements.get('local-media-selector')) { customElements.define('local-media-selector', LocalMediaSelector); } }
    connectedCallback() { this._init(); this.__isConnected = true; this.__classOverrride_dispatchEvent(this, 'onconnect'); }
    disconnectedCallback() { this.__isConnected = false; this.__classOverrride_dispatchEvent(this, 'ondisconnect'); }
    adoptedCallback() { this.__classOverrride_dispatchEvent(this, 'onadopted'); }
    __classOverrride_dispatchEvent($target, eventName, data) { if($target == this) { let customEvent = (data) ? new CustomEvent(eventName, { detail: data }) : new CustomEvent(eventName); this.dispatchEvent(customEvent); } Common.dispatchEventToAttributeHandlers($target, eventName, data); }
    
    // component definition
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

        if(name == 'mediatype')
        {
            this.setMediaType(newValue);
        }
        
        this.__classOverrride_dispatchEvent(this, 'onattributechanged', { name: name, oldValue: oldValue, newValue: newValue });
    }

    _init()
    {
        FileSelector.register();
        MediaColorSampler.register();

        this.mediaType = '';

        this._addFunctionalStyles();
        this._createStaticElements();
        this._addEventListeners();
       
        LocalMediaSelector.instances++;
    }
    _addFunctionalStyles()
    {
        if(LocalMediaSelector.instances > 0)
        {
            return;
        }

        let indexStyle = document.styleSheets[0];
        indexStyle.insertRule(`local-media-selector .webcam-permission { display: none; }`);
        indexStyle.insertRule(`local-media-selector.webcam .webcam-permission { display: block; }`);
        indexStyle.insertRule(`local-media-selector.webcam file-selector { display: none; }`);
    }
    _createStaticElements()
    {
        this.eyedropper = (this.getAttribute('eyedropper') == 'true') ? true : false;
        this.useDefault = (this.getAttribute('usedefault') == 'true') ? true : false;
        this.default = this.getAttribute('default');

        this.innerHTML = `<div class="default">
                <label class="field-group">
                    <input class="use-default" type="checkbox" />
                    <div class="title">Use Default?</div>
                </label>
                <img class="default-media" src="" />
            </div>
            <ul class="types">
                <li class="type image"><button data-type="image">Image</button></li>
                <li class="type video"><button data-type="video">Video</button></li>
                <li class="type webcam"><button data-type="webcam">Webcam</button></li>
            </ul>
            <file-selector></file-selector>
            <div class="webcam-permission">
                <p>In order to use your webcam as a video feed, you'll need to grant this page permission. Click the "Request Webcam Permission" button, below, and then choose "Allow" on the browser popup.</p>
                <p>Make sure that your webcam is not already in use by some other application or tab</p>
                <button class="request">Request Webcam Permission</button>
            </div>
            ${(this.eyedropper == true) ? `<media-color-sampler></media-color-sampler>` : ''}
        </div>`;

        this.$useDefault = this.querySelector('.use-default');
        this.$defaultMedia = this.querySelector('.default-media');
        this.$imageButton = this.querySelector('.type.image > button');
        this.$videoButton = this.querySelector('.type.video > button');
        this.$webcamButton = this.querySelector('.type.webcam > button');
        this.$fileSelector = this.querySelector('file-selector');

        this.$webcamPreview = document.createElement('video');

        if(this.eyedropper)
        {
            this.$colorSampler = document.querySelector('media-color-sampler');
        }

        if(this.useDefault)
        {
            this.classList.add('use-default');
            this.$defaultMedia.src = this.default;
        }

        let mediaType = this.getAttribute('mediatype');
        if(mediaType != null)
        {
            this.setMediaType(mediaType);
        }
    }
    _addEventListeners()
    {
        this.$imageButton.addEventListener('click', this._typeButton_onClick.bind(this));
        this.$videoButton.addEventListener('click', this._typeButton_onClick.bind(this));
        this.$webcamButton.addEventListener('click', this._typeButton_onClick.bind(this));

        this.$fileSelector.addEventListener('previewload', this._fileSelector_OnPreviewLoad.bind(this));

        if(this.$colorSampler)
        {
            this.$colorSampler.addEventListener('colorchange', this._eyedropper_onColorChange.bind(this));
        }
    }

    // handlers
    _typeButton_onClick(event)
    {
        this.setMediaType(event.currentTarget.dataset.type);
    }
    
    _eyedropper_onColorChange(event)
    {
        this.__classOverrride_dispatchEvent(this, 'colorchange', event.detail);
    }

    _fileSelector_OnPreviewLoad(event)
    {
        this.value = this.$fileSelector.$input.files[0];
        let parentObject = (this.mediaType == 'webcam') ? this : this.$fileSelector;
        this.$value = parentObject[typeMap[this.mediaType].target];
        
        if(this.eyedropper)
        {
            this.$colorSampler.setSource(parentObject[typeMap[this.mediaType].target]);
        }

        this.__classOverrride_dispatchEvent(this, 'sourcechange', { value: this.value, $value: this.$value });
    }

    // functionality
    setMediaType(mediaType)
    {
        // TODO: Clear selected value
        
        this.mediaType = mediaType;
        if(this.mediaType == 'webcam')
        {
            this.classList.add('webcam');
        }
        else
        {
            this.classList.remove('webcam');
            this.$fileSelector.setAttribute('filetypes', typeMap[mediaType].filetypes);
            this.$fileSelector.setAttribute('icon', typeMap[mediaType].icon);
            this.$fileSelector.setAttribute('browsetext', typeMap[mediaType].browsetext);
            this.$fileSelector.setAttribute('cleartext', typeMap[mediaType].cleartext);
        }
    }
}
