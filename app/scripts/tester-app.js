import LocalMediaSelector from "../assets/libs/local-media-selector/local-media-selector.dep.js";
import RangeValue from '../assets/libs/range-value/range-value.dep.js';

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
        RangeValue.register();
    }
    _getStaticElements()
    {

    }
    _createDynamicElements()
    {

    }
    _addEventListeners()
    {

    }

    //handlers

    //functionality

}