import LocalMediaSelector from "../assets/libs/local-media-selector/local-media-selector.dep.js";
import RangeValue from '../assets/libs/range-value/range-value.dep.js';
import MediaColorSampler from "../assets/libs/local-media-selector/dependencies/media-color-sampler.dep.js";

export default class TesterApp
{
    constructor()
    {

    }
    async init()
    {
        this._registerWebComponents();
        this._getStaticElements();
        this._createDynamicElements();
        this._addEventListeners();
    }
    _registerWebComponents()
    {
        LocalMediaSelector.register();
        MediaColorSampler.register();
        RangeValue.register();
    }
    _getStaticElements()
    {
        this.$configuration = document.querySelector('.app > .config');
        this.$configurationOptionsMenu = this.$configuration.querySelector('.options .menu');
        this.$configurationOptionsMenu.$basicMat = this.$configurationOptionsMenu.querySelector('.menu-item[data-page="basic-mat"]');
        this.$configurationOptionsMenu.$hsl = this.$configurationOptionsMenu.querySelector('.menu-item[data-page="hsl"]');
    }
    _createDynamicElements()
    {

    }
    _addEventListeners()
    {
        this.$configurationOptionsMenu.$basicMat.addEventListener('click', this._configurationOption_onClick.bind(this));
        this.$configurationOptionsMenu.$hsl.addEventListener('click', this._configurationOption_onClick.bind(this));
    }

    //handlers
    _configurationOption_onClick(event)
    {
        let button = event.currentTarget;
        this.showConfigPage(button.dataset.page);
    }

    //functionality
    showConfigPage(pageName)
    {
        this.$configuration.dataset.page = pageName;
    }
}