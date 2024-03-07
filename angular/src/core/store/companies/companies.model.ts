export interface CompanyEntity {
  data: Company;
  isSelected: boolean;
}

export interface Company {
  id: number;
  name: string;
  vatin: string; // nip
  owner: {
    data: {
      id: number;
      first_name: string;
      last_name: string;
      avatar: string; // img file name
    }
  };
  logoUrl?: string;
}
