export interface ILocation {
    id: string;
    name: string;
}

export interface ILocationCountry extends ILocation {
    states: ILocationState[];
}

export interface ILocationState extends ILocation {
    cities: ILocationCity[];
}

export interface ILocationCity extends ILocation {
    neighborhoods: ILocation[];
}