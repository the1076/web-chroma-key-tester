import LocalMediaSelector from "../assets/libs/local-media-selector/local-media-selector.dep.js";
import RangeValue from '../assets/libs/range-value/range-value.dep.js';
import MediaColorSampler from "../assets/libs/local-media-selector/dependencies/media-color-sampler.dep.js";

const defaultSettings = 
{
    useDefault_input: true,
    input_src: 'assets/videos/chicken.mp4',
    input_width: 1280,
    input_height: 720,
    colorKey: '#0C982A',
    useDefault_replacement: true,
    replacement_src: 'assets/videos/replacement.mp4',
    replacement_width: 1280,
    replacement_height: 720,
    configType: 'basic-mat',
    basicMatTolerance_close: 30,
    basicMatTolerance_far: 50,
    threshold_h: 10,
    threshold_s: .4,
    threshold_l: .4
};

export default class TesterApp
{
    constructor()
    {
        this.$inputSource;
        this.$replacementSource;

        this.replacementFunction = null;
    }
    async init()
    {
        this._registerWebComponents();
        this._getStaticElements();
        this._createDynamicElements();
        this._addEventListeners();
        this._applyDefaults();
    }
    _registerWebComponents()
    {
        LocalMediaSelector.register();
        MediaColorSampler.register();
        RangeValue.register();
    }
    _getStaticElements()
    {
        this.$sourceSelector_input = document.querySelector('.app .setup .source-selector.input');
        this.$sourceSelector_input.$useDefault = this.$sourceSelector_input.querySelector('.use-default input[type="checkbox"]');
        this.$sourceSelector_input.$colorSampler = this.$sourceSelector_input.querySelector('media-color-sampler');
        this.$sourceSelector_input.$mediaSelector = this.$sourceSelector_input.querySelector('local-media-selector');
        this.$sourceSelector_input.$default = this.$sourceSelector_input.querySelector('.default');
        this.$sourceSelector_input.$default.$media = this.$sourceSelector_input.$default.querySelector('.media');
        this.$sourceSelector_replacement = document.querySelector('.app .setup .source-selector.replacement');
        this.$sourceSelector_replacement.$useDefault = this.$sourceSelector_replacement.querySelector('.use-default input[type="checkbox"]');
        this.$sourceSelector_replacement.$mediaSelector = this.$sourceSelector_replacement.querySelector('local-media-selector');
        this.$sourceSelector_replacement.$default = this.$sourceSelector_replacement.querySelector('.default');
        this.$sourceSelector_replacement.$default.$media = this.$sourceSelector_replacement.$default.querySelector('.media');

        this.$configuration = document.querySelector('.app > .config');
        this.$configurationOptionsMenu = this.$configuration.querySelector('.options .menu');
        this.$configurationOptionsMenu.$basicMat = this.$configurationOptionsMenu.querySelector('.menu-item[data-page="basic-mat"]');
        this.$configurationOptionsMenu.$hsl = this.$configurationOptionsMenu.querySelector('.menu-item[data-page="hsl"]');
        
        this.$configurationPages = this.$configuration.querySelector('.pages');
        this.$configurationPages.$basicMat = this.$configurationPages.querySelector('.page.basic-mat');
        this.$configurationPages.$basicMat.$tolerance_close = this.$configurationPages.$basicMat.querySelector('.tolerance-close range-value');
        this.$configurationPages.$basicMat.$tolerance_far = this.$configurationPages.$basicMat.querySelector('.tolerance-far range-value');
        this.$configurationPages.$hsl = this.$configurationPages.querySelector('.page.hsl');
        this.$configurationPages.$hsl.$threshold_hue = this.$configurationPages.$hsl.querySelector('.hue range-value');
        this.$configurationPages.$hsl.$threshold_saturation = this.$configurationPages.$hsl.querySelector('.saturation range-value');
        this.$configurationPages.$hsl.$threshold_luminosity = this.$configurationPages.$hsl.querySelector('.luminosity range-value');
    }
    _createDynamicElements()
    {

    }
    _addEventListeners()
    {
        this.$sourceSelector_input.$useDefault.addEventListener('change', this._useDefault_onChange.bind(this));
        this.$sourceSelector_replacement.$useDefault.addEventListener('change', this._useDefault_onChange.bind(this));

        this.$sourceSelector_input.$colorSampler.addEventListener('colorchange', this._colorSample_onColorChange.bind(this));

        this.$configurationOptionsMenu.$basicMat.addEventListener('click', this._configurationOption_onClick.bind(this));
        this.$configurationOptionsMenu.$hsl.addEventListener('click', this._configurationOption_onClick.bind(this));
    }
    _applyDefaults()
    {
        this.$sourceSelector_input.$default.$media.src = defaultSettings.input_src;
        this.$sourceSelector_input.$default.$media.width = defaultSettings.input_width;
        this.$sourceSelector_input.$default.$media.height = defaultSettings.input_height;
        this.$sourceSelector_input.$useDefault.checked = defaultSettings.useDefault_input;
        this.setUseDefault('input', defaultSettings.useDefault_input);
        this.$sourceSelector_input.$mediaSelector.mediaType = 'image';

        this.$sourceSelector_replacement.$default.$media.src = defaultSettings.replacement_src;
        this.$sourceSelector_replacement.$default.$media.width = defaultSettings.replacement_width;
        this.$sourceSelector_replacement.$default.$media.height = defaultSettings.replacement_height;
        this.$sourceSelector_replacement.$useDefault.checked = defaultSettings.useDefault_replacement;
        this.setUseDefault('replacement', defaultSettings.useDefault_replacement);
        this.$sourceSelector_replacement.$mediaSelector.mediaType = 'image';

        this.$configurationPages.$basicMat.$tolerance_close.value = defaultSettings.basicMatTolerance_close;
        this.$configurationPages.$basicMat.$tolerance_far.value = defaultSettings.basicMatTolerance_far;
        this.$configurationPages.$hsl.$threshold_hue.value = defaultSettings.threshold_h;
        this.$configurationPages.$hsl.$threshold_saturation.value = defaultSettings.threshold_s;
        this.$configurationPages.$hsl.$threshold_luminosity.value = defaultSettings.threshold_l;
        this.showConfigPage(defaultSettings.configType);
    }

    //handlers
    _useDefault_onChange(event)
    {
        let $input = event.currentTarget;
        this.setUseDefault($input.dataset.source, $input.checked);
    }

    _colorSample_onColorChange(event)
    {
        let color = event.detail.color;
    }

    _configurationOption_onClick(event)
    {
        let button = event.currentTarget;
        this.showConfigPage(button.dataset.page);
    }

    //functionality
    setUseDefault(target, value)
    {
        let $sourceSelector = this[`$sourceSelector_${target}`];
        this[`$${target}Source`] = $sourceSelector.$default.$media;
        if(value === true)
        {
            if(target === 'input')
            {
                this.$sourceSelector_input.$colorSampler.setColor(defaultSettings.colorKey);
                this.$sourceSelector_input.$colorSampler.setSource(null);
                this.$sourceSelector_input.$colorSampler.disabled = true;
            }
            $sourceSelector.classList.add('default');
        }
        else
        {
            if(target === 'input')
            {
                this.$sourceSelector_input.$colorSampler.setSource(this.$sourceSelector_input.$mediaSelector.$value);
                this.$sourceSelector_input.$colorSampler.disabled = false;
            }
            $sourceSelector.classList.remove('default');
        }
    }
    showConfigPage(pageName)
    {
        this.$configuration.dataset.page = pageName;
    }
}