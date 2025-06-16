class Flags  {
    constructor(flagNames) {
        if( !flagNames || ! Array.isArray(flagNames) ) {
            throw new Error('flag names must be an array');
        }

        this.flagEnum = {};
        for(let i = 0; i < flagNames.length; i++) {
            this.flagEnum[flagNames[i]] = 2 * i;
        }

        this.flags = 0;
    }

    from(event) {
        this.reset();
        for (var property in event) {
            if (this.flagEnum.hasOwnProperty(property)) {
                this.flags = this.flags | this.flagEnum[property];
            }
        }
        return this.flags;
    }

    reset() {
        this.flags = 0;
    }

    isSet(flagName) {
        if( this.flagEnum && this.flagEnum[flagName] ) {
            return this.flags & this.flagEnum[flagName];
        }
        return 0;
    }

    set(flagName) {
        if( this.flagEnum && this.flagEnum.hasOwnProperty(flagName) ) {
            this.flags = this.flags | this.flagEnum[flagName];
        }
        return this.flags;
    }
}

module.exports = Flags;