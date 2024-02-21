export interface IGetPlantList {
    data: IBasePlant[];
    to: number;
    per_page: number;
    current_page: number;
    from: number;
    last_page: number;
    total: number;
}

export interface IBasePlant {
    id: number;
    common_name: string;
    scientific_name: string[];
    other_name: string[];
    cycle: string;
    watering: WateringOptionsEnum;
    sunlight: SunlightOptionsEnum[];
    default_image?: IDefaultImage;
}

export interface IDefaultImage {
    license: number;
    license_name: string;
    license_url: string;
    original_url: string;
    regular_url: string;
    medium_url: string;
    small_url: string;
    thumbnail: string;
}

export enum WateringOptionsEnum {
    Frequent = "frequent",
    Average = "average",
}

export enum SunlightOptionsEnum {
    FullSun = "full sun",
    PartShade = "part shade",
    FilteredShade = "filtered shade",
}

export interface IPlantDetails extends IBasePlant {
    attracts: any[];
    "care-guides": string;
    care_level: any;
    cones: boolean;
    cuisine: boolean;
    depth_water_requirement: any[];
    description: string;
    dimension: string;
    dimensions: Dimensions;
    drought_tolerant: boolean;
    edible_fruit: boolean;
    edible_fruit_taste_profile: string;
    edible_leaf: boolean;
    family: any;
    flower_color: string;
    flowering_season: any;
    flowers: boolean;
    fruit_color: any[];
    fruit_nutritional_value: string;
    fruits: boolean;
    growth_rate: string;
    hardiness: Hardiness;
    hardiness_location: HardinessLocation;
    harvest_season: any;
    indoor: boolean;
    invasive: boolean;
    leaf: boolean;
    leaf_color: string[];
    maintenance: any;
    medicinal: boolean;
    origin: string[];
    other_images: string;
    pest_susceptibility: any[];
    pest_susceptibility_api: string;
    plant_anatomy: any[];
    poisonous_to_humans: number;
    poisonous_to_pets: number;
    propagation: string[];
    pruning_count: any[];
    pruning_month: string[];
    salt_tolerant: boolean;
    seeds: number;
    soil: any[];
    thorny: boolean;
    tropical: boolean;
    type: string;
    volume_water_requirement: any[];
    watering_general_benchmark: WateringGeneralBenchmark;
    watering_period: any;
}

export interface DefaultImage {
    license: number;
    license_name: string;
    license_url: string;
    medium_url: string;
    original_url: string;
    regular_url: string;
    small_url: string;
    thumbnail: string;
}

export interface Dimensions {
    max_value: number;
    min_value: number;
    type: string;
    unit: string;
}

export interface Hardiness {
    max: string;
    min: string;
}

export interface HardinessLocation {
    full_iframe: string;
    full_url: string;
}

export interface WateringGeneralBenchmark {
    unit: string;
    value: any;
}

export interface IPlantGuide {
    id: number;
    species_id: number;
    common_name: string;
    scientific_name: string[];
    section: Section[];
}

export interface Section {
    id: number;
    type: string;
    description: string;
}
