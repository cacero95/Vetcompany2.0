export interface Publicaciones {
    imagen:string;
    mensaje:string;
    origen:string;
}
export interface Body {
    cuerpo: Cuerpo;
}

export interface Cuerpo {
    statuses?:        Status[];
    search_metadata?: SearchMetadata;
}

export interface SearchMetadata {
    completed_in: number;
    max_id:       number;
    max_id_str:   string;
    next_results: string;
    query:        string;
    refresh_url:  string;
    count:        number;
    since_id:     number;
    since_id_str: string;
}

export interface Status {
    created_at:                string;
    id:                        number;
    id_str:                    string;
    text:                      string;
    truncated:                 boolean;
    entities:                  StatusEntities;
    extended_entities:         Extended_entities;
    metadata:                  Metadata;
    source:                    string;
    in_reply_to_status_id:     null;
    in_reply_to_status_id_str: null;
    in_reply_to_user_id:       null;
    in_reply_to_user_id_str:   null;
    in_reply_to_screen_name:   null;
    user:                      StatusUser;
    geo:                       null;
    coordinates:               null;
    place:                     null;
    contributors:              null;
    is_quote_status:           boolean;
    retweet_count:             number;
    favorite_count:            number;
    favorited:                 boolean;
    retweeted:                 boolean;
    possibly_sensitive?:       boolean;
    lang:                      string;
    retweeted_status?:         RetweetedStatus;
}
export interface Extended_entities{
    
    media:Media[];

}
export interface Media {
    display_url: string;
    expanded_url: string;
    id: number;
    media_url: string;
    media_url_https: string;
    url:string;
    type:string;
}
export interface StatusEntities {
    hashtags:      any[];
    symbols:       any[];
    user_mentions: UserMention[];
    urls:          URL[];
}

export interface URL {
    url:          string;
    expanded_url: string;
    display_url:  string;
    indices:      number[];
}

export interface UserMention {
    screen_name: string;
    name:        string;
    id:          number;
    id_str:      string;
    indices:     number[];
}

export interface Metadata {
    iso_language_code: string;
    result_type:       string;
}

export interface RetweetedStatus {
    created_at:                string;
    id:                        number;
    id_str:                    string;
    text:                      string;
    truncated:                 boolean;
    entities:                  StatusEntities;
    metadata:                  Metadata;
    source:                    string;
    in_reply_to_status_id:     null;
    in_reply_to_status_id_str: null;
    in_reply_to_user_id:       null;
    in_reply_to_user_id_str:   null;
    in_reply_to_screen_name:   null;
    user:                      RetweetedStatusUser;
    geo:                       null;
    coordinates:               null;
    place:                     Place;
    contributors:              null;
    is_quote_status:           boolean;
    retweet_count:             number;
    favorite_count:            number;
    favorited:                 boolean;
    retweeted:                 boolean;
    possibly_sensitive:        boolean;
    lang:                      string;
}

export interface Place {
    id:               string;
    url:              string;
    place_type:       string;
    name:             string;
    full_name:        string;
    country_code:     string;
    country:          string;
    contained_within: any[];
    bounding_box:     BoundingBox;
    attributes:       Attributes;
}

export interface Attributes {
}

export interface BoundingBox {
    type:        string;
    coordinates: Array<Array<number[]>>;
}

export interface RetweetedStatusUser {
    id:                                 number;
    id_str:                             string;
    name:                               string;
    screen_name:                        string;
    location:                           string;
    description:                        string;
    url:                                string;
    entities:                           UserEntities;
    protected:                          boolean;
    followers_count:                    number;
    friends_count:                      number;
    listed_count:                       number;
    created_at:                         string;
    favourites_count:                   number;
    utc_offset:                         null;
    time_zone:                          null;
    geo_enabled:                        boolean;
    verified:                           boolean;
    statuses_count:                     number;
    lang:                               string;
    contributors_enabled:               boolean;
    is_translator:                      boolean;
    is_translation_enabled:             boolean;
    profile_background_color:           string;
    profile_background_image_url:       null;
    profile_background_image_url_https: null;
    profile_background_tile:            boolean;
    profile_image_url:                  string;
    profile_image_url_https:            string;
    profile_link_color:                 string;
    profile_sidebar_border_color:       string;
    profile_sidebar_fill_color:         string;
    profile_text_color:                 string;
    profile_use_background_image:       boolean;
    has_extended_profile:               boolean;
    default_profile:                    boolean;
    default_profile_image:              boolean;
    following:                          boolean;
    follow_request_sent:                boolean;
    notifications:                      boolean;
    translator_type:                    string;
}

export interface UserEntities {
    url?:        Description;
    description: Description;
}

export interface Description {
    urls: URL[];
}

export interface StatusUser {
    id:                                 number;
    id_str:                             string;
    name:                               string;
    screen_name:                        string;
    location:                           string;
    description:                        string;
    url:                                null | string;
    entities:                           UserEntities;
    protected:                          boolean;
    followers_count:                    number;
    friends_count:                      number;
    listed_count:                       number;
    created_at:                         string;
    favourites_count:                   number;
    utc_offset:                         null;
    time_zone:                          null;
    geo_enabled:                        boolean;
    verified:                           boolean;
    statuses_count:                     number;
    lang:                               string;
    contributors_enabled:               boolean;
    is_translator:                      boolean;
    is_translation_enabled:             boolean;
    profile_background_color:           string;
    profile_background_image_url:       null | string;
    profile_background_image_url_https: null | string;
    profile_background_tile:            boolean;
    profile_image_url:                  string;
    profile_image_url_https:            string;
    profile_link_color:                 string;
    profile_sidebar_border_color:       string;
    profile_sidebar_fill_color:         string;
    profile_text_color:                 string;
    profile_use_background_image:       boolean;
    has_extended_profile:               boolean;
    default_profile:                    boolean;
    default_profile_image:              boolean;
    following:                          boolean;
    follow_request_sent:                boolean;
    notifications:                      boolean;
    translator_type:                    string;
    profile_banner_url?:                string;
}