export default class Common
{
    static getPackage()
    {

    }

    static dispatchEventToAttributeHandlers($target, eventName, data)
    {
        let handlerAttributeName = 'on' + eventName;
        let onEvent = $target.getAttribute(handlerAttributeName);
        if(onEvent)
        {
            try
            {
                onEvent = onEvent.split('.').reduce((o,i)=> { return o[i]; }, window);
                onEvent({target: $target, detail: data });
            }
            catch(exception)
            {
                console.error("Unable to execute callback: " + exception.message);
            }
        }
    }

    static getUUID()
    {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
    }

    static toKebabCase(value)
    {
        value.replace(/\\.+$/, "") //trim trailing periods
                .replace(/[^\w\d\s]/g, '') //replace symbols
                .replace(/\s+/g, '-') //switch spaces for dashes
                .replace(/[A-Z]+/g, function ($1, offset, string) //replace capitals with dash then character
                {
                    if (string.indexOf($1) == 0)
                    {
                        return $1;
                    }

                    if (string.substring(string.indexOf($1) - 1, string.indexOf($1)) == '-')
                    {
                        return $1;
                    }

                    return '-' + $1;
                })
                .toLowerCase(); //make the whole thing lowercase
        
        return value;
    }
}