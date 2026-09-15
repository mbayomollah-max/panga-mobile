export interface PublicHousing {
  housing_id: string;
  parcel_code: string;
  type_name: string;
  state: string;
  has_equip: boolean;
  surface: number;
  prix: number;
  cover_url?: string;
  quarter_name: string;
  township_name: string;
  town_name: string;
}

export interface Equip {
  equip_id: string;
  name: string;
}

export interface HousingCaract {
  caract_id: string;
  name: string;
  number: number;
}

export interface HousingPicture {
  pictures_id: string;
  housing_id: string;
  path: string;
  position: number;
  url: string;
}

export interface ListingDetail extends PublicHousing {
  equips: Equip[];
  caracts: HousingCaract[];
  pictures: HousingPicture[];
  owner_rating?: number | null;
  review_count: number;
  owner_name: string;
  owner_avatar?: string | null;
  owner_verified?: boolean;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  guarantee_reference?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  identity_id: string;
  display_name: string;
  avatar_url?: string;
  verified: boolean;
  rating: number;
  review_count: number;
  is_landlord: boolean;
  created_at?: string;
}