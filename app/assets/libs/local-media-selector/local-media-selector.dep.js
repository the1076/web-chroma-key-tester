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
    get mediaType()
    {
        return this._mediaType;
    }
    set mediaType(value)
    {
        if(!this.__isConnected)
        {
            return;
        }
        
        this.setMediaType(value);
    }
    
    get webcamWidth()
    {
        return this._webcamWidth;
    }
    set webcamWidth(value)
    {
        if(!this.__isConnected)
        {
            return;
        }
        
        this._webcamWidth = value;
        this.$webcamPreview.width = value;
    }
    
    get webcamHeight()
    {
        return this._webcamHeight;
    }
    set webcamHeight(value)
    {
        if(!this.__isConnected)
        {
            return;
        }
        
        this._webcamHeight = value;
        this.$webcamPreview.height = value;
    }

    constructor(attributes)
    {
        super();

        this.webcamAccess = false;

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

        if(name == 'webcamwidth')
        {
            this.webcamWidth = newValue;
            this.$webcamPreview.width = newValue;
        }

        if(name == 'webcamheight')
        {
            this.webcamHeight = newValue;
            this.$webcamPreview.height = newValue;
        }
        
        this.__classOverrride_dispatchEvent(this, 'onattributechanged', { name: name, oldValue: oldValue, newValue: newValue });
    }

    _init()
    {
        FileSelector.register();

        this.mediaType = '';

        this._addFunctionalStyles();
        this._createStaticElements();
        this._addEventListeners();

        typeMap.image.$buttonElement = this.$imageButton;
        typeMap.video.$buttonElement = this.$videoButton;
        typeMap.webcam.$buttonElement = this.$webcamButton;
       
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
        indexStyle.insertRule(`local-media-selector.webcam .webcam-permission { display: flex; }`);
        indexStyle.insertRule(`local-media-selector.webcam file-selector { display: none; }`);
        indexStyle.insertRule(`local-media-selector .webcam-permission .streaming .media { background-color: #000 }`);
    }
    _createStaticElements()
    {
        this.innerHTML = `<ul class="types">
                <li class="type image" data-type="image">Image</li>
                <li class="type video" data-type="video">Video</li>
                <li class="type webcam" data-type="webcam">Webcam</li>
            </ul>
            <div class="content">
                <file-selector></file-selector>
                <div class="webcam-permission">
                    <p>In order to use your webcam as a video feed, you'll need to grant this page permission. Click the "Start Streaming" button, below, and then choose "Allow" on the browser popup.</p>
                    <p>Make sure that your webcam is not already in use by some other application or tab</p>
                    <div class="streaming">
                        <video class="media"></video>
                        <ul class="controls">
                            <li class="control start"><button>Start Streaming</button></li>
                            <li class="control toggle-playback"><button>Pause</button></li>
                            <li class="control end"><button>End Streaming</button></li>
                        </ul>
                    </div>
                </div>
                ${(this.eyedropper == true) ? `<media-color-sampler></media-color-sampler>` : ''}
            </div>
        </div>`;

        this.$imageButton = this.querySelector('.type.image');
        this.$videoButton = this.querySelector('.type.video');
        this.$webcamButton = this.querySelector('.type.webcam');
        this.$fileSelector = this.querySelector('file-selector');

        this.$streaming = this.querySelector('.webcam-permission .streaming');
        this.$webcamPreview = this.$streaming.querySelector('.media');
        this.$streaming.$controls = this.$streaming.querySelector('.controls');
        this.$streaming.$controls.$start = this.$streaming.querySelector('.start');
        this.$streaming.$controls.$togglePlayback = this.$streaming.querySelector('.toggle-playback');
        this.$streaming.$controls.$end = this.$streaming.querySelector('.end');
        
        let mediaType = this.getAttribute('mediatype');
        if(mediaType != null)
        {
            this.setMediaType(mediaType);
        }

        this._webcamWidth = this.getAttribute('webcamwidth') || 1280;
        this._webcamHeight = this.getAttribute('webcamheight') || 720;

    }
    _addEventListeners()
    {
        this.$imageButton.addEventListener('click', this._typeButton_onClick.bind(this));
        this.$videoButton.addEventListener('click', this._typeButton_onClick.bind(this));
        this.$webcamButton.addEventListener('click', this._typeButton_onClick.bind(this));

        this.$fileSelector.addEventListener('previewload', this._fileSelector_OnPreviewLoad.bind(this));

        this.$streaming.$controls.$start.addEventListener('click', this._webcam_start_onClick.bind(this));
        this.$streaming.$controls.$togglePlayback.addEventListener('click', this._webcam_togglePlayback_onClick.bind(this));
        this.$streaming.$controls.$end.addEventListener('click', this._webcam_end_onClick.bind(this));
    }

    // handlers
    _typeButton_onClick(event)
    {
        this.setMediaType(event.currentTarget.dataset.type);
    }

    _fileSelector_OnPreviewLoad(event)
    {
        this.value = this.$fileSelector.$input.files[0];
        this.$value = this.$fileSelector[typeMap[this.mediaType].target];

        this.__classOverrride_dispatchEvent(this, 'sourcechange', { value: this.value, $value: this.$value });
    }

    _webcam_start_onClick(event)
    {
        this.startWebcamStream();
    }
    _webcam_togglePlayback_onClick(event)
    {
        if(this.$webcamPreview.paused)
        {
            this.$webcamPreview.play();
            this.$streaming.$controls.$togglePlayback.textContet = "Pause";
        }
        else
        {
            this.$webcamPreview.pause();
            this.$streaming.$controls.$togglePlayback.textContet = "Play";
        }
    }
    _webcam_end_onClick(event)
    {
        this.endWebcamStream();
    }

    // functionality
    setMediaType(mediaType)
    {
        this.$fileSelector.clearSelection();
        this.value = null;
        this.$value = null;
        this.__classOverrride_dispatchEvent(this, 'sourcechange', { value: this.value, $value: this.$value });

        this._mediaType = mediaType;

        for(let property in typeMap)
        {
            if(typeMap.hasOwnProperty(property))
            {
                if(property == this.mediaType)
                {
                    this['$' + property + 'Button'].classList.add('selected');
                }
                else
                {
                    this['$' + property + 'Button'].classList.remove('selected');
                }
            }
        }
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
    setMediaAsElement($element)
    {
        if($element.tagName.toUpperCase() == 'IMG') { this.setMediaType('image'); }
        else if($element.tagName.toUpperCase() == 'VIDEO') { this.setMediaType('video'); }
        else { console.error("Must set media as an image or video element."); }
        this.value = $element;
        this.$value = $element;
    }

    async startWebcamStream()
    {
        if(this.webcamStream != null)
        {
            return;
        }

        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        {
            try
            {
                this.webcamStream = await navigator.mediaDevices.getUserMedia({ video: { width: this.webcamWidth, height: this.webcamHeight } });
            }
            catch(exception)
            {
                console.error(exception);
                alert('The camera is unavailable. Make sure you have a camera connected to your device and that the camera is not in use by another process (like another browser, or tab).');
                return;
            }
        }
        else
        {
            alert('The camera API is unavailable. Make sure you have an up-to-date version of either Google Chrome, Mozilla Firefox, or Microsoft Edge.');
            return;
        }

        this.$webcamPreview.width = this.webcamWidth;
        this.$webcamPreview.height = this.webcamHeight;
        this.$webcamPreview.srcObject = this.webcamStream;

        this.$webcamPreview.play();

        
        this.value = 'webcam';
        this.$value = this.$webcamPreview;
        this.__classOverrride_dispatchEvent(this, 'sourcechange', { value: this.value, $value: this.$value });
    }
    endWebcamStream()
    {
        this.$webcamPreview.pause();
        let track = this.webcamStream.getTracks()[0];
        track.stop();

        this.webcamStream = null;
        this.value = null;
        this.$value = null;
        this.__classOverrride_dispatchEvent(this, 'sourcechange', { value: this.value, $value: this.$value });
    }
}
